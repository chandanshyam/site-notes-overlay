// Relays the toolbar button click and keyboard shortcut to the active tab.
// If the content script isn't present (tab was open before the extension was
// installed/updated, or the page never triggered a load event), inject it on
// demand and then show the panel — so the toggle works on any tab, any time.

// Deliver a message to the tab's content script, injecting it on demand if it
// isn't there yet. Returns true if the message was ultimately delivered.
async function deliver(tabId, message) {
  try {
    await chrome.tabs.sendMessage(tabId, message);
    return true;
  } catch {
    try {
      await chrome.scripting.insertCSS({ target: { tabId }, files: ["content.css"] });
      await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
      // executeScript is idempotent (content.js guards against double-init).
      await chrome.tabs.sendMessage(tabId, message);
      return true;
    } catch {
      // Restricted page (chrome://, Chrome Web Store, PDF viewer, etc.).
      return false;
    }
  }
}

// Toggle on click; SHOW after an injection so a click always reveals the panel.
async function sendToggle(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: "SITE_NOTES_TOGGLE" });
  } catch {
    await deliver(tabId, { type: "SITE_NOTES_SHOW" });
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) sendToggle(tab.id);
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-notes" && tab && tab.id) sendToggle(tab.id);
});

// ---------- context menu: add a note anchored to the selected text ----------

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "add-highlight-note",
    title: "Add note for selection",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "add-highlight-note" || !tab || !tab.id) return;
  deliver(tab.id, {
    type: "SITE_NOTES_ADD_HIGHLIGHT",
    selectionText: info.selectionText || "",
  });
});
