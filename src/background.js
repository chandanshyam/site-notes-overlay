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

// ---------- reminders: chrome.alarms + system notifications ----------
//
// The content script owns the note; the worker owns the schedule. A note id maps
// to alarm "snremind:<id>". When the alarm fires we read the note back out of
// storage (the worker may have been torn down and restarted in between, so we
// can't rely on in-memory state) and raise a notification. Clicking it opens the
// note's page. Alarms persist across restarts, so a reminder set now survives a
// browser quit before it's due.

const ALARM_PREFIX = "snremind:";
const NOTE_PREFIX = "siteNotes:note:";
const notificationTarget = {}; // notificationId -> url to open on click

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
  if (!note) return; // note was deleted before the reminder fired

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
    priority: 2,
  });
});

chrome.notifications.onClicked.addListener((notificationId) => {
  const url = notificationTarget[notificationId];
  if (url) chrome.tabs.create({ url });
  delete notificationTarget[notificationId];
  chrome.notifications.clear(notificationId);
});

// Strip markdown/image noise to a short plain-text line for the notification body.
function plainSnippet(text) {
  return (text || "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // image embeds
    .replace(/[>#*_`~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}
