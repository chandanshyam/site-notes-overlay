// Theme support. The light/dark panel palette itself is pure CSS (content.css
// uses prefers-color-scheme), so this module only handles the parts that need
// JS: the per-note color tokens and re-applying them when the OS scheme flips.
//
// Color identifies a note; it doesn't decorate it. It renders as a 3px left
// SPINE on the card, not a header fill — so the tones are muted "ink" values
// that stay legible at 3px and read the same on light or dark glass (a single
// value per color rather than a light/dark pair).

export const COLORS = [
  { id: "neutral", label: "Neutral", spine: "transparent" },
  { id: "yellow", label: "Yellow", spine: "#d3a03e" },
  { id: "blue", label: "Blue", spine: "#5b87c9" },
  { id: "green", label: "Green", spine: "#54a06b" },
  { id: "pink", label: "Pink", spine: "#cb6f96" },
  { id: "purple", label: "Purple", spine: "#8f6fca" },
];

const BY_ID = Object.fromEntries(COLORS.map((c) => [c.id, c]));

export function colorValue(colorId) {
  const c = BY_ID[colorId] || BY_ID.neutral;
  return c.spine;
}

export function applyNoteColor(cardEl, colorId) {
  cardEl.style.setProperty("--sn-note-color", colorValue(colorId || "neutral"));
}

// Subscribers (e.g. each visible card) get called when the OS scheme changes so
// they can re-resolve their color to the right light/dark value.
const subscribers = new Set();
let wired = false;

export function initTheme() {
  if (wired || typeof matchMedia !== "function") return;
  wired = true;
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    for (const fn of [...subscribers]) fn();
  });
}

export function onSchemeChange(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}
