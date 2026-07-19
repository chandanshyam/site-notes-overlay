// Storage layer for Site Notes Overlay v2.
//
// Schema (all keys live in chrome.storage.local; Task 6 mirrors notes to sync):
//   siteNotes:meta:<host>  → { defaultColor, noteIds: [] }
//   siteNotes:note:<id>    → Note (see NOTE fields below)
//   siteNotes:ui:<host>    → { x, y, w, h, opacity, collapsed, open }
//
// A Note is:
//   { id, host, scope: 'site'|'url', url, title, text, color,
//     anchor?, createdAt, updatedAt, synced }
//
// Everything is promise-based. chrome.storage.* returns promises in MV3 (Chrome
// 88+); the test harness supplies a matching in-memory mock.

const META_PREFIX = "siteNotes:meta:";
const NOTE_PREFIX = "siteNotes:note:";
const UI_PREFIX = "siteNotes:ui:";
const LEGACY_PREFIX = "siteNotes:";

const DEFAULT_UI = { x: null, y: null, w: 300, h: 220, opacity: 0.85, collapsed: false, open: false };

// ---------- low-level chrome.storage.local wrappers ----------

function getLocal(keys) {
  return chrome.storage.local.get(keys);
}
function setLocal(obj) {
  return chrome.storage.local.set(obj);
}
function removeLocal(keys) {
  return chrome.storage.local.remove(keys);
}

// ---------- sync mirror ----------
//
// Notes under SYNC_MAX_BYTES are mirrored to chrome.storage.sync so they follow
// the user across devices; local is always written first as the fast, always-
// available source of truth. Sync writes are coalesced on a debounce to stay
// clear of sync's 120-writes/minute rate limit, and any sync failure (not signed
// in, quota, or rate) is swallowed — the note is already safe in local.
//
// Only note *content* syncs. Panel geometry (ui:<host>) and per-site defaults
// (meta) stay device-local by design.

const SYNC_MAX_BYTES = 7168; // headroom under sync's 8192-byte per-item cap
const SYNC_DEBOUNCE = 1500;
const encoder = new TextEncoder();
let pendingSync = new Map(); // id -> latest note awaiting a sync write
let syncTimer = null;

function byteLength(str) {
  return encoder.encode(str).length;
}

function syncStore() {
  return (typeof chrome !== "undefined" && chrome.storage && chrome.storage.sync) || null;
}

function queueSync(note) {
  if (!syncStore()) return; // sync unavailable — local-only, silently
  pendingSync.set(note.id, note);
  if (!syncTimer) syncTimer = setTimeout(flushSync, SYNC_DEBOUNCE);
}

async function flushSync() {
  syncTimer = null;
  const sync = syncStore();
  const batch = pendingSync;
  pendingSync = new Map();
  if (!sync) return;

  const setBatch = {};
  const removeKeys = [];
  for (const [id, note] of batch) {
    if (note.synced) setBatch[NOTE_PREFIX + id] = note;
    else removeKeys.push(NOTE_PREFIX + id); // grew too big — evict from sync
  }
  try {
    if (Object.keys(setBatch).length) await sync.set(setBatch);
  } catch {
    /* quota / rate / signed-out — local already holds the data */
  }
  try {
    if (removeKeys.length) await sync.remove(removeKeys);
  } catch {
    /* ignore */
  }
}

// Force any pending sync writes out now (used by tests and page-hide flush).
export async function flushPendingSync() {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
  await flushSync();
}

// Test-only: drop any queued sync writes without flushing.
export function __resetSyncState() {
  if (syncTimer) {
    clearTimeout(syncTimer);
    syncTimer = null;
  }
  pendingSync = new Map();
}

// ---------- helpers ----------

export function generateId() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function now() {
  return Date.now();
}

function isLegacyKey(key) {
  return (
    key.startsWith(LEGACY_PREFIX) &&
    !key.startsWith(META_PREFIX) &&
    !key.startsWith(NOTE_PREFIX) &&
    !key.startsWith(UI_PREFIX)
  );
}

// ---------- meta + ui ----------

export async function loadMeta(host) {
  const key = META_PREFIX + host;
  const res = await getLocal(key);
  return res[key] || { defaultColor: null, noteIds: [] };
}

export async function saveMeta(host, meta) {
  await setLocal({ [META_PREFIX + host]: meta });
  return meta;
}

export async function loadUI(host) {
  const key = UI_PREFIX + host;
  const res = await getLocal(key);
  return { ...DEFAULT_UI, ...(res[key] || {}) };
}

export async function saveUI(host, ui) {
  await setLocal({ [UI_PREFIX + host]: { ...DEFAULT_UI, ...ui } });
  return ui;
}

// ---------- migration ----------

// One-time, idempotent migration of the v1 single-note key `siteNotes:<host>`
// into the v2 note + ui + meta schema. Runs on first load for a host; a second
// run finds no legacy key and does nothing. Panel geometry is preserved into the
// ui:<host> key so it isn't lost across the upgrade.
export async function migrateHost(host) {
  const legacyKey = LEGACY_PREFIX + host;
  if (!isLegacyKey(legacyKey)) return; // host string collided with a v2 prefix
  const res = await getLocal(legacyKey);
  const legacy = res[legacyKey];
  if (!legacy) return;

  const ui = {
    x: legacy.x ?? null,
    y: legacy.y ?? null,
    w: legacy.w ?? DEFAULT_UI.w,
    h: legacy.h ?? DEFAULT_UI.h,
    opacity: legacy.opacity ?? DEFAULT_UI.opacity,
    collapsed: legacy.collapsed ?? false,
    open: legacy.open ?? false,
  };

  const noteIds = [];
  const writes = { [UI_PREFIX + host]: ui };

  const text = (legacy.text || "").trim();
  if (text) {
    const id = generateId();
    const ts = now();
    const note = {
      id,
      host,
      scope: "site",
      url: null,
      title: "",
      text: legacy.text,
      color: null,
      createdAt: ts,
      updatedAt: ts,
      synced: true,
    };
    noteIds.push(id);
    writes[NOTE_PREFIX + id] = note;
  }

  writes[META_PREFIX + host] = { defaultColor: null, noteIds };
  await setLocal(writes);
  await removeLocal(legacyKey);
}

