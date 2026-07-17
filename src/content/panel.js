// The panel shell: header, drag/resize/collapse/opacity, and the card container.
// Panel geometry lives in siteNotes:ui:<host> so it survives reloads and the v1
// migration. Card contents are delegated to cards.js.

import { loadUI, saveUI, loadNotesForHost, saveNote, loadMeta, generateId } from "./storage.js";
import { renderCards, addCard } from "./cards.js";
import { exportSite, pickAndImport, importResultMessage, showToast } from "./io.js";
import { mountDashboard } from "./dashboard.js";
import { mountMarkers } from "./highlight.js";

export function createPanel(host, href) {
  let panel = null;
  let attachObserver = null;
  let saveTimer = null;
  let ui = { x: null, y: null, w: 300, h: 220, opacity: 0.85, collapsed: false, open: false };

  function persist() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => saveUI(host, ui), 300);
  }

  // ---------- build ----------

  function build() {
    if (panel) return;

    panel = document.createElement("div");
    panel.id = "site-notes-overlay";
    panel.innerHTML = `
      <div class="sn-header" title="Drag to move">
        <span class="sn-host"></span>
        <div class="sn-controls">
          <input class="sn-opacity" type="range" min="0.15" max="1" step="0.05" title="Transparency">
          <button class="sn-btn sn-dashboard-btn" title="All notes">⊞</button>
          <button class="sn-btn sn-menu-btn" title="More…">⋯</button>
          <button class="sn-btn sn-collapse" title="Collapse">–</button>
          <button class="sn-btn sn-close" title="Hide (Alt+N to reopen)">×</button>
        </div>
      </div>
      <div class="sn-menu" hidden>
        <button class="sn-menu-item sn-export-site">Export this site</button>
        <button class="sn-menu-item sn-import">Import notes</button>
      </div>
      <div class="sn-cards-container"></div>
      <button class="sn-add-note" title="Add a note">+ Add note</button>
      <div class="sn-resize" title="Drag to resize"></div>
    `;
    document.documentElement.appendChild(panel);

    panel.querySelector(".sn-host").textContent = host;
    const opacitySlider = panel.querySelector(".sn-opacity");
    opacitySlider.value = ui.opacity;
    applyOpacity();
    applyGeometry();
    if (ui.collapsed) panel.classList.add("sn-collapsed");

    opacitySlider.addEventListener("input", () => {
      ui.opacity = parseFloat(opacitySlider.value);
      applyOpacity();
      persist();
    });

    // full opacity while hovering so it is easy to read and edit
    panel.addEventListener("mouseenter", () => {
      panel.style.opacity = "1";
    });
    panel.addEventListener("mouseleave", applyOpacity);

    panel.querySelector(".sn-collapse").addEventListener("click", () => {
      ui.collapsed = !ui.collapsed;
      panel.classList.toggle("sn-collapsed", ui.collapsed);
      persist();
    });

    panel.querySelector(".sn-close").addEventListener("click", hide);

    const container = panel.querySelector(".sn-cards-container");
    panel.querySelector(".sn-add-note").addEventListener("click", () => {
      addCard(host, href, container);
    });

    // ⋯ menu — export/import
    const menu = panel.querySelector(".sn-menu");
    const closeMenu = () => { menu.hidden = true; };
    panel.querySelector(".sn-menu-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
    });
    panel.addEventListener("click", (e) => {
      if (!menu.hidden && !e.target.closest(".sn-menu") && !e.target.closest(".sn-menu-btn")) {
        closeMenu();
      }
      // close color pickers when clicking anywhere that isn't a picker or its dot
      if (!e.target.closest(".sn-color-picker") && !e.target.closest(".sn-color-dot")) {
        panel.querySelectorAll(".sn-color-picker").forEach((p) => { p.hidden = true; });
      }
    });
    panel.querySelector(".sn-export-site").addEventListener("click", () => {
      closeMenu();
      exportSite(host);
      showToast(panel, "Exported this site");
    });
    panel.querySelector(".sn-import").addEventListener("click", async () => {
      closeMenu();
      const result = await pickAndImport();
      const message = importResultMessage(result);
      if (!message) return; // cancelled
      if (!result.error) renderCards(host, href, container);
      showToast(panel, message);
    });

    // ⊞ all-notes dashboard
    let dashboardOpen = false;
    panel.querySelector(".sn-dashboard-btn").addEventListener("click", () => {
      if (dashboardOpen) return;
      dashboardOpen = true;
      closeMenu();
      mountDashboard(panel, () => {
        dashboardOpen = false;
        // notes may have been imported from the dashboard — refresh the stack
        renderCards(host, href, container);
      });
    });

    makeDraggable(panel.querySelector(".sn-header"));
    makeResizable(panel.querySelector(".sn-resize"));
  }

  function applyOpacity() {
    if (panel) panel.style.opacity = ui.opacity;
  }

  function applyGeometry() {
    if (!panel) return;
    panel.style.width = ui.w + "px";
    panel.style.height = ui.h + "px";
    if (ui.x === null || ui.y === null) {
      // default: top right corner
      ui.x = window.innerWidth - ui.w - 24;
      ui.y = 24;
    }
    clampToViewport();
    panel.style.left = ui.x + "px";
    panel.style.top = ui.y + "px";
  }

  function clampToViewport() {
    ui.x = Math.min(Math.max(0, ui.x), Math.max(0, window.innerWidth - 60));
    ui.y = Math.min(Math.max(0, ui.y), Math.max(0, window.innerHeight - 40));
  }

  function makeDraggable(handle) {
    let startX, startY, origX, origY, dragging = false;

    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest(".sn-btn") || e.target.closest(".sn-opacity")) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      origX = ui.x;
      origY = ui.y;
      handle.setPointerCapture(e.pointerId);
    });

    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      ui.x = origX + (e.clientX - startX);
      ui.y = origY + (e.clientY - startY);
      clampToViewport();
      panel.style.left = ui.x + "px";
      panel.style.top = ui.y + "px";
    });

    handle.addEventListener("pointerup", () => {
      if (dragging) {
        dragging = false;
        persist();
      }
    });
  }

  function makeResizable(grip) {
    let startX, startY, origW, origH, resizing = false;

    grip.addEventListener("pointerdown", (e) => {
      resizing = true;
      startX = e.clientX;
      startY = e.clientY;
      origW = ui.w;
      origH = ui.h;
      grip.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    grip.addEventListener("pointermove", (e) => {
      if (!resizing) return;
      ui.w = Math.max(240, origW + (e.clientX - startX));
      ui.h = Math.max(180, origH + (e.clientY - startY));
      panel.style.width = ui.w + "px";
      panel.style.height = ui.h + "px";
    });

    grip.addEventListener("pointerup", () => {
      if (resizing) {
        resizing = false;
        persist();
      }
    });
  }

  // Some apps aggressively re-render and can detach nodes they didn't create.
  // If the panel ever leaves the DOM while it should be visible, put it back.
  function ensureAttached() {
    if (panel && !panel.isConnected) {
      document.documentElement.appendChild(panel);
    }
    if (attachObserver) return;
    attachObserver = new MutationObserver(() => {
      if (ui.open && panel && !panel.isConnected) {
        document.documentElement.appendChild(panel);
      }
    });
    attachObserver.observe(document.documentElement, { childList: true });
  }

  // ---------- show / hide ----------

  function show() {
    build();
    ensureAttached();
    renderCards(host, href, panel.querySelector(".sn-cards-container"));
    panel.style.display = "flex";
    ui.open = true;
    persist();
  }

  function hide() {
    if (panel) panel.style.display = "none";
    ui.open = false;
    persist();
  }

  function toggle() {
    if (ui.open && panel && panel.style.display !== "none") hide();
    else show();
  }

  // ---------- anchored (highlight) notes ----------

  async function refreshMarkers() {
    const notes = await loadNotesForHost(host, href);
    const anchored = notes.filter((n) => n.anchor);
    mountMarkers(anchored, (noteId) => revealNote(noteId));
  }

  async function revealNote(noteId) {
    show();
    const container = panel.querySelector(".sn-cards-container");
    await renderCards(host, href, container);
    const card = container.querySelector(`[data-note-id="${noteId}"]`);
    if (card) {
      card.scrollIntoView({ block: "nearest" });
      card.classList.add("sn-flash");
      setTimeout(() => card.classList.remove("sn-flash"), 1200);
    }
  }

  // Called when the user picks "Add note for selection" from the context menu.
  async function addHighlightNote(selectionText, anchor) {
    const meta = await loadMeta(host);
    const ts = Date.now();
    const quoted = (selectionText || "").trim().replace(/\n/g, "\n> ");
    const note = {
      id: generateId(),
      host,
      scope: "url",
      url: href,
      title: "",
      text: quoted ? `> ${quoted}\n\n` : "",
      color: meta.defaultColor || null,
      anchor: anchor || null,
      createdAt: ts,
      updatedAt: ts,
      synced: true,
    };
    await saveNote(note);
    await revealNote(note.id);
    // put the caret after the quote so the user can start typing
    const card = panel.querySelector(`[data-note-id="${note.id}"]`);
    const body = card && card.querySelector(".sn-card-body");
    if (body) {
      body.focus();
      body.selectionStart = body.selectionEnd = body.value.length;
    }
    refreshMarkers();
  }

  // ---------- init ----------

  async function init() {
    ui = await loadUI(host);
    // loadNotesForHost also runs the one-time v1 migration for this host.
    const notes = await loadNotesForHost(host, href);
    // auto open if a note exists for this site, or it was left open
    if (notes.length || ui.open) show();
    // place markers for anchored notes even when the panel is closed
    refreshMarkers();
  }

  return { show, hide, toggle, init, addHighlightNote };
}
