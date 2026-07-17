# Implementation Plan — Site Notes Overlay v2

## Goal
Evolve the single-note-per-site overlay into a cross-device notes tool — multiple scoped
notes per site, live checkboxes/markdown, sync, dashboard, themes, color coding, and optional
highlight notes — **and** produce the assets required to publish on the Chrome Web Store.

## Strategy
Ship a durable, low-risk **v2.0** first (multiple notes, scope, backup, sync, dashboard,
themes). Isolate the two features most likely to slip — the live editor and anchored
highlights — into a later **v2.1**, behind the stable core so they can't block a release.

---

## Storage schema (v2)

```
siteNotes:meta:<host>  → { defaultColor, noteIds: [] }
siteNotes:note:<id>    → { id, host, scope, url, title, text, color, anchor?, createdAt, updatedAt, synced }
siteNotes:ui:<host>    → { x, y, w, h, opacity, collapsed, open }   // panel geometry — fixes the v1 regression
```

- Each **note** is its own storage item (respects the 8 KB/item sync limit).
- **UI/geometry is a separate key** so panel position/size/opacity survive the migration.
- **Sync limits treated as real constraints:** 100 KB total, 8 KB/item, **512 items**,
  1,800 writes/hr, **120 writes/min**. Code must degrade gracefully at each ceiling.

## File structure

```
src/
  background.js
  content/
    index.js      entry (keeps the window.__siteNotesOverlayLoaded guard)
    panel.js      shell, drag/resize, collapse, header menu
    cards.js      stacked cards, add/remove, local-only badge
    editor.js     editor (v2.1)
    dashboard.js  slide-out all-notes view
    highlight.js  selection → anchored note (v2.1)
    storage.js    read/write/migrate, sync-vs-local, throttled writes
    theme.js      color scheme + per-note color
  tests/
    storage.test.js
manifest.json
content.css       CSS custom properties
package.json
```

---

## v2.0 — shippable core

### Task 1 — esbuild + restructure (no behavior change)
- `package.json` with pinned `esbuild` (e.g. `0.21.5`) as the only dev dep.
- Move `content.js` → `src/content/index.js`, `background.js` → `src/background.js`,
  **verbatim** — explicitly preserve the `window.__siteNotesOverlayLoaded` guard and the
  on-demand-injection relay.
- Build script — **both outputs `--format=iife`** (a classic MV3 service worker must not be ESM):
  ```json
  "build": "esbuild src/content/index.js --bundle --outfile=content.js --format=iife && esbuild src/background.js --bundle --outfile=background.js --format=iife",
  "watch": "npm run build -- --watch"
  ```
- `manifest.json` keeps pointing at root `content.js`/`background.js` (the build outputs).
  Background still `executeScript`s the bundled `content.js` — confirm idempotency guard
  survives bundling.
- `.gitignore`: `node_modules/`, `package-lock.json`.
- **Verify:** `npm run build` clean; existing note still appears; Alt+N still toggles;
  on-demand injection still works on a pre-existing tab.

### Task 2 — storage layer + safe migration
- `src/content/storage.js` exports: `generateId()`, `loadNotesForHost(host, href)`,
  `loadAllNotes()`, `saveNote(note)`, `deleteNote(id)`, `loadMeta(host)`, `saveMeta(host, meta)`,
  `loadUI(host)`, `saveUI(host, ui)`, `exportAllJSON()`, `exportSiteJSON(host)`,
  `importFromJSON(data)`.
- **Migration (once, on first load):** find keys that start with `siteNotes:` **but are not**
  `siteNotes:meta:*`, `siteNotes:note:*`, or `siteNotes:ui:*` (i.e. the legacy
  `siteNotes:<host>`). For each: create one note from `{ text, title: '' }`, write
  `siteNotes:ui:<host>` from `{ x, y, w, h, opacity, collapsed, open }`, then delete the old
  key. Idempotent — re-running finds nothing to migrate.
- Note schema as above; `scope` defaults to `'site'`, `synced` defaults per size check (Task 6).
- `src/tests/storage.test.js` (plain Node, in-memory `chrome.storage` mock) asserts: migration
  yields exactly one note with preserved text **and** a populated `ui:<host>` key; old key
  removed; migration is a no-op on second run; `saveNote`/`loadNotesForHost` round-trip;
  export→wipe→import restores; double-import adds nothing.
- **Verify:** `node src/tests/storage.test.js` passes; DevTools shows new keys, old key gone,
  geometry preserved.

### Task 3 — stacked cards (multiple notes)
- `panel.js` swaps the single textarea for `.sn-cards-container` (scrollable) + `+ Add note`.
- `cards.js` renders per-note cards (title input, scope badge, color dot, delete). Debounced
  autosave on title/body. Inline two-step delete confirm. `+ Add note` prepends a new card
  seeded from `meta.defaultColor`.
- **Verify:** add 2 notes → 3 cards persist across reload; delete persists; scrolls at 3+.

### Task 4 — per-note scope (site vs URL)
- Scope toggle cycles `site ⇄ url`; `url` sets `note.url = location.href`, `site` clears it.
- `loadNotesForHost(host, href)` returns all `site` notes plus `url` notes where
  `note.url === href`.
- `index.js` passes `location.href`.
- **Verify:** URL note shows only on its path; site note shows everywhere; toggle persists.

### Task 5 — export / import (with DOMPurify)
- Export shape `{ version: 2, exportedAt, notes: [...], meta: {<host>: {...}} }`;
  `exportSiteJSON` filtered to one host.