// ---------- notes ----------

// Merge notes across local + sync, newest updatedAt winning. Scanning (rather
// than trusting meta.noteIds) is what makes a note created on another device
// discoverable here — its id was never added to this device's meta.
async function mergedNotesMap() {
  const sources = [await getLocal(null)];
  const sync = syncStore();
  if (sync) {
    try {
      sources.push(await sync.get(null));
    } catch {
      /* sync unavailable — fall back to local only */
    }
  }
  const map = new Map();
  for (const src of sources) {
    for (const key of Object.keys(src)) {
      if (!key.startsWith(NOTE_PREFIX)) continue;
      const note = src[key];
      if (!note || !note.id) continue;
      const existing = map.get(note.id);
      if (!existing || (note.updatedAt || 0) >= (existing.updatedAt || 0)) {
        map.set(note.id, note);
      }
    }
  }
  return map;
}

export async function loadNotesForHost(host, href) {
  await migrateHost(host);
  const map = await mergedNotesMap();
  return [...map.values()]
    .filter((n) => n.host === host)
    .filter((n) => n.scope === "site" || (n.scope === "url" && n.url === href))
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); // newest first
}

export async function loadAllNotes() {
  const map = await mergedNotesMap();
  return [...map.values()];
}

export async function saveNote(note) {
  note.updatedAt = now();
  if (!note.createdAt) note.createdAt = note.updatedAt;
  note.synced = byteLength(JSON.stringify(note)) < SYNC_MAX_BYTES;
  await setLocal({ [NOTE_PREFIX + note.id]: note });
  const meta = await loadMeta(note.host);
  if (!meta.noteIds.includes(note.id)) {
    meta.noteIds.push(note.id);
    await saveMeta(note.host, meta);
  }
  queueSync(note);
  return note;
}

export async function deleteNote(id) {
  const key = NOTE_PREFIX + id;
  pendingSync.delete(id);
  const res = await getLocal(key);
  const note = res[key];
  await removeLocal(key);
  const sync = syncStore();
  if (sync) {
    try {
      await sync.remove(key);
    } catch {
      /* ignore */
    }
  }
  if (note) {
    const meta = await loadMeta(note.host);
    meta.noteIds = meta.noteIds.filter((x) => x !== id);
    await saveMeta(note.host, meta);
  }
}

// Delete every note for a host (from meta and from a full scan, so sync-only
// notes are caught too). Returns the number of notes deleted.
export async function deleteNotesForHost(host) {
  const meta = await loadMeta(host);
  const all = await loadAllNotes();
  const ids = new Set(meta.noteIds);
  for (const n of all) if (n.host === host) ids.add(n.id);
  for (const id of ids) await deleteNote(id);
  return ids.size;
}

// ---------- export / import ----------

function metaMapFromKeys(all, hostFilter) {
  const meta = {};
  for (const key of Object.keys(all)) {
    if (!key.startsWith(META_PREFIX)) continue;
    const host = key.slice(META_PREFIX.length);
    if (hostFilter && host !== hostFilter) continue;
    meta[host] = all[key];
  }
  return meta;
}

export async function exportAllJSON() {
  const all = await getLocal(null);
  const notes = Object.keys(all)
    .filter((k) => k.startsWith(NOTE_PREFIX))
    .map((k) => all[k]);
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    notes,
    meta: metaMapFromKeys(all),
  };
}

export async function exportSiteJSON(host) {
  const all = await getLocal(null);
  const notes = Object.keys(all)
    .filter((k) => k.startsWith(NOTE_PREFIX))
    .map((k) => all[k])
    .filter((n) => n.host === host);
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    notes,
    meta: metaMapFromKeys(all, host),
  };
}

// Merge, never overwrite: existing note IDs are skipped; a host's defaultColor is
// adopted only when that host had no meta before the import.
export async function importFromJSON(data) {
  if (!data || data.version !== 2) {
    throw new Error("Unsupported file format (expected Site Notes export version 2).");
  }

  const all = await getLocal(null);
  const preExistingMetaHosts = new Set(
    Object.keys(all)
      .filter((k) => k.startsWith(META_PREFIX))
      .map((k) => k.slice(META_PREFIX.length))
  );

  let added = 0;
  let skipped = 0;

  for (const note of data.notes || []) {
    if (!note || !note.id || !note.host) {
      skipped++;
      continue;
    }
    const key = NOTE_PREFIX + note.id;
    const existing = (await getLocal(key))[key];
    if (existing) {
      skipped++;
      continue;
    }
    await setLocal({ [key]: note });
    const meta = await loadMeta(note.host);
    if (!meta.noteIds.includes(note.id)) meta.noteIds.push(note.id);
    await saveMeta(note.host, meta);
    added++;
  }

  for (const [host, m] of Object.entries(data.meta || {})) {
    if (preExistingMetaHosts.has(host)) continue;
    const cur = await loadMeta(host);
    if (cur.defaultColor == null && m && m.defaultColor != null) {
      cur.defaultColor = m.defaultColor;
      await saveMeta(host, cur);
    }
  }

  return { added, skipped };
}
