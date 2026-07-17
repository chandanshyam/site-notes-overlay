(() => {
  // src/background.js
  async function deliver(tabId, message) {
    try {
      await chrome.tabs.sendMessage(tabId, message);
      return true;
    } catch {
      try {
        await chrome.scripting.insertCSS({ target: { tabId }, files: ["content.css"] });
        await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
        await chrome.tabs.sendMessage(tabId, message);
        return true;
      } catch {
        return false;
      }
    }
  }
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
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "add-highlight-note",
      title: "Add note for selection",
      contexts: ["selection"]
    });
  });
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== "add-highlight-note" || !tab || !tab.id) return;
    deliver(tab.id, {
      type: "SITE_NOTES_ADD_HIGHLIGHT",
      selectionText: info.selectionText || ""
    });
  });
})();
