"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Ambient audio toggle — a small, elegant opt-in control for soft background
 * music while a visitor browses the public site (before they sign in).
 *
 * Design decisions (deliberate, professional / trust-safe):
 *  - OFF by default. Browsers block autoplay-with-sound anyway, and unexpected
 *    audio is hostile — so nothing ever plays until the visitor taps play.
 *  - The <audio> element is created lazily on first play (no network cost, no
 *    decoding until the visitor opts in).
 *  - The choice is remembered in localStorage, so a visitor who turned it on
 *    keeps music across page navigations within the session/site.
 *  - prefers-reduced-motion has no bearing on audio, but we keep the control
 *    itself static (no animation) so it never counts against the motion cap.
 *
 * DROP-IN: no audio ships with the repo yet. Add a short, softly-looping,
 * ROYALTY-FREE instrumental (sitar / ambient, licensed for commercial use) at
 * `public/ambient.mp3`, then rebuild/redeploy — the control auto-enables. Until
 * that file exists the control hides itself (a HEAD probe below), so the corner
 * stays clean and nothing 404s. (Next snapshots `public/` at build time, so the
 * file must be present before `next build`, not just at runtime.) Suggested
 * sources: royalty-free libraries where the license explicitly permits
 * commercial web use — keep the license note alongside the file.
 */
const SRC = "/ambient.mp3";
const STORAGE_KEY = "kalyanam.ambientAudio";

export function AmbientAudio() {
  // `available` gates the whole control: only render once we've confirmed the
  // audio file actually exists, so the corner isn't cluttered before drop-in.
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Probe for the file once on mount. HEAD is cheap; a 200 means it's there.
  useEffect(() => {
    let cancelled = false;
    fetch(SRC, { method: "HEAD" })
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

  // If the visitor previously opted in, resume once the file is confirmed.
  useEffect(() => {
    if (!available) return;
    let resume = false;
    try {
      resume = localStorage.getItem(STORAGE_KEY) === "on";
    } catch {
      /* private mode / storage blocked */
    }
    if (resume) void start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available]);

  function ensureAudio() {
    if (audioRef.current) return audioRef.current;
    const el = new Audio(SRC);
    el.loop = true;
    el.volume = 0.35; // soft — background, never foreground
    el.preload = "none";
    audioRef.current = el;
    return el;
  }

  async function start() {
    const el = ensureAudio();
    try {
      await el.play();
      setPlaying(true);
      try {
        localStorage.setItem(STORAGE_KEY, "on");
      } catch {
        /* ignore */
      }
    } catch {
      // Autoplay policy can still reject a resume that isn't user-initiated;
      // that's fine — the visitor can tap the control to start it.
      setPlaying(false);
    }
  }

  function stop() {
    audioRef.current?.pause();
    setPlaying(false);
    try {
      localStorage.setItem(STORAGE_KEY, "off");
    } catch {
      /* ignore */
    }
  }

  if (!available) return null;

  return (
    <button
      type="button"
      onClick={() => (playing ? stop() : void start())}
      aria-pressed={playing}
      aria-label={playing ? "Turn off background music" : "Play background music"}
      title={playing ? "Turn off background music" : "Play soft background music"}
      className={cn(
        "fixed bottom-5 left-5 z-40 grid h-11 w-11 place-items-center rounded-full border shadow-[var(--shadow-md)] transition-colors duration-[var(--dur-fast)]",
        playing
          ? "border-gold-300 bg-forest-700 text-gold-300"
          : "border-border bg-cream/95 text-forest-700 hover:border-gold-300 hover:text-gold-600",
      )}
    >
      {playing ? (
        <Volume2 className="h-5 w-5" aria-hidden />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
