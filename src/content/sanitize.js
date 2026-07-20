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
    "a", "input", "span", "img",
  ],
  ALLOWED_ATTR: ["href", "title", "type", "checked", "disabled", "class", "data-line", "src", "alt"],
  // No javascript: URLs. data: is allowed ONLY on <img> (see the hook below),
  // so pasted/embedded images render while text URLs stay restricted to http(s).
  ALLOW_DATA_ATTR: false,
};

// Belt-and-suspenders: strip any img whose src isn't an inline image or http(s).
// DOMPurify already blocks data: on non-media tags; this narrows img to images.
let hookInstalled = false;
function installImgHook() {
  if (hookInstalled) return;
  hookInstalled = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.nodeName !== "IMG" || !node.hasAttribute("src")) return;
    const src = node.getAttribute("src") || "";
    const ok = /^data:image\/(png|jpeg|gif|webp);/i.test(src) || /^https?:\/\//i.test(src);
    if (!ok) node.removeAttribute("src");
  });
}

export function sanitizeHTML(html) {
  installImgHook();
  return DOMPurify.sanitize(html, CONFIG);
}
