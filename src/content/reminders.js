// Per-note reminders. The note carries a `remindAt` (epoch ms); the actual
// scheduling lives in the background service worker, which owns chrome.alarms and
// fires a system notification when the time comes. The content script only tells
// the worker to arm or clear an alarm — see background.js.
//
// Alarms are device-local (chrome.alarms doesn't sync), but `remindAt` rides the
// note across devices, so re-arming on load (armIfDue) means a reminder you set
// on one device also fires on another once you've visited the site there.

export function armReminder(note) {
  if (!note.remindAt || note.remindAt <= Date.now()) return;
  send({ type: "SITE_NOTES_SET_REMINDER", noteId: note.id, when: note.remindAt });
}

export function clearReminder(noteId) {
  send({ type: "SITE_NOTES_CLEAR_REMINDER", noteId });
}

// Re-arm any still-future reminders for the given notes. Alarm creation is
// keyed by note id in the worker, so calling this repeatedly is idempotent.
export function armAll(notes) {
  for (const n of notes) armReminder(n);
}

function send(msg) {
  try {
    chrome.runtime.sendMessage(msg);
  } catch {
    /* worker asleep / context gone — harmless; re-armed on next load */
  }
}

// Human label for a reminder time, e.g. "Jul 21, 9:00 AM". Empty if none/past.
export function reminderLabel(remindAt) {
  if (!remindAt) return "";
  try {
    return new Date(remindAt).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

// Value for a <input type="datetime-local">, in the user's local time.
export function toLocalInputValue(remindAt) {
  const d = remindAt ? new Date(remindAt) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}
