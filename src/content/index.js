// Site Notes Overlay — content script entry point.
// Multiple notes per site, stored per-note in chrome.storage (see storage.js).

import { createPanel } from "./panel.js";
import { flushPendingSync } from "./storage.js";
import { initTheme } from "./theme.js";
import { captureAnchor } from "./highlight.js";

(() => {
  // Guard against double-initialization. The script can arrive two ways — via
  // the manifest content_scripts entry AND via on-demand injection from the
  // background worker. Both run in the same isolated world, so this flag is
  // shared between them. Without it we'd stack duplicate panels and listeners.
  if (window.__siteNotesOverlayLoaded) return;
  window.__siteNotesOverlayLoaded = true;

  const HOST = location.hostname || "local";
  const HREF = location.href;

  initTheme();
  const panel = createPanel(HOST, HREF);

  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg) return;
    if (msg.type === "SITE_NOTES_TOGGLE") panel.toggle();
    // SHOW is sent by the background worker right after an on-demand injection,
    // so a click always results in a visible panel (never a toggle-off).
    else if (msg.type === "SITE_NOTES_SHOW") panel.show();
    else if (msg.type === "SITE_NOTES_ADD_HIGHLIGHT") {
      // Capture the anchor now, while the selection is still live.
      const anchor = captureAnchor(msg.selectionText);
      panel.addHighlightNote(msg.selectionText, anchor);
    }
  });

  // Flush any debounced sync writes before the page goes away, so a quick edit
  // immediately followed by a navigation still propagates to other devices.
  window.addEventListener("pagehide", () => { flushPendingSync(); });

  panel.init();
})();
