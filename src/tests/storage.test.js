// Plain Node test (no framework) for the storage layer.
// Run: node src/tests/storage.test.js   (or: npm test)

import assert from "node:assert/strict";

// ---------- in-memory chrome.storage.local mock ----------

function makeStore() {
  const data = {};
  return {
    _data: data,
    get(keys) {
      if (keys === null || keys === undefined) return Promise.resolve({ ...data });
      const list = Array.isArray(keys) ? keys : [keys];
      const out = {};
      for (const k of list) if (k in data) out[k] = data[k];
      return Promise.resolve(out);
    },
    set(obj) {
      Object.assign(data, obj);
      return Promise.resolve();
    },
    remove(keys) {
      const list = Array.isArray(keys) ? keys : [keys];
      for (const k of list) delete data[k];
      return Promise.resolve();
    },
  };
}

function installChrome() {
  const local = makeStore();
  const sync = makeStore();
  globalThis.chrome = { storage: { local, sync } };
  S.__resetSyncState();
  return local;
}

const NOTE_KEY = "siteNotes:note:";
function syncData() {
  return globalThis.chrome.storage.sync._data;
}

// Node 22 has a global crypto with getRandomValues — no shim needed.

// ---------- test runner ----------

let passed = 0;
const failures = [];
async function test(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failures.push({ name, err });
    console.log(`FAIL  ${name}\n      ${err.message}`);
  }
}

const S = await import("../content/storage.js");

// ---------- tests ----------

await test("migration: legacy key becomes one note + preserved geometry", async () => {
  const local = installChrome();
  local._data["siteNotes:example.com"] = {
    text: "buy milk",
    opacity: 0.5,
    x: 100,
    y: 40,
    w: 320,
    h: 260,
    collapsed: true,
    open: true,
  };

  const notes = await S.loadNotesForHost("example.com", "https://example.com/");
  assert.equal(notes.length, 1, "exactly one note");
  assert.equal(notes[0].text, "buy milk");
  assert.equal(notes[0].host, "example.com");
  assert.equal(notes[0].scope, "site");

  const ui = await S.loadUI("example.com");
  assert.equal(ui.x, 100);
  assert.equal(ui.y, 40);
  assert.equal(ui.w, 320);
  assert.equal(ui.h, 260);
  assert.equal(ui.opacity, 0.5);
  assert.equal(ui.collapsed, true);
});

await test("migration: legacy key removed and second run is a no-op", async () => {
  const local = installChrome();
  local._data["siteNotes:example.com"] = { text: "note", x: 1, y: 2 };

  await S.loadNotesForHost("example.com", "https://example.com/");
  assert.ok(!("siteNotes:example.com" in local._data), "legacy key deleted");

  const metaBefore = JSON.stringify(await S.loadMeta("example.com"));
  await S.loadNotesForHost("example.com", "https://example.com/"); // run again
  const metaAfter = JSON.stringify(await S.loadMeta("example.com"));
  assert.equal(metaBefore, metaAfter, "no duplicate notes on second load");
  const all = await S.loadAllNotes();
  assert.equal(all.length, 1, "still exactly one note");
});

await test("migration: empty legacy note migrates geometry only, no note", async () => {
  const local = installChrome();
  local._data["siteNotes:blank.com"] = { text: "   ", x: 5, y: 6 };
  const notes = await S.loadNotesForHost("blank.com", "https://blank.com/");
  assert.equal(notes.length, 0, "no note created for empty text");
  const ui = await S.loadUI("blank.com");
  assert.equal(ui.x, 5);
});

await test("saveNote + loadNotesForHost round-trip", async () => {
  installChrome();
  const note = {
    id: S.generateId(),
    host: "test.com",
    scope: "site",
    url: null,
    title: "T",
    text: "hello",
    color: null,
  };
  await S.saveNote(note);
  const notes = await S.loadNotesForHost("test.com", "https://test.com/x");
  assert.equal(notes.length, 1);
  assert.equal(notes[0].text, "hello");
  assert.ok(notes[0].createdAt > 0 && notes[0].updatedAt > 0, "timestamps set");
});

await test("url-scoped note only shows on its own href", async () => {
  installChrome();
  await S.saveNote({ id: S.generateId(), host: "s.com", scope: "site", url: null, text: "site" });
  await S.saveNote({ id: S.generateId(), host: "s.com", scope: "url", url: "https://s.com/a", text: "urlnote" });

  const onA = await S.loadNotesForHost("s.com", "https://s.com/a");
  assert.equal(onA.length, 2, "both notes on /a");
  const onB = await S.loadNotesForHost("s.com", "https://s.com/b");
  assert.equal(onB.length, 1, "only site note on /b");
  assert.equal(onB[0].text, "site");
});

await test("deleteNote removes note and meta entry", async () => {
  installChrome();
  const id = S.generateId();
  await S.saveNote({ id, host: "d.com", scope: "site", url: null, text: "gone soon" });
  await S.deleteNote(id);
  const notes = await S.loadNotesForHost("d.com", "https://d.com/");
  assert.equal(notes.length, 0);
  const meta = await S.loadMeta("d.com");
  assert.ok(!meta.noteIds.includes(id), "id removed from meta");
});

await test("deleteNotesForHost removes only that host's notes", async () => {
  installChrome();
  await S.saveNote({ id: S.generateId(), host: "a.com", scope: "site", url: null, text: "a1" });
  await S.saveNote({ id: S.generateId(), host: "a.com", scope: "url", url: "https://a.com/x", text: "a2" });
  await S.saveNote({ id: S.generateId(), host: "b.com", scope: "site", url: null, text: "b1" });

  const removed = await S.deleteNotesForHost("a.com");
  assert.equal(removed, 2, "reports 2 deleted");
  const aNotes = await S.loadNotesForHost("a.com", "https://a.com/x");
  assert.equal(aNotes.length, 0, "a.com cleared");
  const bNotes = await S.loadNotesForHost("b.com", "https://b.com/");
  assert.equal(bNotes.length, 1, "b.com untouched");
  assert.deepEqual((await S.loadMeta("a.com")).noteIds, [], "a.com meta emptied");
});

