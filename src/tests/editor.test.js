// Tests for the pure task-toggle logic. renderMarkdown needs a DOM (DOMPurify),
// so it's exercised in-browser, not here — this covers the text transform.

import assert from "node:assert/strict";
import { toggleTask } from "../content/editor.js";

let passed = 0;
const failures = [];
function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failures.push(name);
    console.log(`FAIL  ${name}\n      ${err.message}`);
  }
}

test("checks an unchecked box", () => {
  assert.equal(toggleTask("- [ ] milk", 0), "- [x] milk");
});

test("unchecks a checked box (X or x)", () => {
  assert.equal(toggleTask("- [x] milk", 0), "- [ ] milk");
  assert.equal(toggleTask("- [X] milk", 0), "- [ ] milk");
});

test("indexes only task lines, in document order", () => {
  const src = ["# Title", "- [ ] a", "some text", "- [ ] b", "- [x] c"].join("\n");
  const out = toggleTask(src, 1); // second task = "b"
  assert.equal(out.split("\n")[3], "- [x] b");
  assert.equal(out.split("\n")[1], "- [ ] a", "first task untouched");
  assert.equal(out.split("\n")[4], "- [x] c", "third task untouched");
});

test("supports *, +, and indented markers", () => {
  assert.equal(toggleTask("* [ ] a", 0), "* [x] a");
  assert.equal(toggleTask("+ [ ] a", 0), "+ [x] a");
  assert.equal(toggleTask("  - [ ] nested", 0), "  - [x] nested");
});

test("out-of-range index is a no-op", () => {
  assert.equal(toggleTask("- [ ] a", 5), "- [ ] a");
});

test("does not touch non-task brackets", () => {
  assert.equal(toggleTask("a [ ] b", 0), "a [ ] b");
});

console.log(`\n${passed} passed, ${failures.length} failed`);
if (failures.length) process.exit(1);
