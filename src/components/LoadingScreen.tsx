"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [opened, setOpened] = useState(false);
  const [gone, setGone] = useState(false);
  const prefersReduced = useReducedMotion();

  function handleOpen() {
    if (opened) return;
    setOpened(true);
    // Disappear animation: scale down + fade out
    setTimeout(() => setGone(true), prefersReduced ? 50 : 800);
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "#E8E4DE" }}
        >
          {/* Subtle grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Folder container */}
          <button
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }}
            aria-label="Tap the folder to reveal the projects"
            data-cursor-hover
            className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-700/40 focus-visible:ring-offset-4 rounded-2xl cursor-pointer"
            style={{ width: "min(80vw, 480px)" }}
          >
            {/* === BROWN LEATHER TAB (wraps over top edge) === */}
            <motion.div
              className="absolute"
              style={{
                top: "-22px",
                left: "6%",
                width: "42%",
                height: "44px",
                background: "linear-gradient(180deg, #9B6B42 0%, #7A4E2D 60%, #6B4226 100%)",
                borderRadius: "14px 14px 4px 4px",
                boxShadow:
                  "0 2px 6px rgba(107,66,38,0.35), inset 0 1px 0 rgba(255,255,255,0.15)",
                zIndex: 3,
              }}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* === WHITE PAPER SHEET (peeking between tab and front panel) === */}
            <motion.div
              className="absolute rounded-xl"
              style={{
                top: "-8px",
                left: "3%",
                right: "3%",
                bottom: "6px",
                background: "linear-gradient(180deg, #FFFFFF 0%, #F5F1EA 100%)",
                boxShadow: "0 1px 3px rgba(80,60,40,0.12)",
                zIndex: 2,
              }}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* === FRONT PANEL (cream/beige main body) === */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, #F2EDE4 0%, #E8E2D6 55%, #DDD5C7 100%)",
                aspectRatio: "4 / 3",
                boxShadow:
                  "0 24px 50px -14px rgba(80,60,40,0.28), 0 10px 22px -10px rgba(80,60,40,0.18), inset 0 1px 0 rgba(255,255,255,0.7)",
                zIndex: 4,
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top edge highlight */}
              <div
                className="h-[2px] w-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.85) 30%, rgba(255,255,255,0.85) 70%, transparent 95%)",
                }}
              />

              {/* Paper texture overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundSize: "250px 250px",
                }}
              />

              {/* Logo centered */}
              <div className="flex flex-col items-center justify-center h-full pt-2 pb-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src="/assets/img/logo.png"
                    alt="GV Logo"
                    width={160}
                    height={114}
                    className="h-24 md:h-32 w-auto drop-shadow-sm"
                    priority
                  />
                </motion.div>

                {/* Tap to reveal text */}
                <motion.p
                  className="text-[10px] md:text-[11px] tracking-[0.24em] uppercase font-semibold mt-5"
                  style={{ color: "rgba(107,90,72,0.55)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.85 }}
                >
                  Tap to reveal projects
                </motion.p>

                {/* Pulsing arrow */}
                <motion.div
                  className="mt-3"
                  animate={prefersReduced ? {} : { y: [0, 5, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path
                      d="M4 7 L9 12 L14 7"
                      stroke="#6B5A48"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.45"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}