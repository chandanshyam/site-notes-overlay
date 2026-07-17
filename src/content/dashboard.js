// The all-notes dashboard: a slide-in panel over the card stack listing every
// note across every site, grouped by host, searchable, with global export/import.
// Note text is rendered via textContent only — never innerHTML — so there is no
// injection surface here.

import { loadAllNotes } from "./storage.js";
import { exportAll, pickAndImport, importResultMessage, showToast } from "./io.js";

function previewText(text) {
  return (text || "").replace(/\s+/g, " ").trim().slice(0, 60);
}

export function mountDashboard(panelEl, onClose) {
  const dash = document.createElement("div");
  dash.className = "sn-dashboard";
  dash.innerHTML = `
    <div class="sn-dash-header">
      <input class="sn-dash-search" placeholder="Search notes…" spellcheck="false">
      <button class="sn-dash-export">Export all</button>
      <button class="sn-dash-import">Import</button>
      <button class="sn-btn sn-dash-close" title="Close">×</button>
    </div>
    <div class="sn-dash-list"></div>
  `;
  panelEl.appendChild(dash);
  requestAnimationFrame(() => dash.classList.add("sn-dash-open"));

  const listEl = dash.querySelector(".sn-dash-list");
  const searchEl = dash.querySelector(".sn-dash-search");
  let allNotes = [];

  function render(filter) {
    const q = (filter || "").trim().toLowerCase();
    const groups = new Map();
    for (const n of allNotes) {
      const hay = `${n.title || ""} ${n.text || ""} ${n.host}`.toLowerCase();
      if (q && !hay.includes(q)) continue;
      if (!groups.has(n.host)) groups.set(n.host, []);
      groups.get(n.host).push(n);
    }

    listEl.textContent = "";
    if (!groups.size) {
      const empty = document.createElement("div");
      empty.className = "sn-dash-empty";
      empty.textContent = allNotes.length ? "No matching notes" : "No notes yet";
      listEl.appendChild(empty);
      return;
    }

    for (const [host, notes] of groups) {
      const section = document.createElement("div");
      section.className = "sn-dash-site";

      const header = document.createElement("div");
      header.className = "sn-dash-site-header";
      const name = document.createElement("span");
      name.className = "sn-dash-hostname";
      name.textContent = host;
      const visit = document.createElement("a");
      visit.className = "sn-dash-visit";
      visit.href = /^https?:\/\//.test(host) ? host : "https://" + host;
      visit.target = "_blank";
      visit.rel = "noopener noreferrer";
      visit.textContent = "↗";
      visit.title = "Open " + host;
      header.append(name, visit);
      section.appendChild(header);

      for (const n of notes) {
        const row = document.createElement("div");
        row.className = "sn-dash-note";
        row.dataset.noteId = n.id;

        const title = document.createElement("span");
        title.className = "sn-dash-title";
        title.textContent = n.title || "Untitled";

        const preview = document.createElement("span");
        preview.className = "sn-dash-preview";
        preview.textContent = previewText(n.text);

        const badge = document.createElement("span");
        badge.className = "sn-dash-scope-badge";
        badge.textContent = n.scope === "url" ? "page" : "site";

        row.append(title, preview, badge);
        section.appendChild(row);
      }
      listEl.appendChild(section);
    }
  }

  async function reload() {
    allNotes = await loadAllNotes();
    render(searchEl.value);
  }

  function close() {
    dash.classList.remove("sn-dash-open");
    setTimeout(() => {
      dash.remove();
      if (onClose) onClose();
    }, 200);
  }

  searchEl.addEventListener("input", () => render(searchEl.value));
  dash.querySelector(".sn-dash-export").addEventListener("click", () => {
    exportAll();
    showToast(panelEl, "Exported all notes");
  });
  dash.querySelector(".sn-dash-import").addEventListener("click", async () => {
    const result = await pickAndImport();
    const message = importResultMessage(result);
    if (!message) return;
    if (!result.error) reload();
    showToast(panelEl, message);
  });
  dash.querySelector(".sn-dash-close").addEventListener("click", close);

  reload();
  searchEl.focus();
  return { reload, close };
}
