"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { useScrollLock } from "@/lib/useScrollLock";

type Pt = { x: number; y: number };
const MAX_ZOOM = 4;

/* One slide: pinch or double-tap to zoom, drag to pan while zoomed.
   At 1x the slide leaves horizontal swipes to the carousel. */
function ZoomSlide({
  src,
  alt,
  active,
  onZoomChange,
}: {
  src: string;
  alt: string;
  active: boolean;
  onZoomChange: (zoomed: boolean) => void;
}) {
  const [t, setT] = useState({ s: 1, x: 0, y: 0 });
  const [animate, setAnimate] = useState(false);
  const pointers = useRef(new Map<number, Pt>());
  const start = useRef<{ s: number; x: number; y: number; dist: number; mid: Pt; p: Pt } | null>(null);
  const lastTap = useRef(0);
  const box = useRef<HTMLDivElement>(null);

  // Reset zoom when the slide scrolls out of view.
  useEffect(() => {
    if (!active) setT({ s: 1, x: 0, y: 0 });
  }, [active]);

  useEffect(() => onZoomChange(t.s > 1.01), [t.s, onZoomChange]);

  const clamp = useCallback((s: number, x: number, y: number) => {
    const el = box.current;
    if (!el) return { s, x, y };
    const maxX = ((s - 1) * el.clientWidth) / 2;
    const maxY = ((s - 1) * el.clientHeight) / 2;
    return { s, x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  }, []);

  const begin = () => {
    const pts = [...pointers.current.values()];
    const mid = pts.length > 1 ? { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 } : pts[0];
    const dist = pts.length > 1 ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) : 0;
    start.current = { ...t, dist, mid, p: pts[0] };
  };

  function onDown(e: React.PointerEvent) {
    // At 1x with one finger, let the carousel handle the swipe.
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 || t.s > 1.01) {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    setAnimate(false);
    begin();
  }

  function onMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const st = start.current;
    if (!st) return;
    const pts = [...pointers.current.values()];
    if (pts.length > 1 && st.dist > 0) {
      const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      const s = Math.max(1, Math.min(MAX_ZOOM, (st.s * dist) / st.dist));
      const mid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      setT(clamp(s, st.x + (mid.x - st.mid.x), st.y + (mid.y - st.mid.y)));
    } else if (t.s > 1.01) {
      setT(clamp(t.s, st.x + (pts[0].x - st.p.x), st.y + (pts[0].y - st.p.y)));
    }
  }

  function onUp(e: React.PointerEvent) {
    const wasSingle = pointers.current.size === 1;
    pointers.current.delete(e.pointerId);
    if (pointers.current.size > 0) {
      begin();
      return;
    }
    start.current = null;
    if (t.s < 1.05) setT({ s: 1, x: 0, y: 0 });
    // Double-tap: zoom to 2.5x at the tapped point, or back out.
    if (wasSingle) {
      const now = Date.now();
      if (now - lastTap.current < 280) {
        setAnimate(true);
        if (t.s > 1.01) setT({ s: 1, x: 0, y: 0 });
        else {
          const el = box.current!.getBoundingClientRect();
          const cx = e.clientX - (el.left + el.width / 2);
          const cy = e.clientY - (el.top + el.height / 2);
          setT(clamp(2.5, -cx * 1.5, -cy * 1.5));
        }
        lastTap.current = 0;
      } else lastTap.current = now;
    }
  }

  return (
    <div
      ref={box}
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      style={{ touchAction: t.s > 1.01 ? "none" : "pan-x" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        draggable={false}
        decoding="async"
        loading={active ? "eager" : "lazy"}
        className="max-w-full max-h-full object-contain select-none will-change-transform"
        style={{
          transform: `translate3d(${t.x}px, ${t.y}px, 0) scale(${t.s})`,
          transition: animate ? "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
      />
    </div>
  );
}

export function Lightbox({
  images,
  captions,
  index,
  onClose,
}: {
  images: string[];
  captions?: string[];
  index: number;
  onClose: () => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(index);
  const [zoomed, setZoomed] = useState(false);
  const [mounted, setMounted] = useState(false);
  useScrollLock(true);

  useEffect(() => setMounted(true), []);

  // Open on the tapped image.
  useEffect(() => {
    const el = track.current;
    if (el) el.scrollLeft = index * el.clientWidth;
  }, [index, mounted]);

  const go = useCallback((i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(images.length - 1, i));
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  }, [images.length]);

  useEffect(() => {
    // Capture phase + stopPropagation: Escape closes only the viewer, not the
    // project overlay underneath.
    const onKey = (e: KeyboardEvent) => {
      if (!["Escape", "ArrowRight", "ArrowLeft"].includes(e.key)) return;
      e.stopPropagation();
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [current, go, onClose]);

  const onScroll = () => {
    const el = track.current;
    if (el) setCurrent(Math.round(el.scrollLeft / el.clientWidth));
  };

  const onZoomChange = useCallback((z: boolean) => setZoomed(z), []);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[10000] bg-black/95 flex flex-col"
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 pt-[max(14px,env(safe-area-inset-top))] pb-3 pointer-events-none">
        <span className="glass-btn glass-dark glass-static h-8 px-3 text-[11px] font-semibold tabular-nums">
          {current + 1} / {images.length}
        </span>
        <button type="button" onClick={onClose} className="glass-btn glass-dark h-10 w-10 pointer-events-auto" aria-label="Close">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        ref={track}
        onScroll={onScroll}
        className="flex-1 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-contain"
        style={{ overflowX: zoomed ? "hidden" : "auto" }}
      >
        {images.map((src, i) => (
          <div key={i} className="shrink-0 w-full h-full snap-center px-2 py-16">
            {Math.abs(i - current) <= 2 ? (
              <ZoomSlide src={src} alt={captions?.[i] || `Image ${i + 1}`} active={i === current} onZoomChange={onZoomChange} />
            ) : null}
          </div>
        ))}
      </div>

      {captions?.[current] && (
        <div className="absolute bottom-0 inset-x-0 flex justify-center px-4 pb-[max(18px,env(safe-area-inset-bottom))] pointer-events-none">
          <span className="glass-btn glass-dark glass-static h-8 px-3 text-[10px] tracking-[0.16em] uppercase font-bold">
            {captions[current]}
          </span>
        </div>
      )}

      {/* Desktop arrows */}
      {current > 0 && (
        <button
          type="button"
          onClick={() => go(current - 1)}
          className="glass-btn glass-dark hidden md:inline-flex absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12"
          aria-label="Previous image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
      )}
      {current < images.length - 1 && (
        <button
          type="button"
          onClick={() => go(current + 1)}
          className="glass-btn glass-dark hidden md:inline-flex absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12"
          aria-label="Next image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      )}
    </motion.div>,
    document.body,
  );
}
