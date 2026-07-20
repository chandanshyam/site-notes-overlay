// Paste / drop an image into a note. Images are embedded inline as a downscaled
// data: URL inside standard markdown image syntax — ![alt](data:...) — so they
// ride the same storage, sync, export/import, and sanitized-preview pipeline as
// the rest of the note. No separate blob store, no attachment bookkeeping.
//
// Downscaling matters: a raw phone screenshot is multiple megabytes, far past
// chrome.storage.sync's ~8 KB/item cap. We cap the longest edge and re-encode so
// a typical embed lands in the tens-of-KB range. A note that's still too big to
// sync degrades gracefully to local-only (the card's ⚠ dot already signals this).

const MAX_EDGE = 1024; // px — longest side after downscale
const JPEG_QUALITY = 0.82; // used when we re-encode to reduce size

// Read a File/Blob into an <img> we can draw to a canvas.
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

// Downscale `file` to at most MAX_EDGE on its longest side and return a data URL.
// PNGs (which may have transparency) stay PNG; everything else re-encodes to JPEG
// for size. Images already within bounds are still re-encoded to normalize size.
export async function fileToDataURL(file) {
  const img = await loadImage(file);
  const { naturalWidth: w, naturalHeight: h } = img;
  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, cw, ch);

  const isPng = file.type === "image/png";
  return canvas.toDataURL(isPng ? "image/png" : "image/jpeg", isPng ? undefined : JPEG_QUALITY);
}

// Pull the first image file out of a paste/drop DataTransfer, or null.
export function firstImageFile(dataTransfer) {
  if (!dataTransfer) return null;
  const items = dataTransfer.items ? [...dataTransfer.items] : [];
  for (const it of items) {
    if (it.kind === "file" && it.type.startsWith("image/")) return it.getAsFile();
  }
  const files = dataTransfer.files ? [...dataTransfer.files] : [];
  return files.find((f) => f.type.startsWith("image/")) || null;
}

// Insert `snippet` into a textarea at the caret, keeping the caret after it.
export function insertAtCaret(textarea, snippet) {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  const before = textarea.value.slice(0, start);
  const after = textarea.value.slice(end);
  textarea.value = before + snippet + after;
  const pos = start + snippet.length;
  textarea.selectionStart = textarea.selectionEnd = pos;
}
