#!/usr/bin/env python3
"""Generate the extension's PNG icons (16/32/48/128) from code.

Design: a rounded indigo tile with a translucent sticky-note card and a few
text lines — reads as "notes overlay" even at 16px. Rendered at 8x and
downsampled with LANCZOS for clean edges. Run: python3 tools/generate_icons.py
"""
from __future__ import annotations

import os
from PIL import Image, ImageDraw

SIZES = [16, 32, 48, 128]
SS = 8  # supersampling factor
OUT = os.path.join(os.path.dirname(__file__), "..", "icons")

TOP = (124, 140, 255)     # gradient top  (#7c8cff)
BOTTOM = (59, 91, 219)    # gradient bottom (#3b5bdb)
CARD = (255, 255, 255)
LINE = (150, 165, 210)


def vgradient(size, top, bottom):
    w, h = size
    img = Image.new("RGB", size)
    px = img.load()
    for y in range(h):
        t = y / max(1, h - 1)
        col = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for x in range(w):
            px[x, y] = col
    return img


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def render(px):
    s = px * SS
    # background tile
    bg = vgradient((s, s), TOP, BOTTOM).convert("RGBA")
    bg.putalpha(rounded_mask((s, s), int(s * 0.22)))

    d = ImageDraw.Draw(bg)

    # sticky-note card
    inset = int(s * 0.22)
    card = [inset, inset, s - inset, s - inset]
    d.rounded_rectangle(card, radius=int(s * 0.06), fill=CARD)

    # text lines on the card
    left = inset + int(s * 0.10)
    right = s - inset - int(s * 0.10)
    line_h = max(1, int(s * 0.035))
    ys = [0.34, 0.5, 0.66]
    for i, yf in enumerate(ys):
        y = int(s * yf)
        x2 = right if i < len(ys) - 1 else left + int((right - left) * 0.6)
        d.rounded_rectangle([left, y, x2, y + line_h], radius=line_h, fill=LINE)

    return bg.resize((px, px), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    for size in SIZES:
        img = render(size)
        path = os.path.join(OUT, f"icon{size}.png")
        img.save(path)
        print("wrote", os.path.relpath(path))


if __name__ == "__main__":
    main()