- `importFromJSON`: reject `version !== 2` with a clear message; skip existing note IDs, insert
  new ones, update meta `noteIds`; merge `defaultColor` only when no meta exists; return
  `{ added, skipped }`.
- Header `⋯` menu: **Export this site**, **Import notes** (via `<input type=file accept=.json>`),
  toast with counts. Blob + programmatic `<a download>`.
- **Bundle DOMPurify** — all imported/rendered content is sanitized through it, since an
  imported file is an injection vector. No regex sanitizer.
- **Verify:** export→wipe→import restores exactly; re-import = 0 added/N skipped; v1 file
  rejected cleanly; malicious `<img onerror>` in an imported note does not execute.

### Task 6 — sync with local fallback + write throttling
- `saveNote`: serialize; if `< 7168` bytes → write `sync` **and** `local` cache,
  `synced = true`; else `local` only, `synced = false`.
- **Throttling:** debounce sync writes at **1–2 s** and coalesce per-note; keep `local` as the
  fast path. Guard against `MAX_ITEMS`/quota/rate errors — on failure, fall back to local +
  `synced = false` (never throw into the UI).
- `loadNotesForHost`: prefer newer `updatedAt` between sync/local; silently fall back to local
  if sync is unavailable. Last-write-wins across devices (documented limitation).
- `deleteNote`: remove from both.
- `cards.js`: render `⚠ Local only` badge when `synced === false`; re-evaluate on each save.
- **Verify:** small note lands in sync; oversized note shows badge + absent from sync; trimming
  restores sync; sustained typing across cards does not trip the rate limit; sync-unavailable
  still loads local notes.

### Task 7 — theme (auto light/dark)
- `content.css` → CSS custom properties; `@media (prefers-color-scheme: light)` overrides. No
  JS-driven **theme** values (per-note color in Task 8 is the one CSS-var exception).
- `theme.js`: `initTheme()` wires a `matchMedia` change listener (repaint hook) and exports
  `COLORS` + `applyNoteColor`.
- **Verify:** light/dark both readable; no hex/`rgba(` literals remain in `.js`.

### Task 8 — per-note color
- 6 colors in `theme.js` `COLORS` (each with `light`/`dark`), swatch popover per card + **Set as
  site default** (writes `meta.defaultColor`). New cards inherit the default.
- `applyNoteColor` sets `--sn-note-color` (correct light/dark value), re-applied on `matchMedia`
  change; `.sn-card-header` tints from it.
- **Verify:** color persists; site default seeds new cards; overrides independent; colors adapt
  on OS theme switch.

### Task 9 — dashboard (all-notes slide-out)
- `dashboard.js`: `⊞` header button mounts a slide-in panel (`translateX(100%)→0`).
  `loadAllNotes()` grouped by host; each host section has a visit `↗`; each note shows title +
  60-char preview + scope badge.
- Live case-insensitive search over `title|text|host`; empty sections hidden. Wires global
  **Export all / Import** to the Task 5 functions.
- **Verify:** 3 sites appear with counts; text search hides non-matches; host search keeps that
  section; `↗` opens a new tab; export/import round-trips.

### Task 10 — Web Store packaging (release blocker, not a feature)
- Icons at 16/32/48/128 px, wired into `manifest.json` (`action.default_icon` + `icons`).
- ≥1 screenshot at 1280×800; short + detailed store descriptions.
- Privacy policy stating **all data is local/synced-to-your-own-Google-account, nothing
  transmitted to us**; justification text for `<all_urls>` + `scripting` (and `contextMenus` in
  v2.1).
- Bump `manifest.json` version to `2.0.0`; produce a zip build step.
- **Verify:** load unpacked with icons showing; Web Store draft passes the pre-submit checklist.

**→ v2.0 ships here.**

---

## v2.1 — higher-risk features (post-release)

### Task 11 — markdown editor, reduced scope
Deliberately **not** a from-scratch WYSIWYG.
- Per card: plain `textarea` (raw markdown) + a **preview toggle** rendering via `marked` →
  **DOMPurify** → read-only view.
- The one live affordance: `- [ ]` / `- [x]` render as clickable checkboxes in preview;
  clicking flips the underlying `[ ]`↔`[x]` in the raw text and saves. Checkbox lives in a
  `contenteditable="false"` rendered block.
- If true inline WYSIWYG is wanted later, adopt **CodeMirror 6** (markdown mode) rather than
  hand-rolling cursor/IME/undo — a separate spike, not this task.
- **Verify:** headings/bold/lists render in preview; checkbox toggle persists across reload; no
  `<script>`/`onerror` survives sanitize.

### Task 12 — anchored / highlight notes (best-effort)
- Add `contextMenus` permission; register **Add note for selection** in `onInstalled`; on click
  send `SITE_NOTES_ADD_HIGHLIGHT` to the tab.
- `highlight.js`: `captureAnchor` stores `{ selector, textOffset, text }`; new note is
  `scope:'url'`, body pre-filled `> <selection>`, `note.anchor` set. `mountMarkers` tries to
  place a 📝 marker; **on resolve failure the note still lives in the panel** (no orphan marker,
  quoted text is the fallback) — failure path is explicit, best-effort on SPAs.
- **Verify:** selection creates a pre-filled note; marker appears when anchor resolves; after a
  re-render that breaks the anchor, the note is still reachable from the panel with its quote.

---

## Cross-cutting rules
- Preserve the on-demand injection + `window.__siteNotesOverlayLoaded` guard throughout.
- All rendered/imported HTML passes through DOMPurify — no regex sanitizing.
- Every write path degrades to local + `synced:false` rather than surfacing an error.
- Keep permissions minimal per phase (`contextMenus` only lands in v2.1).
