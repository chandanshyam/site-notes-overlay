# Chrome Web Store listing — Site Notes Overlay

Copy/paste source for the store listing, plus the reviewer-facing permission
justifications. Screenshots must be captured from the running extension (see
checklist at the bottom).

## Name

Site Notes Overlay

## Summary (max 132 chars)

Sticky notes for any website — multiple color-coded notes per site, synced across your devices, in a translucent overlay.

## Detailed description

Site Notes Overlay pins sticky notes to the websites you use. Open a site and
your notes for it are right there, floating in a translucent panel you can move,
resize, and fade to taste.

Features
• Multiple notes per site — a scrollable stack of cards, each with its own title.
• Site or page scope — keep a note across the whole site, or pin it to one URL.
• Color coding — six colors, with a default you can set per site.
• Syncs across devices — notes ride along with your Chrome/Google account.
  Oversized notes stay safely on the device and are clearly marked.
• All-notes dashboard — search every note across every site and jump back to any
  of them.
• Backup — export your notes to a JSON file and import them anywhere.
• Light & dark — matches your system theme automatically.
• Quick toggle — click the toolbar icon or press Alt+N.

Private by design: your notes never leave your browser and Google account. There
is no server, no analytics, and no tracking. See the privacy policy for details.

## Category

Productivity

## Language

English

## Permission justifications (reviewer notes)

- **storage** — Saves your notes and per-site preferences, and mirrors small
  notes via chrome.storage.sync so they follow your Google account across
  devices.
- **scripting** — Injects the notes overlay on demand into tabs that were
  already open when the extension was installed or updated, so the toolbar
  button/shortcut works without requiring a page reload.
- **host permission `<all_urls>`** — The overlay is a per-site notepad, so it
  must be able to appear on any site the user chooses to take notes on. On each
  page the extension reads only the page address (to match notes to the site)
  and, when the user invokes "Add note for selection," the selected text. It
  injects only its own UI and reads no other page content, and transmits nothing
  off the device.
- **contextMenus** — Adds the "Add note for selection" right-click option.
- **alarms** — Schedules reminders the user sets on a note.
- **notifications** — Shows a desktop notification when a note reminder is due.

## Data safety / privacy disclosures

- Does the extension collect or use user data? **No data is collected or
  transmitted.** Notes are stored via Chrome storage (local + the user's own
  Google account sync). Nothing is sent to the developer or any third party.
- Privacy policy URL: host `PRIVACY.md` (e.g. on the project's GitHub) and link
  it here.

## Pre-submit checklist

- [ ] `npm run package` produces `site-notes-overlay.zip` (manifest, built
      content.js/background.js, content.css, icons/).
- [ ] Icons present at 16/32/48/128 (icons/).
- [ ] At least one 1280×800 (or 640×400) screenshot of the overlay in use.
      Suggested shots: (1) a couple of color-coded cards on a real site,
      (2) the site/page scope toggle, (3) the all-notes dashboard with search.
- [ ] Privacy policy published at a public URL and linked in the listing.
- [ ] $5 one-time developer registration paid.
- [ ] Version in manifest.json matches the release (currently 1.0.0).
