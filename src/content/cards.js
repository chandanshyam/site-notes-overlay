// The stack of note cards inside the panel. Each card is one Note; edits autosave
// on a short debounce. Delete requires a two-step confirm to avoid accidents.
//
// Design: the card defers to the page at rest — spine + title + body only — and
// reveals its action row on hover/focus. Controls use one line-icon set (single
// stroke, currentColor); delete and color live in a small overflow (⋯) menu.

import {
  loadNotesForHost,
  saveNote,
  deleteNote,
  generateId,
  loadMeta,
  saveMeta,
} from "./storage.js";
import { COLORS, colorValue, applyNoteColor, onSchemeChange } from "./theme.js";
import { renderMarkdown, toggleTask } from "./editor.js";

const SAVE_DELAY = 300;
const CONFIRM_MS = 2000;

// One line-icon set: single stroke weight, currentColor, drawn on a 16px grid.
const ICONS = {
  eye: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 8s2.6-4.5 7-4.5S15 8 15 8s-2.6 4.5-7 4.5S1 8 1 8Z"/><circle cx="8" cy="8" r="1.9"/></svg>`,
  pencil: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 2.5 13.5 5.5 6 13H3v-3z"/><path d="M9.5 3.5 12.5 6.5"/></svg>`,
  globe: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M2 8h12"/><path d="M8 2c1.9 2 1.9 10 0 12M8 2c-1.9 2-1.9 10 0 12"/></svg>`,
  link: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 9.4 9.4 6.6"/><path d="M7.2 4.5 8 3.7a2.6 2.6 0 0 1 3.7 3.7l-1.2 1.2"/><path d="M8.8 11.5 8 12.3a2.6 2.6 0 0 1-3.7-3.7l1.2-1.2"/></svg>`,
  open: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11 11 5"/><path d="M6 5h5v5"/></svg>`,
  overflow: `<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="3.5" cy="8" r="1.35"/><circle cx="8" cy="8" r="1.35"/><circle cx="12.5" cy="8" r="1.35"/></svg>`,
  trash: `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5h10"/><path d="M6.4 4.5V3h3.2v1.5"/><path d="M4.6 4.5 5.2 12.5a1 1 0 0 0 1 .9h3.6a1 1 0 0 0 1-.9l.6-8"/></svg>`,
};

function debounced(fn, delay) {
  let t = null;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
}

// site-scoped notes show on every page of the host; url-scoped notes show only
// on the exact href where they were pinned. Icon-only, tooltip carries the copy.
function labelScope(el, note) {
  const isUrl = note.scope === "url";
  el.innerHTML = isUrl ? ICONS.link : ICONS.globe;
  el.title = isUrl
    ? "Shows only on this page — click for whole site"
    : "Shows on the whole site — click to pin to this page";
}

