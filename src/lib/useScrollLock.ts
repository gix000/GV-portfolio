"use client";
import { useEffect } from "react";

type LenisLike = { stop: () => void; start: () => void };

// Freeze the page behind a modal. iOS Safari ignores `overflow: hidden` on
// <body> for touch scrolling, so the body is pinned with position: fixed at
// the current offset and put back exactly where it was on unlock.
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const lenis = (window as unknown as { __lenis?: LenisLike }).__lenis;
    const y = window.scrollY;
    const body = document.body;
    const html = document.documentElement;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
    };

    lenis?.stop();
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      html.style.overflow = prev.htmlOverflow;
      // Instant jump back; the smooth-scroll setting must not animate this.
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = "";
      lenis?.start();
    };
  }, [active]);
}
