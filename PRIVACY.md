# Privacy Policy — Site Notes Overlay

_Last updated: 2026-07-20_

Site Notes Overlay is designed to keep your data private. In plain terms: **your
notes never leave your own browser and Google account. We have no servers and we
collect nothing.**

## What the extension stores

- The **notes you type**, including their title, text, color, and whether a note
  applies to a whole site or a single page.
- **Per-site preferences** such as the panel's position, size, transparency, and
  default note color.

## Where it is stored

- Notes are saved with Chrome's `storage` API.
- Small notes are mirrored to **`chrome.storage.sync`**, which Chrome
  synchronizes across the devices where you are signed into the same Google
  account. This sync is performed entirely by Google/Chrome — the extension
  never sees or routes your data through any third party.
- Notes too large to sync, plus panel position/size preferences, are kept in
  **`chrome.storage.local`** on that device only.

## What the extension reads from a page

- The page's **address** (URL and hostname), used only to attach your notes to
  the correct site or page.
- **Text you have selected**, and only when you explicitly choose "Add note for
  selection" from the right-click menu, so it can be quoted into a new note.

The extension does not scrape, read, or store any other page content, and none
of this information is ever transmitted off your device.

## What we collect and share

- **Nothing.** The extension has no backend, sends no analytics, contains no
  trackers, and makes no network requests of its own. Your notes are not
  transmitted to the developer or anyone else.

## Permissions and why they are needed

- **`storage`** — to save your notes and preferences (and sync them via your
  Google account).
- **`scripting`** and **host access (`<all_urls>`)** — to display the notes
  overlay on the pages you visit and to show it on tabs that were already open
  when the extension was installed or updated. On each page the extension reads
  only the page address (to match notes to the site) and, when you invoke it,
  your selected text; it injects only its own notes panel and reads no other
  page content.
- **`contextMenus`** — to add the "Add note for selection" right-click option.
- **`alarms`** — to schedule reminders you set on a note.
- **`notifications`** — to show a desktop notification when a note reminder is
  due.

## Your control

- You can view, edit, or delete any note at any time from the overlay or the
  all-notes dashboard.
- **Export** your notes to a JSON file for backup, and **import** them later.
- Removing a note deletes it from local storage and from sync.
- Uninstalling the extension removes its locally stored data. Synced items are
  cleared through Chrome's account data controls.

## Contact

Questions about this policy can be directed to the developer through the Chrome
Web Store listing's support channel.
