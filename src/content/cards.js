// The stack of note cards inside the panel. Each card is one Note; edits autosave
// on a short debounce. Delete requires a two-step confirm to avoid accidents.

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

function debounced(fn, delay) {
  let t = null;
  return () => {
    clearTimeout(t);
    t = setTimeout(fn, delay);
  };
}

// site-scoped notes show on every page of the host; url-scoped notes show only
// on the exact href where they were pinned.
function labelScope(el, note) {
  const isUrl = note.scope === "url";
  el.textContent = isUrl ? "🔗 page" : "🌐 site";
  el.title = isUrl
    ? "Shows only on this page — click for whole site"
    : "Shows on the whole site — click to pin to this page";
}

function buildCard(note, href) {
  const card = document.createElement("div");
  card.className = "sn-card";
  card.dataset.noteId = note.id;
  card.innerHTML = `
    <div class="sn-card-header">
      <input class="sn-card-title" placeholder="Untitled" spellcheck="false">
      <span class="sn-local-badge" title="Too large to sync — saved on this device only" hidden>⚠ local</span>
      <div class="sn-card-actions">
        <button class="sn-preview-toggle" title="Preview">👁</button>
        <button class="sn-scope-toggle"></button>
        <a class="sn-card-open" target="_blank" rel="noopener noreferrer"></a>
        <span class="sn-color-dot"></span>
        <button class="sn-card-delete" title="Delete note">🗑</button>
      </div>
    </div>
    <textarea class="sn-card-body" placeholder="Notes… (markdown supported)" spellcheck="false"></textarea>
    <div class="sn-card-preview" hidden></div>
  `;

  const titleEl = card.querySelector(".sn-card-title");
  const bodyEl = card.querySelector(".sn-card-body");
  const previewEl = card.querySelector(".sn-card-preview");
  const previewBtn = card.querySelector(".sn-preview-toggle");
  const scopeEl = card.querySelector(".sn-scope-toggle");
  const openEl = card.querySelector(".sn-card-open");
  const badgeEl = card.querySelector(".sn-local-badge");
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
    openEl.textContent = "↗";
    openEl.title = note.scope === "url" ? "Open this page" : "Open site home";
  }
  updateOpenLink();

  function updateBadge() {
    // synced is recomputed on every save; false means it exceeded the sync cap.
    badgeEl.hidden = note.synced !== false;
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
    previewBtn.textContent = on ? "✏️" : "👁";
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

  // ---- per-note color ----
  const dotEl = card.querySelector(".sn-color-dot");
  applyNoteColor(card, note.color);

  const picker = document.createElement("div");
  picker.className = "sn-color-picker";
  picker.hidden = true;
  picker.innerHTML = `
    <div class="sn-color-row">
      ${COLORS.map(
        (c) => `<button class="sn-color-option" data-color="${c.id}" title="${c.label}"></button>`
      ).join("")}
    </div>
    <button class="sn-set-default">Set as site default</button>
  `;
  card.appendChild(picker);

  function paintSwatches() {
    picker.querySelectorAll(".sn-color-option").forEach((btn) => {
      btn.style.background = colorValue(btn.dataset.color);
      btn.classList.toggle("sn-selected", (note.color || "neutral") === btn.dataset.color);
    });
  }
  paintSwatches();

  dotEl.addEventListener("click", (e) => {
    e.stopPropagation();
    // only one picker open at a time across the stack
    const container = card.parentElement;
    if (container) {
      container.querySelectorAll(".sn-color-picker").forEach((p) => {
        if (p !== picker) p.hidden = true;
      });
    }
    picker.hidden = !picker.hidden;
  });

  picker.querySelectorAll(".sn-color-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      note.color = btn.dataset.color;
      applyNoteColor(card, note.color);
      paintSwatches();
      picker.hidden = true;
      saveNote(note);
    });
  });

  picker.querySelector(".sn-set-default").addEventListener("click", async () => {
    picker.hidden = true;
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
  const delBtn = card.querySelector(".sn-card-delete");
  let confirmTimer = null;
  function resetDelete() {
    delBtn.dataset.confirm = "";
    delBtn.textContent = "🗑";
    delBtn.classList.remove("sn-confirm");
  }
  delBtn.addEventListener("click", () => {
    if (delBtn.dataset.confirm === "1") {
      clearTimeout(confirmTimer);
      if (card.__snCleanup) card.__snCleanup();
      deleteNote(note.id).then(() => card.remove());
      return;
    }
    delBtn.dataset.confirm = "1";
    delBtn.textContent = "Delete?";
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
