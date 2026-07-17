// Export/import plumbing: download a JSON blob, pick a file to import, and a small
// toast for feedback. Storage merge logic lives in storage.js (importFromJSON).

import { exportSiteJSON, exportAllJSON, importFromJSON } from "./storage.js";

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.documentElement.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function exportSite(host) {
  const safe = (host || "site").replace(/[^a-z0-9.-]/gi, "_");
  downloadJSON(`site-notes-${safe}.json`, await exportSiteJSON(host));
}

export async function exportAll() {
  downloadJSON("site-notes-all.json", await exportAllJSON());
}

// Opens a file picker and imports the chosen JSON. Resolves to
// { added, skipped } on success, { error } on failure, or null if cancelled.
export function pickAndImport() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.style.display = "none";
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      input.remove();
      if (!file) {
        resolve(null);
        return;
      }
      try {
        const data = JSON.parse(await file.text());
        resolve(await importFromJSON(data));
      } catch (err) {
        resolve({ error: err && err.message ? err.message : "Could not read file" });
      }
    });
    document.documentElement.appendChild(input);
    input.click();
  });
}

export function importResultMessage(result) {
  if (!result) return null; // cancelled
  if (result.error) return "Import failed: " + result.error;
  const n = result.added;
  const base = `Imported ${n} note${n === 1 ? "" : "s"}`;
  return result.skipped ? `${base} (${result.skipped} skipped)` : base;
}

export function showToast(anchorEl, message) {
  if (!message) return;
  const toast = document.createElement("div");
  toast.className = "sn-toast";
  toast.textContent = message;
  anchorEl.appendChild(toast);
  setTimeout(() => toast.classList.add("sn-toast-out"), 2200);
  setTimeout(() => toast.remove(), 2600);
}
