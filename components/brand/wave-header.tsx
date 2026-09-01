"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * WaveHeader — an interactive, calming "cloth / water" shimmer behind a
 * forest-green header. Flowing gold wave-lines drift slowly; moving the cursor
 * sends gentle ripples out from it (like touching water). Canvas 2D, no deps.
 *
 * CRASH-SAFE by design (this project's #1 rule — a past always-on animation
 * crashed a machine):
 *  - Animation runs ONLY while the header is on screen (IntersectionObserver);
 *    off-screen → the rAF loop stops entirely → zero GPU.
 *  - Capped at ~30fps (frame-skip), and devicePixelRatio capped at 1.5.
 *  - prefers-reduced-motion → renders ONE static frame, no loop, no listeners.
 *  - Ripples decay and are pruned; pointer listener is passive.
 *  - Everything is cleaned up on unmount.
 *
 * Usage: place as the first child of a `relative` forest section; put the real
 * header content in a sibling with `relative z-10`.
 */

type Ripple = { x: number; y: number; t: number }; // t = age in seconds

export function WaveHeader({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // ── the wave field ───────────────────────────────────────────
    const LAYERS = 5; // number of flowing wave-lines
    const ripples: Ripple[] = [];
    let pointer = { x: -9999, y: -9999, active: false };

    function drawFrame(time: number) {
      ctx!.clearRect(0, 0, width, height);

      // Each layer is a horizontal band of gold that undulates. Lower layers
      // are fainter + slower — depth. We draw filled bands, not just lines, so
      // it reads as flowing cloth/water rather than a graph.
      for (let l = 0; l < LAYERS; l++) {
        const depth = l / (LAYERS - 1); // 0 (back) → 1 (front)
        const baseY = height * (0.35 + depth * 0.6);
        const amp = 10 + depth * 22; // taller waves in front
        const speed = 0.00018 + depth * 0.00022;
        const wl = 260 + depth * 140; // wavelength
        const alpha = 0.05 + depth * 0.1;

        ctx!.beginPath();
        ctx!.moveTo(0, height);
        const step = 14;
        for (let x = 0; x <= width + step; x += step) {
          let y =
            baseY +
            Math.sin(x / wl + time * speed) * amp +
            Math.sin(x / (wl * 0.5) - time * speed * 1.7) * amp * 0.4;

          // Ripple influence: each ripple lifts the surface near it, fading
          // out with age and distance (a calm expanding ring).
          for (const r of ripples) {
            const dx = x - r.x;
            const dist = Math.abs(dx);
            const ringR = r.t * 260; // ripple expands outward over time
            const band = Math.exp(-((dist - ringR) ** 2) / 2600); // gaussian ring
            const decay = Math.max(0, 1 - r.t / 1.6); // fades over ~1.6s
            y -= band * decay * (26 + depth * 18);
          }

          // Pointer "lift": the surface leans up gently toward the cursor.
          if (pointer.active) {
            const dx = x - pointer.x;
            const pull = Math.exp(-(dx * dx) / 12000);
            y -= pull * 14 * (0.4 + depth);
          }

          ctx!.lineTo(x, y);
        }
        ctx!.lineTo(width, height);
        ctx!.closePath();

        // Gold gradient fill with a soft shimmer highlight riding across.
        const shimmer = (Math.sin(time * 0.0004 + l) + 1) / 2; // 0..1
        const grad = ctx!.createLinearGradient(0, baseY - amp, 0, height);
        grad.addColorStop(0, `rgba(216,185,97,${alpha + shimmer * 0.05})`); // gold-400
        grad.addColorStop(0.5, `rgba(201,162,39,${alpha * 0.7})`); // gold-500
        grad.addColorStop(1, `rgba(15,44,31,0)`); // fade into forest-900
        ctx!.fillStyle = grad;
        ctx!.fill();

        // A thin luminous crest line on the front layers.
        if (l >= LAYERS - 2) {
          ctx!.strokeStyle = `rgba(236,220,174,${0.06 + shimmer * 0.05})`;
          ctx!.lineWidth = 1;
          ctx!.stroke();
        }
      }
    }

    // ── reduced motion: one static frame, done ───────────────────
    if (reduced) {
      drawFrame(0);
      const ro = new ResizeObserver(() => {
        resize();
        drawFrame(0);
      });
      ro.observe(canvas.parentElement!);
      return () => ro.disconnect();
    }

    // ── animation loop (paused off-screen, ~30fps) ───────────────
    let raf = 0;
    let last = 0;
    let visible = true;
    const FRAME_MS = 1000 / 30;

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      const dt = (now - last) / 1000;
      last = now;

      // Age + prune ripples.
      for (const r of ripples) r.t += dt;
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (ripples[i].t > 1.6) ripples.splice(i, 1);
      }
      drawFrame(now);
    }

    function start() {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    // Only animate while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);

    // Pointer → ripples (throttled: at most one ripple per ~60ms of movement).
    let lastRipple = 0;
    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
      const now = performance.now();
      if (now - lastRipple > 60) {
        lastRipple = now;
        ripples.push({ x: pointer.x, y: pointer.y, t: 0 });
        if (ripples.length > 24) ripples.shift();
      }
    }
    function onLeave() {
      pointer.active = false;
    }

    const parent = canvas.parentElement!;
    parent.addEventListener("pointermove", onMove, { passive: true });
    parent.addEventListener("pointerleave", onLeave, { passive: true });

    const ro = new ResizeObserver(() => resize());
    ro.observe(parent);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