function buildCard(note, href) {
  const card = document.createElement("div");
  card.className = "sn-card";
  card.dataset.noteId = note.id;
  card.innerHTML = `
    <span class="sn-local-dot" title="Too large to sync — saved on this device only" hidden></span>
    <div class="sn-card-header">
      <input class="sn-card-title" placeholder="Untitled" spellcheck="false">
      <div class="sn-card-actions">
        <button class="sn-icon-btn sn-preview-toggle" title="Preview">${ICONS.eye}</button>
        <button class="sn-icon-btn sn-scope-toggle"></button>
        <a class="sn-icon-btn sn-card-open" target="_blank" rel="noopener noreferrer">${ICONS.open}</a>
        <button class="sn-icon-btn sn-overflow-btn" title="More…">${ICONS.overflow}</button>
      </div>
    </div>
    <textarea class="sn-card-body" placeholder="Write something…" spellcheck="false"></textarea>
    <div class="sn-card-preview" hidden></div>
  `;

  const titleEl = card.querySelector(".sn-card-title");
  const bodyEl = card.querySelector(".sn-card-body");
  const previewEl = card.querySelector(".sn-card-preview");
  const previewBtn = card.querySelector(".sn-preview-toggle");
  const scopeEl = card.querySelector(".sn-scope-toggle");
  const openEl = card.querySelector(".sn-card-open");
  const dotEl = card.querySelector(".sn-local-dot");
  titleEl.value = note.title || "";
  bodyEl.value = note.text || "";
  labelScope(scopeEl, note);

  // ↗ opens the page/site this note belongs to: a url-scoped note links to its
  // exact page, a site-scoped note links to the host's home.
  function updateOpenLink() {
    let target;
    try {
      target = note.scope === "url" && note.url ? note.url : new URL(href).origin + "/";
    } catch {
      target = href;
    }
    openEl.href = target;
    openEl.title = note.scope === "url" ? "Open this page" : "Open site home";
  }
  updateOpenLink();

  function updateBadge() {
    // synced is recomputed on every save; false means it exceeded the sync cap.
    dotEl.hidden = note.synced !== false;
  }
  updateBadge();

  const save = debounced(async () => {
    await saveNote(note);
    updateBadge();
  }, SAVE_DELAY);
  titleEl.addEventListener("input", () => {
    note.title = titleEl.value;
    save();
  });
  bodyEl.addEventListener("input", () => {
    note.text = bodyEl.value;
    save();
  });

  // ---- markdown preview (read-only) with live task checkboxes ----
  let previewMode = false;

  function renderPreview() {
    previewEl.innerHTML = renderMarkdown(note.text);
    // marked emits task checkboxes as disabled inputs; make them interactive.
    previewEl.querySelectorAll('input[type="checkbox"]').forEach((box, i) => {
      box.disabled = false;
      box.addEventListener("click", (e) => {
        e.preventDefault(); // checked state is derived from the raw text, not the box
        note.text = toggleTask(note.text, i);
        bodyEl.value = note.text;
        renderPreview();
        saveNote(note).then(updateBadge);
      });
    });
  }

  function hasContent() {
    return (note.text || "").trim().length > 0;
  }

  function setPreview(on) {
    previewMode = on;
    previewBtn.innerHTML = on ? ICONS.pencil : ICONS.eye;
    previewBtn.title = on ? "Edit" : "Preview";
    bodyEl.hidden = on;
    previewEl.hidden = !on;
    if (on) renderPreview();
    else bodyEl.focus();
  }

  previewBtn.addEventListener("click", () => setPreview(!previewMode));

  // A note with content opens in the rendered "readme" view, not the raw
  // editor; empty notes open in the editor so you can start typing.
  if (hasContent()) setPreview(true);

  // Once you finish editing (focus leaves the textarea), the note has been
  // saved, so flip back to the rendered view. Guard the preview toggle: its
  // mousedown fires just before this blur, so we skip the auto-flip and let the
  // button's own click own the transition.
  let togglingView = false;
  previewBtn.addEventListener("mousedown", () => { togglingView = true; });
  bodyEl.addEventListener("blur", () => {
    if (togglingView) { togglingView = false; return; }
    if (hasContent()) setPreview(true);
  });

  // Clicking the rendered view (anywhere but a checkbox or link) drops back into
  // the editor.
  previewEl.addEventListener("click", (e) => {
    if (e.target.closest('input[type="checkbox"]') || e.target.closest("a")) return;
    setPreview(false);
  });

  // Scope is a discrete action, so save immediately rather than debounced.
  scopeEl.addEventListener("click", () => {
    if (note.scope === "url") {
      note.scope = "site";
      note.url = null;
    } else {
      note.scope = "url";
      note.url = href;
    }
    labelScope(scopeEl, note);
    updateOpenLink();
    saveNote(note);
  });

  // ---- overflow (⋯) menu: color + set-default + delete ----
  applyNoteColor(card, note.color);

  const menu = document.createElement("div");
  menu.className = "sn-overflow-menu";
  menu.hidden = true;
  menu.innerHTML = `
    <div class="sn-color-row">
      ${COLORS.map(
        (c) => `<button class="sn-color-option" data-color="${c.id}" title="${c.label}"></button>`
      ).join("")}
    </div>
    <button class="sn-menu-item sn-set-default">Set as site default</button>
    <button class="sn-menu-item sn-card-delete">Delete note</button>
  `;
  card.appendChild(menu);

  function paintSwatches() {
    menu.querySelectorAll(".sn-color-option").forEach((btn) => {
      const c = colorValue(btn.dataset.color);
      // neutral resolves to transparent — show it as an empty ring, not blank.
      btn.style.background = c === "transparent" ? "transparent" : c;
      btn.classList.toggle("sn-swatch-neutral", c === "transparent");
      btn.classList.toggle("sn-selected", (note.color || "neutral") === btn.dataset.color);
    });
  }
  paintSwatches();

  const overflowBtn = card.querySelector(".sn-overflow-btn");
  const delBtn = menu.querySelector(".sn-card-delete");
  let confirmTimer = null;
  function resetDelete() {
    delBtn.dataset.confirm = "";
    delBtn.textContent = "Delete note";
    delBtn.classList.remove("sn-confirm");
  }
  function closeMenu() {
    menu.hidden = true;
    clearTimeout(confirmTimer);
    resetDelete();
  }

  overflowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    // only one overflow menu open at a time across the stack
    const container = card.parentElement;
    if (container) {
      container.querySelectorAll(".sn-overflow-menu").forEach((m) => {
        if (m !== menu) m.hidden = true;
      });
    }
    if (menu.hidden) {
      menu.hidden = false;
    } else {
      closeMenu();
    }
  });

  menu.querySelectorAll(".sn-color-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      note.color = btn.dataset.color;
      applyNoteColor(card, note.color);
      paintSwatches();
      closeMenu();
      saveNote(note);
    });
  });

  menu.querySelector(".sn-set-default").addEventListener("click", async () => {
    closeMenu();
    const meta = await loadMeta(note.host);
    meta.defaultColor = note.color || "neutral";
    await saveMeta(note.host, meta);
  });

  // Re-resolve this card's color when the OS light/dark scheme flips.
  const unsubTheme = onSchemeChange(() => {
    applyNoteColor(card, note.color);
    paintSwatches();
  });
  card.__snCleanup = unsubTheme;

  // Two-step delete: first click arms, second click within CONFIRM_MS deletes.
  delBtn.addEventListener("click", () => {
    if (delBtn.dataset.confirm === "1") {
      clearTimeout(confirmTimer);
      if (card.__snCleanup) card.__snCleanup();
      deleteNote(note.id).then(() => card.remove());
      return;
    }
    delBtn.dataset.confirm = "1";
    delBtn.textContent = "Click again to delete";
    delBtn.classList.add("sn-confirm");
    confirmTimer = setTimeout(resetDelete, CONFIRM_MS);
  });

  return card;
}

export async function renderCards(host, href, containerEl) {
  const notes = await loadNotesForHost(host, href);
  // Release theme subscribers from the cards we're about to discard.
  containerEl.querySelectorAll(".sn-card").forEach((c) => {
    if (c.__snCleanup) c.__snCleanup();
  });
  containerEl.textContent = "";
  for (const note of notes) containerEl.appendChild(buildCard(note, href));
}

export async function addCard(host, href, containerEl) {
  const meta = await loadMeta(host);
  const ts = Date.now();
  const note = {
    id: generateId(),
    host,
    scope: "site",
    url: null,
    title: "",
    text: "",
    color: meta.defaultColor || null,
    createdAt: ts,
    updatedAt: ts,
    synced: true,
  };
  await saveNote(note);
  const card = buildCard(note, href);
  containerEl.prepend(card);
  card.querySelector(".sn-card-body").focus();
}
