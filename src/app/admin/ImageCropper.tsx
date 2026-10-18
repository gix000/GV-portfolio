"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type Rect = { x: number; y: number; w: number; h: number };
type Drag =
  | { kind: "move"; startX: number; startY: number; orig: Rect }
  | { kind: "resize"; corner: "nw" | "ne" | "sw" | "se"; startX: number; startY: number; orig: Rect };

const ASPECTS: { label: string; value: number | null | "orig" }[] = [
  { label: "Free", value: null },
  { label: "Original", value: "orig" },
  { label: "16:10", value: 16 / 10 },
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "9:16", value: 9 / 16 },
];

const MAX_OUTPUT = 2560; // longest edge of the exported image, px
const MIN_SIZE = 24; // smallest crop box on screen, px

export function ImageCropper({
  src,
  defaultAspect = null,
  onCancel,
  onDone,
  allowOriginal = false,
  onUseOriginal,
  mime,
}: {
  src: string;
  mime?: string;
  defaultAspect?: number | null;
  onCancel: () => void;
  onDone: (blob: Blob, type: string) => void;
  allowOriginal?: boolean;
  onUseOriginal?: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [aspect, setAspect] = useState<number | null>(defaultAspect);
  const [aspectLabel, setAspectLabel] = useState<string>(
    ASPECTS.find((a) => typeof a.value === "number" && Math.abs(a.value - (defaultAspect ?? -1)) < 0.001)?.label ?? "Free",
  );
  const [rect, setRect] = useState<Rect>({ x: 0, y: 0, w: 0, h: 0 });
  const drag = useRef<Drag | null>(null);

  const dims = () => {
    const img = imgRef.current;
    return img ? { W: img.clientWidth, H: img.clientHeight } : { W: 0, H: 0 };
  };

  // Largest centered box of the given aspect that fits the displayed image.
  const fitRect = useCallback((a: number | null): Rect => {
    const { W, H } = dims();
    if (!W || !H) return { x: 0, y: 0, w: 0, h: 0 };
    if (!a) {
      const m = 0.05;
      return { x: W * m, y: H * m, w: W * (1 - 2 * m), h: H * (1 - 2 * m) };
    }
    let w = W;
    let h = w / a;
    if (h > H) {
      h = H;
      w = h * a;
    }
    return { x: (W - w) / 2, y: (H - h) / 2, w, h };
  }, []);

  function chooseAspect(label: string, value: number | null | "orig") {
    const img = imgRef.current;
    const a = value === "orig" ? (img ? img.naturalWidth / img.naturalHeight : null) : value;
    setAspectLabel(label);
    setAspect(a);
    setRect(fitRect(a));
  }

  useEffect(() => {
    if (!loaded) return;
    setRect(fitRect(aspect));
    const onResize = () => setRect(fitRect(aspect));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  function clampRect(r: Rect): Rect {
    const { W, H } = dims();
    const w = Math.min(Math.max(r.w, MIN_SIZE), W);
    const h = Math.min(Math.max(r.h, MIN_SIZE), H);
    return { w, h, x: Math.min(Math.max(r.x, 0), W - w), y: Math.min(Math.max(r.y, 0), H - h) };
  }

  function onPointerDown(e: React.PointerEvent, kind: Drag["kind"], corner?: "nw" | "ne" | "sw" | "se") {
    e.preventDefault();
    e.stopPropagation();
    boxRef.current?.setPointerCapture(e.pointerId);
    drag.current =
      kind === "move"
        ? { kind, startX: e.clientX, startY: e.clientY, orig: rect }
        : { kind, corner: corner!, startX: e.clientX, startY: e.clientY, orig: rect };
  }

  function onPointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const o = d.orig;
    if (d.kind === "move") {
      setRect(clampRect({ ...o, x: o.x + dx, y: o.y + dy }));
      return;
    }
    const { W, H } = dims();
    // Anchor = the corner opposite the one being dragged.
    const left = d.corner === "nw" || d.corner === "sw";
    const top = d.corner === "nw" || d.corner === "ne";
    const ax = left ? o.x + o.w : o.x;
    const ay = top ? o.y + o.h : o.y;
    let w = Math.max(MIN_SIZE, left ? o.w - dx : o.w + dx);
    let h = Math.max(MIN_SIZE, top ? o.h - dy : o.h + dy);
    const maxW = left ? ax : W - ax;
    const maxH = top ? ay : H - ay;
    if (aspect) {
      // Follow whichever axis moved more, then keep the ratio inside bounds.
      if (Math.abs(dx) * (1 / aspect) > Math.abs(dy)) h = w / aspect;
      else w = h * aspect;
      if (w > maxW) { w = maxW; h = w / aspect; }
      if (h > maxH) { h = maxH; w = h * aspect; }
    } else {
      w = Math.min(w, maxW);
      h = Math.min(h, maxH);
    }
    setRect({ x: left ? ax - w : ax, y: top ? ay - h : ay, w, h });
  }

  function onPointerUp(e: React.PointerEvent) {
    drag.current = null;
    boxRef.current?.releasePointerCapture?.(e.pointerId);
  }

  async function apply() {
    const img = imgRef.current;
    if (!img) return;
    setBusy(true);
    setError("");
    try {
      const sx = img.naturalWidth / img.clientWidth;
      const sy = img.naturalHeight / img.clientHeight;
      const cw = rect.w * sx;
      const ch = rect.h * sy;
      const scale = Math.min(1, MAX_OUTPUT / Math.max(cw, ch));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(cw * scale);
      canvas.height = Math.round(ch * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, rect.x * sx, rect.y * sy, cw, ch, 0, 0, canvas.width, canvas.height);
      const isPng = mime ? mime === "image/png" : /\.png(\?|$)/i.test(src);
      const type = isPng ? "image/png" : "image/jpeg";
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.9));
      if (!blob) throw new Error("Could not export the cropped image");
      onDone(blob, type);
    } catch (err) {
      const msg = String(err);
      setError(
        /SecurityError|tainted/i.test(msg)
          ? "This image's host doesn't allow editing. Upload the file again instead, then crop it."
          : msg,
      );
      setBusy(false);
    }
  }

  const handle = (corner: "nw" | "ne" | "sw" | "se") => (
    <div
      onPointerDown={(e) => onPointerDown(e, "resize", corner)}
      className="absolute w-5 h-5 -m-2.5 rounded-full bg-white border-2 border-[#7F011F] shadow touch-none"
      style={{
        left: corner.includes("w") ? 0 : "100%",
        top: corner.includes("n") ? 0 : "100%",
        cursor: corner === "nw" || corner === "se" ? "nwse-resize" : "nesw-resize",
      }}
    />
  );

  return (
    <div className="fixed inset-0 z-[10000] bg-black/85 flex flex-col" data-lenis-prevent>
      <div className="flex items-center justify-between px-4 py-3 text-white">
        <span className="font-semibold">Crop image</span>
        <button type="button" onClick={onCancel} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm">
          Cancel
        </button>
      </div>

      <div className="flex gap-1.5 px-4 pb-3 overflow-x-auto">
        {ASPECTS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => chooseAspect(a.label, a.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border ${
              aspectLabel === a.label ? "bg-white text-black border-white" : "text-white border-white/30"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-4">
        <div
          ref={boxRef}
          className="relative select-none touch-none"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={src}
            alt=""
            crossOrigin={src.startsWith("blob:") || src.startsWith("data:") ? undefined : "anonymous"}
            onLoad={() => setLoaded(true)}
            onError={() => setError("Couldn't load this image.")}
            draggable={false}
            className="block max-w-[92vw] max-h-[62vh] w-auto h-auto"
          />
          {loaded && rect.w > 0 && (
            <>
            {/* dim everything outside the crop */}
            <div className="absolute left-0 right-0 top-0 bg-black/55 pointer-events-none" style={{ height: rect.y }} />
            <div className="absolute left-0 right-0 bottom-0 bg-black/55 pointer-events-none" style={{ top: rect.y + rect.h }} />
            <div className="absolute left-0 bg-black/55 pointer-events-none" style={{ top: rect.y, height: rect.h, width: rect.x }} />
            <div className="absolute right-0 bg-black/55 pointer-events-none" style={{ top: rect.y, height: rect.h, left: rect.x + rect.w }} />
            <div
              onPointerDown={(e) => onPointerDown(e, "move")}
              className="absolute border-2 border-white cursor-move touch-none"
              style={{
                left: rect.x,
                top: rect.y,
                width: rect.w,
                height: rect.h,
              }}
            >
              {/* rule-of-thirds guides */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/40" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/40" />
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/40" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/40" />
              </div>
              {handle("nw")}
              {handle("ne")}
              {handle("sw")}
              {handle("se")}
            </div>
            </>
          )}
        </div>
      </div>

      {error && <p className="px-4 pb-2 text-center text-sm text-red-300">{error}</p>}

      <div className="flex gap-2 px-4 pb-6 pt-2 justify-center">
        {allowOriginal && onUseOriginal && (
          <button
            type="button"
            disabled={busy}
            onClick={onUseOriginal}
            className="px-5 py-3 rounded-lg border border-white/30 text-white font-semibold disabled:opacity-50"
          >
            Use without cropping
          </button>
        )}
        <button
          type="button"
          disabled={!loaded || busy}
          onClick={apply}
          className="px-6 py-3 rounded-lg bg-white text-black font-semibold disabled:opacity-50"
        >
          {busy ? "Saving…" : "Crop & save"}
        </button>
      </div>
    </div>
  );
}
