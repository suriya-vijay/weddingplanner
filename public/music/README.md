# Background music — drop-in instructions

The site has an **opt-in music player** (bottom-left corner of the public site:
play / pause / skip). It stays **hidden until at least one track exists here**,
so the corner is never cluttered and nothing 404s. Add the files below and the
player appears automatically.

## What to add

1. Drop your `.mp3` files into this folder (`public/music/`).
2. List them in the `TRACKS` array in `components/sections/ambient-audio.tsx` —
   each entry is `{ src: "/music/<your-file>.mp3", title: "What shows while playing" }`.
   The `src` must match the filename exactly.

The currently-wired tracks are the four Indian-wedding instrumentals already in
this folder. To add/replace one, drop the file here and edit that array.

> **Important:** Next.js snapshots the `public/` folder at **build time**, so add
> the files **before** running `npm run build` / deploying, not just at runtime.

## Recommended tracks (royalty-free, free for commercial use)

All from **Pixabay Music** — its license permits commercial web use with **no
attribution required**. Open a track, click **Download**, drop the file here, and
add it to the `TRACKS` array. Prefer calm, soft, instrumental pieces
(sitar / veena / flute / ambient raga) so it sits gently in the background.

- **Indian Classical Music – Sitar** — https://pixabay.com/music/india-indian-classical-music-sitar-296787/
- **Indian Classical Instrumental** — https://pixabay.com/music/india-indian-classical-instrumental-319883/
- **Indian Classical Music** — https://pixabay.com/music/india-indian-classical-music-319871/

Browse more calm Indian instrumentals:

- https://pixabay.com/music/search/indian%20instrumental/
- https://pixabay.com/music/search/meditation%20india/
- https://pixabay.com/music/search/sitar/

## Licensing note

Only use tracks whose license clearly allows **commercial use on a website**.
Pixabay's Content License covers this and needs no attribution. If you pick a
track from anywhere else, keep a copy of its license terms and confirm it permits
commercial web use before shipping it. Keep this note with the files.

## Volume

The player plays softly by default (`volume ≈ 0.32`). Adjust in
`components/sections/ambient-audio.tsx` (`ensureAudio()`), if needed.
