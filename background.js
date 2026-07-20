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
  var ALARM_PREFIX = "snremind:";
  var NOTE_PREFIX = "siteNotes:note:";
  var notificationTarget = {};
  chrome.runtime.onMessage.addListener((msg) => {
    if (!msg) return;
    if (msg.type === "SITE_NOTES_SET_REMINDER" && msg.noteId && msg.when) {
      chrome.alarms.create(ALARM_PREFIX + msg.noteId, { when: msg.when });
    } else if (msg.type === "SITE_NOTES_CLEAR_REMINDER" && msg.noteId) {
      chrome.alarms.clear(ALARM_PREFIX + msg.noteId);
    }
  });
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (!alarm.name.startsWith(ALARM_PREFIX)) return;
    const id = alarm.name.slice(ALARM_PREFIX.length);
    const key = NOTE_PREFIX + id;
    const note = (await chrome.storage.local.get(key))[key];
    if (!note) return;
    const title = (note.title || "").trim() || "Site note reminder";
    const body = plainSnippet(note.text) || note.host || "";
    const notificationId = ALARM_PREFIX + id;
    if (note.scope === "url" && note.url) notificationTarget[notificationId] = note.url;
    else if (note.host) notificationTarget[notificationId] = "https://" + note.host + "/";
    chrome.notifications.create(notificationId, {
      type: "basic",
      iconUrl: "icons/icon128.png",
      title,
      message: body,
      priority: 2
    });
  });
  chrome.notifications.onClicked.addListener((notificationId) => {
    const url = notificationTarget[notificationId];
    if (url) chrome.tabs.create({ url });
    delete notificationTarget[notificationId];
    chrome.notifications.clear(notificationId);
  });
  function plainSnippet(text) {
    return (text || "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/[>#*_`~-]/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);
  }
})();
