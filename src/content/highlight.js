// Anchored ("highlight") notes. Best-effort by design: we record a CSS-path +
// the selected text, and on later loads try to re-place a 📝 marker next to that
// text. If the page has changed enough that the anchor no longer resolves, no
// marker is shown — the note still lives in the panel (it is url-scoped) with the
// selection preserved as a blockquote, so nothing is lost.

// ---------- capturing an anchor from the current selection ----------

export function captureAnchor(selectionText) {
  const anchor = { selector: null, textOffset: -1, text: selectionText || "" };
  const sel = window.getSelection && window.getSelection();
  if (!sel || sel.rangeCount === 0) return anchor;

  const node = sel.getRangeAt(0).startContainer;
  const el = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  if (!(el instanceof Element)) return anchor;

  anchor.selector = cssPath(el);
  anchor.textOffset = (el.textContent || "").indexOf(anchor.text);
  return anchor;
}

function cssPath(el) {
  if (el.id) return "#" + CSS.escape(el.id);
  const parts = [];
  let node = el;
  while (node && node.nodeType === Node.ELEMENT_NODE && node !== document.body && parts.length < 6) {
    if (node.id) {
      parts.unshift("#" + CSS.escape(node.id));
      break;
    }
    let part = node.nodeName.toLowerCase();
    const parent = node.parentElement;
    if (parent) {
      const twins = [...parent.children].filter((c) => c.nodeName === node.nodeName);
      if (twins.length > 1) part += `:nth-of-type(${twins.indexOf(node) + 1})`;
    }
    parts.unshift(part);
    node = node.parentElement;
  }
  return parts.join(" > ");
}

// ---------- resolving an anchor back to an element ----------

export function resolveAnchor(anchor) {
  if (!anchor) return null;
  if (anchor.selector) {
    try {
      const el = document.querySelector(anchor.selector);
      if (el && (!anchor.text || (el.textContent || "").includes(anchor.text))) return el;
    } catch {
      /* selector no longer valid */
    }
  }
  return anchor.text ? findByText(anchor.text) : null;
}

function findByText(text) {
  if (!document.body) return null;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeValue && n.nodeValue.includes(text)) return n.parentElement;
  }
  return null;
}

// ---------- floating markers ----------

let layer = null;
let markers = []; // { el, target }
let rafPending = false;
let listenersWired = false;

function ensureLayer() {
  if (layer && layer.isConnected) return;
  layer = document.createElement("div");
  layer.className = "sn-markers";
  document.documentElement.appendChild(layer);
  if (!listenersWired) {
    listenersWired = true;
    window.addEventListener("scroll", scheduleReposition, true);
    window.addEventListener("resize", scheduleReposition);
  }
}

function scheduleReposition() {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(() => {
    rafPending = false;
    reposition();
  });
}

function reposition() {
  for (const m of markers) {
    if (!m.target.isConnected) {
      m.el.style.display = "none";
      continue;
    }
    const r = m.target.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) {
      m.el.style.display = "none";
      continue;
    }
    m.el.style.display = "flex";
    m.el.style.left = r.left + window.scrollX + "px";
    m.el.style.top = r.top + window.scrollY - 6 + "px";
  }
}

// Place a marker for each anchored note that still resolves. onClick(noteId) is
// called when a marker is clicked. Notes whose anchor fails simply get none.
export function mountMarkers(anchoredNotes, onClick) {
  ensureLayer();
  for (const m of markers) m.el.remove();
  markers = [];

  for (const note of anchoredNotes) {
    const target = resolveAnchor(note.anchor);
    if (!target) continue;
    const el = document.createElement("button");
    el.className = "sn-marker";
    el.textContent = "📝";
    el.title = note.title || "View note";
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick(note.id);
    });
    layer.appendChild(el);
    markers.push({ el, target });
  }
  reposition();
}
