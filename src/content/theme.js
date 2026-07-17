// Theme support. The light/dark palette itself is pure CSS (content.css uses
// prefers-color-scheme), so this module only handles the parts that need JS:
// the per-note color tokens and re-applying them when the OS scheme flips while
// the panel is open.

export const COLORS = [
  { id: "neutral", label: "Neutral", light: "transparent", dark: "transparent" },
  { id: "yellow", label: "Yellow", light: "#fff7cc", dark: "#3d3400" },
  { id: "blue", label: "Blue", light: "#e2ecff", dark: "#0d2a4a" },
  { id: "green", label: "Green", light: "#dcf3e3", dark: "#0d2e1a" },
  { id: "pink", label: "Pink", light: "#fbe0ec", dark: "#3d0a22" },
  { id: "purple", label: "Purple", light: "#ece2fb", dark: "#1e0d3d" },
];

const BY_ID = Object.fromEntries(COLORS.map((c) => [c.id, c]));

function prefersDark() {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: dark)").matches;
}

export function colorValue(colorId) {
  const c = BY_ID[colorId] || BY_ID.neutral;
  return prefersDark() ? c.dark : c.light;
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
