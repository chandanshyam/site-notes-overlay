// Single place all rendered/imported HTML passes through before hitting innerHTML.
// Used by the markdown preview (Task 11) and any place that renders note content;
// an imported JSON file is untrusted, so its text must never reach innerHTML raw.

import DOMPurify from "dompurify";

const CONFIG = {
  ALLOWED_TAGS: [
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "br", "hr",
    "strong", "em", "del", "s", "code", "pre",
    "blockquote", "ul", "ol", "li",
    "a", "input", "span",
  ],
  ALLOWED_ATTR: ["href", "title", "type", "checked", "disabled", "class", "data-line"],
  // No javascript: / data: URLs; force safe link targets.
  ALLOW_DATA_ATTR: false,
};

export function sanitizeHTML(html) {
  return DOMPurify.sanitize(html, CONFIG);
}
