"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, SkipForward, Music } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ambient music player — a small, elegant opt-in control for calm background
 * music while a visitor browses the public site (before they sign in).
 * Play / pause / skip over a small playlist; shows the current track on hover.
 *
 * Design decisions (deliberate, professional / trust-safe):
 *  - OFF by default. Browsers block autoplay-with-sound anyway, and unexpected
 *    audio is hostile — nothing ever plays until the visitor taps play.
 *  - The <audio> element is created lazily on first play (no network / decode
 *    cost until the visitor opts in).
 *  - Choice + current track index persist in localStorage across navigations.
 *  - The control itself is static (no CSS animation) so it never counts against
 *    the motion cap.
 *
 * DROP-IN (no audio ships with the repo): add ROYALTY-FREE, commercial-use calm
 * Indian instrumental tracks at the paths in TRACKS below (public/music/*.mp3),
 * then rebuild/redeploy — the player auto-enables. Until the FIRST track exists
 * the control hides itself (a HEAD probe), so the corner stays clean and nothing
 * 404s. (Next snapshots public/ at build time, so files must be present before
 * `next build`.) Keep each track's license note alongside the file. Good
 * sources are royalty-free / Creative-Commons libraries whose license clearly
 * permits commercial web use (e.g. calm sitar / veena / ambient raga).
 */
type Track = { src: string; title: string };

// Edit this list to match the files in public/music/ (title = what shows while
// playing). See public/music/README.md for how to add/replace tracks.
const TRACKS: Track[] = [
  { src: "/music/india_happy-indian-wedding-490659.mp3", title: "Happy Indian Wedding" },
  { src: "/music/aar_music-indian-classical-instrumental-319883.mp3", title: "Indian Classical Instrumental" },
  { src: "/music/sigmamusicart-indian-diwali-hindu-background-music-425897.mp3", title: "Diwali Ambience" },
  { src: "/music/the_mountain-wedding-165605.mp3", title: "Mountain Wedding" },
];

const KEY_ON = "kalyanam.music.on";
const KEY_IDX = "kalyanam.music.idx";

export function AmbientMusic() {
  // Gate the whole control on the first track actually existing.
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Probe the first track once on mount. 200 → the playlist is present.
  useEffect(() => {
    let cancelled = false;
    fetch(TRACKS[0].src, { method: "HEAD" })
      .then((r) => {
        if (!cancelled && r.ok) setAvailable(true);
      })
      .catch(() => {
        /* absent / offline → control stays hidden */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Restore the saved track index (and resume if the visitor had it on).
  // Deferred to a microtask so we're not calling setState synchronously in the
  // effect body (avoids the cascading-render lint + is closer to user intent).
  useEffect(() => {
    if (!available) return;
    queueMicrotask(() => {
      try {
        const savedIdx = Number(localStorage.getItem(KEY_IDX));
        if (Number.isInteger(savedIdx) && savedIdx >= 0 && savedIdx < TRACKS.length) {
          setIndex(savedIdx);
        }
        if (localStorage.getItem(KEY_ON) === "1") void start(savedIdx || 0);
      } catch {
        /* storage blocked */
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available]);

  function ensureAudio() {
    if (audioRef.current) return audioRef.current;
    const el = new Audio();
    el.volume = 0.32; // soft — background, never foreground
    el.preload = "none";
    // When a track ends, advance to the next (wrap around) and keep playing.
    el.addEventListener("ended", () => next(true));
    audioRef.current = el;
    return el;
  }

  async function start(i = index) {
    const el = ensureAudio();
    const track = TRACKS[i] ?? TRACKS[0];
    if (!el.src.endsWith(track.src)) el.src = track.src;
    try {
      await el.play();
      setPlaying(true);
      setIndex(i);
      persist(true, i);
    } catch {
      // Autoplay can reject a non-user-initiated resume; the visitor can tap.
      setPlaying(false);
    }
  }

  function stop() {
    audioRef.current?.pause();
    setPlaying(false);
    persist(false, index);
  }

  function next(keepPlaying = playing) {
    const i = (index + 1) % TRACKS.length;
    setIndex(i);
    persist(playing, i);
    if (keepPlaying) {
      const el = ensureAudio();
      el.src = TRACKS[i].src;
      void el.play().catch(() => setPlaying(false));
      setPlaying(true);
    }
  }

  function persist(on: boolean, i: number) {
    try {
      localStorage.setItem(KEY_ON, on ? "1" : "0");
      localStorage.setItem(KEY_IDX, String(i));
    } catch {
      /* ignore */
    }
  }

  if (!available) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-1 rounded-full border border-border bg-cream/95 p-1 shadow-[var(--shadow-md)]">
      {/* Play / pause */}
      <button
        type="button"
        onClick={() => (playing ? stop() : void start())}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        title={playing ? "Pause music" : "Play soft wedding music"}
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full transition-colors duration-[var(--dur-fast)]",
          playing
            ? "bg-forest-700 text-gold-400"
            : "text-forest-700 hover:bg-cream-deep/60 hover:text-gold-600",
        )}
      >
        {playing ? (
          <Volume2 className="h-[1.15rem] w-[1.15rem]" aria-hidden />
        ) : (
          <VolumeX className="h-[1.15rem] w-[1.15rem]" aria-hidden />
        )}
      </button>

      {/* Skip */}
      <button
        type="button"
        onClick={() => next()}
        aria-label="Skip to next track"
        title="Next track"
        className="grid h-9 w-9 place-items-center rounded-full text-forest-700 transition-colors duration-[var(--dur-fast)] hover:bg-cream-deep/60 hover:text-gold-600"
      >
        <SkipForward className="h-[1.05rem] w-[1.05rem]" aria-hidden />
      </button>

      {/* Current track title — appears when playing */}
      {playing && (
        <span className="flex items-center gap-1.5 pl-1 pr-2.5 text-xs text-ink-soft">
          <Music className="h-3.5 w-3.5 text-gold-600" aria-hidden />
          <span className="max-w-[8rem] truncate">{TRACKS[index]?.title}</span>
        </span>
      )}
    </div>
  );
}
