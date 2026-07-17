// Markdown rendering for the note preview. Reduced-scope by design: a card
// edits raw markdown in a textarea and renders a read-only preview on toggle —
// no from-scratch WYSIWYG. The one live affordance is task checkboxes, which
// flip the underlying `- [ ]` / `- [x]` in the raw text.
//
// All rendered HTML passes through DOMPurify (sanitize.js) before it reaches the
// DOM, so imported/untrusted note text can't inject anything.

import { marked } from "marked";
import { sanitizeHTML } from "./sanitize.js";

marked.setOptions({ gfm: true, breaks: true });

// A GFM task-list marker at the start of a list item: `- [ ]`, `* [x]`, etc.
const TASK_RE = /^(\s*[-*+]\s+\[)([ xX])(\])/;

export function renderMarkdown(text) {
  return sanitizeHTML(marked.parse(text || ""));
}

// Toggle the n-th (0-based) task checkbox in the raw markdown and return the new
// text. Index matches document order, which is the order marked renders them.
export function toggleTask(text, index) {
  const lines = (text || "").split("\n");
  let seen = -1;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(TASK_RE);
    if (!m) continue;
    seen++;
    if (seen === index) {
      const checked = m[2].toLowerCase() === "x";
      lines[i] = lines[i].replace(TASK_RE, `$1${checked ? " " : "x"}$3`);
      break;
    }
  }
  return lines.join("\n");
}
