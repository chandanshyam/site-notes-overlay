// Relays the toolbar button click and keyboard shortcut to the active tab

function sendToggle(tabId) {
  chrome.tabs.sendMessage(tabId, { type: "SITE_NOTES_TOGGLE" }).catch(() => {
    // Content script not available on this page (chrome://, web store, etc.)
  });
}

chrome.action.onClicked.addListener((tab) => {
  if (tab.id) sendToggle(tab.id);
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "toggle-notes" && tab && tab.id) sendToggle(tab.id);
});
