# Site Notes Overlay

A Chrome extension that gives every website its own sticky note. Notes appear as a translucent, draggable overlay whenever you visit a site you've written a note for.

## Features

- One note per website, keyed by hostname and stored locally via `chrome.storage.local`
- Auto opens on any site that already has a note
- Adjustable transparency (15% to 100%) with a slider, goes fully opaque on hover for easy editing
- Draggable, resizable, and collapsible panel that remembers its position, size, and opacity per site
- Autosaves as you type (300ms debounce)
- Toggle with `Alt+N` or by clicking the extension icon

## Install (unpacked)

1. Clone this repo
2. Open `chrome://extensions` and enable **Developer mode**
3. Click **Load unpacked** and select the project folder

Works on Chrome, Edge, and Brave. Content scripts can't run on `chrome://` pages or the Chrome Web Store, so the overlay won't appear there.

## Project structure

```
manifest.json   Extension config (Manifest V3)
background.js   Service worker, relays toolbar click and Alt+N to the content script
content.js      Overlay UI, drag/resize logic, per-site storage
content.css     Translucent panel styles
```

## How it works

The content script runs on every page, checks `chrome.storage.local` for a note under `siteNotes:<hostname>`, and injects the overlay if one exists. All state (text, position, size, opacity, open/collapsed) is saved per hostname, so each site keeps its own layout.

## License

MIT
