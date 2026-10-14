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
    setTimeout(() => setGone(true), prefersReduced ? 50 : 1000);
  }

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: "#E8E4DE",
          }}
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
            {/* === BACK TAB (brown leather) === */}
            <motion.div
              className="absolute rounded-t-xl"
              style={{
                top: "-18px",
                left: "8%",
                width: "38%",
                height: "36px",
                background: "linear-gradient(180deg, #8B5E3C 0%, #6B4226 100%)",
                boxShadow: "0 -2px 8px rgba(107,66,38,0.3)",
                zIndex: 1,
              }}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* === BACK PANEL (slightly visible behind front) === */}
            <motion.div
              className="absolute rounded-xl"
              style={{
                top: "-6px",
                left: "2%",
                right: "2%",
                bottom: "4px",
                background: "linear-gradient(180deg, #D6CFC4 0%, #C8C0B4 100%)",
                zIndex: 1,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* === FRONT PANEL (cream/beige main body) === */}
            <motion.div
              className="relative rounded-xl overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #F0EBE3 0%, #E4DDD3 40%, #D9D1C5 100%)",
                aspectRatio: "4 / 3",
                boxShadow:
                  "0 20px 50px -12px rgba(80,60,40,0.25), 0 8px 20px -8px rgba(80,60,40,0.15), inset 0 1px 0 rgba(255,255,255,0.6)",
                zIndex: 2,
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top edge highlight */}
              <div
                className="h-[2px] w-full"
                style={{
                  background: "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.7) 70%, transparent 95%)",
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
              <div className="flex flex-col items-center justify-center h-full pt-4 pb-2">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
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

                {/* G.VIISUALS · Vol. 01 text */}
                <motion.p
                  className="font-serif text-base md:text-lg tracking-[0.15em] mt-3"
                  style={{ color: "#6B5A48" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  G.VIISUALS &middot; Vol. 01
                </motion.p>

                {/* Tap to reveal text */}
                <motion.p
                  className="text-[10px] md:text-[11px] tracking-[0.24em] uppercase font-semibold mt-4"
                  style={{ color: "rgba(107,90,72,0.5)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
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
                      opacity="0.4"
                    />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* === OPENING ANIMATION — flaps fly open === */}
            <AnimatePresence>
              {opened && (
                <>
                  {/* Left flap */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 origin-left rounded-l-xl"
                    style={{
                      width: "50%",
                      background: "linear-gradient(180deg, #F0EBE3 0%, #E4DDD3 40%, #D9D1C5 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      zIndex: 5,
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -110 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  />
                  {/* Right flap */}
                  <motion.div
                    className="absolute top-0 bottom-0 right-0 origin-right rounded-r-xl"
                    style={{
                      width: "50%",
                      background: "linear-gradient(180deg, #F0EBE3 0%, #E4DDD3 40%, #D9D1C5 100%)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                      zIndex: 5,
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 110 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
                  />
                </>
              )}
            </AnimatePresence>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}