await test("export → wipe → import restores notes", async () => {
  const local = installChrome();
  await S.saveNote({ id: S.generateId(), host: "a.com", scope: "site", url: null, text: "one" });
  await S.saveNote({ id: S.generateId(), host: "b.com", scope: "site", url: null, text: "two" });

  const dump = await S.exportAllJSON();
  assert.equal(dump.version, 2);
  assert.equal(dump.notes.length, 2);

  // wipe everything
  for (const k of Object.keys(local._data)) delete local._data[k];

  const result = await S.importFromJSON(dump);
  assert.equal(result.added, 2);
  assert.equal(result.skipped, 0);
  const all = await S.loadAllNotes();
  assert.equal(all.length, 2);
  const texts = all.map((n) => n.text).sort();
  assert.deepEqual(texts, ["one", "two"]);
});

await test("importing the same data twice adds no duplicates", async () => {
  installChrome();
  await S.saveNote({ id: S.generateId(), host: "a.com", scope: "site", url: null, text: "one" });
  const dump = await S.exportAllJSON();

  const second = await S.importFromJSON(dump);
  assert.equal(second.added, 0, "nothing added on re-import");
  assert.equal(second.skipped, 1, "existing note skipped");
  const all = await S.loadAllNotes();
  assert.equal(all.length, 1, "still one note");
});

await test("import rejects version !== 2", async () => {
  installChrome();
  await assert.rejects(() => S.importFromJSON({ version: 1, notes: [] }), /version 2/);
});

await test("import adopts defaultColor only for brand-new hosts", async () => {
  installChrome();
  // pre-existing host with its own default
  await S.saveMeta("existing.com", { defaultColor: "blue", noteIds: [] });

  const dump = {
    version: 2,
    exportedAt: "x",
    notes: [{ id: S.generateId(), host: "fresh.com", scope: "site", url: null, text: "n" }],
    meta: {
      "fresh.com": { defaultColor: "green", noteIds: [] },
      "existing.com": { defaultColor: "pink", noteIds: [] },
    },
  };
  await S.importFromJSON(dump);

  assert.equal((await S.loadMeta("fresh.com")).defaultColor, "green", "new host adopts color");
  assert.equal((await S.loadMeta("existing.com")).defaultColor, "blue", "existing host unchanged");
});

await test("sync: small note is mirrored to sync and marked synced", async () => {
  installChrome();
  const id = S.generateId();
  await S.saveNote({ id, host: "x.com", scope: "site", url: null, text: "hi" });
  await S.flushPendingSync();
  const notes = await S.loadNotesForHost("x.com", "https://x.com/");
  assert.equal(notes[0].synced, true, "marked synced");
  assert.ok(NOTE_KEY + id in syncData(), "present in sync store");
});

await test("sync: oversized note stays local-only with synced=false", async () => {
  const local = installChrome();
  const id = S.generateId();
  await S.saveNote({ id, host: "x.com", scope: "site", url: null, text: "x".repeat(8000) });
  await S.flushPendingSync();
  const note = local._data[NOTE_KEY + id];
  assert.equal(note.synced, false, "marked not synced");
  assert.ok(!(NOTE_KEY + id in syncData()), "absent from sync store");
  assert.ok(NOTE_KEY + id in local._data, "still in local");
});

await test("sync: shrinking an oversized note restores it to sync", async () => {
  installChrome();
  const id = S.generateId();
  const note = { id, host: "x.com", scope: "site", url: null, text: "x".repeat(8000) };
  await S.saveNote(note);
  await S.flushPendingSync();
  assert.ok(!(NOTE_KEY + id in syncData()), "not synced while huge");
  note.text = "small again";
  await S.saveNote(note);
  await S.flushPendingSync();
  assert.ok(NOTE_KEY + id in syncData(), "back in sync after shrink");
});

await test("sync: a note living only in sync is discovered (cross-device)", async () => {
  installChrome();
  const id = S.generateId();
  syncData()[NOTE_KEY + id] = {
    id, host: "x.com", scope: "site", url: null, text: "from device A",
    createdAt: 100, updatedAt: 100, synced: true,
  };
  const notes = await S.loadNotesForHost("x.com", "https://x.com/");
  assert.equal(notes.length, 1);
  assert.equal(notes[0].text, "from device A");
});

await test("sync: newer updatedAt wins between local and sync", async () => {
  const local = installChrome();
  const id = S.generateId();
  const base = { id, host: "x.com", scope: "site", url: null, createdAt: 100 };
  local._data[NOTE_KEY + id] = { ...base, text: "stale", updatedAt: 100 };
  syncData()[NOTE_KEY + id] = { ...base, text: "fresh", updatedAt: 200 };
  const notes = await S.loadNotesForHost("x.com", "https://x.com/");
  assert.equal(notes[0].text, "fresh");
});

await test("sync unavailable: still loads from local", async () => {
  const local = makeStore();
  globalThis.chrome = { storage: { local } }; // no sync at all
  S.__resetSyncState();
  const id = S.generateId();
  await S.saveNote({ id, host: "x.com", scope: "site", url: null, text: "local only" });
  const notes = await S.loadNotesForHost("x.com", "https://x.com/");
  assert.equal(notes.length, 1);
  assert.equal(notes[0].text, "local only");
});

// ---------- summary ----------

S.__resetSyncState(); // drop any dangling debounce timer so node can exit
console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
