"use client";
import { getImageProps } from "next/image";
import { preload } from "react-dom";

export const CASE_IMAGE_SIZES = "(max-width: 1280px) 100vw, 1280px";

// Warm the browser cache with the exact responsive image the next screen will
// request (same optimizer URL + srcset), so it paints instantly when opened.
export function preloadImage(src: string | undefined, sizes = CASE_IMAGE_SIZES) {
  if (!src) return;
  try {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes });
    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority: "low",
    });
  } catch {
    // Unknown host or bad URL: skip, the image will just load normally.
  }
}

// Run work when the browser is idle (falls back to a short timeout on Safari).
export function whenIdle(fn: () => void): () => void {
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(fn, { timeout: 1500 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(fn, 400);
  return () => window.clearTimeout(id);
}
