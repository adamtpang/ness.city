# public/

Static assets served at `/`. Two image slots are wired by the landing
page (`app/page.tsx`) and gracefully fall back to SVG placeholders if
the files aren't present.

## Drop these in

| File | Used by | Notes |
|---|---|---|
| `nessie-loch.jpg` | Landing hero (right side) | The Loch Ness photograph. The 1934 "Surgeon's Photograph" is widely treated as public domain; verify your source. Suggested aspect ratio: 3:4 (portrait) or square. |
| `ness-city-vision.jpg` | Vision strip (left side) | Solarpunk vision of Forest City. Use art you have rights to (commission, Midjourney/SD with your account, CC-licensed). 3:4 portrait works well. |

Until they're dropped in, the landing renders abstract SVG placeholders
with a hint pointing at this folder. Drop the JPG, refresh — done.
