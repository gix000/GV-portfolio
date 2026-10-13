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
    // After the folder-open animation, unmount the overlay
    setTimeout(() => setGone(true), prefersReduced ? 50 : 900);
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
            background:
              "radial-gradient(120% 90% at 50% 30%, #F8F5ED 0%, #F2EDE4 46%, #E8E2D6 100%)",
          }}
        >
          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-[clamp(24px,5vw,64px)] text-[10px] md:text-[11px] tracking-[0.22em] uppercase text-ink-70 font-semibold">
            <div className="flex flex-col gap-1">
              <b className="text-ink-soft font-bold tracking-[0.24em]">G.VIISUALS</b>
              <span className="hidden sm:inline">by George Charbel</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <b className="text-ink-soft font-bold tracking-[0.24em]">Beirut, LB</b>
              <span className="hidden sm:inline">Selected Works &middot; Vol. 01</span>
            </div>
          </div>

          {/* Interactive folder */}
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
            className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 rounded-3xl"
            style={{ width: "min(86vw, 560px)" }}
          >
            {/* Back flap of the folder (revealed when opened) */}
            <motion.div
              className="absolute left-0 right-0 rounded-2xl"
              style={{
                top: 0,
                height: "100%",
                backgroundColor: "#E8E2D6",
                boxShadow: "inset 0 2px 0 rgba(255,255,255,0.4)",
              }}
              initial={false}
            />

            {/* Folder body */}
            <motion.div
              className="relative rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "#C9BFA8",
                aspectRatio: "4 / 3",
                boxShadow:
                  "0 30px 60px -20px rgba(60,45,25,0.35), 0 12px 24px -12px rgba(60,45,25,0.25)",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E")`,
                backgroundSize: "250px 250px",
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Top edge highlight */}
              <div
                className="h-1 w-full"
                style={{ backgroundColor: "#A89A7E" }}
              />

              {/* Tab on top of folder */}
              <div className="absolute -top-px left-[18%] px-6 md:px-8 py-2 rounded-b-2xl font-serif text-sm md:text-base tracking-wide shadow-md"
                style={{ backgroundColor: "#B8AC92", color: "#3d2210" }}
              >
                G.VIISUALS · 2026
              </div>

              {/* Pen + binder clip row */}
              <div className="relative px-6 md:px-8 pt-10 flex items-end justify-between">
                {/* Pen */}
                <svg
                  width="80"
                  height="12"
                  viewBox="0 0 80 12"
                  fill="none"
                  className="opacity-80 -rotate-6 hidden sm:block"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="60" height="4" rx="2" fill="#1a1a1a" />
                  <path d="M62 3 L78 6 L62 9 Z" fill="#1a1a1a" />
                  <circle cx="7" cy="6" r="2" fill="#aaa" />
                  <rect x="13" y="4.5" width="6" height="3" fill="#444" />
                </svg>

                {/* Binder clip — centred */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2">
                  <svg width="44" height="40" viewBox="0 0 44 40" fill="none" aria-hidden="true">
                    <path
                      d="M14 5 C14 1.5 17.5 0 22 0 C26.5 0 30 1.5 30 5 L30 11 L14 11 Z"
                      stroke="#1a1a1a"
                      strokeWidth="2.5"
                      fill="none"
                    />
                    <rect x="6" y="11" width="32" height="24" rx="2.5" fill="#1a1a1a" />
                    <rect x="10" y="15" width="24" height="3" fill="#333" />
                    <rect x="10" y="21" width="24" height="2" fill="#333" />
                  </svg>
                </div>

                {/* Year tab */}
                <div
                  className="px-5 py-1.5 rounded-t-xl font-serif text-sm tracking-wide shadow-sm ml-auto"
                  style={{ backgroundColor: "#A89A7E", color: "#3d2210" }}
                >
                  Vol. 01
                </div>
              </div>

              {/* Logo centered */}
              <div className="flex items-center justify-center pt-6 pb-2">
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src="/assets/img/logo.png"
                    alt="GV Logo"
                    width={140}
                    height={100}
                    className="h-20 md:h-28 w-auto drop-shadow-sm"
                    priority
                  />
                </motion.div>
              </div>

              {/* Animated "tap to reveal" text */}
              <div className="flex flex-col items-center pt-2 pb-6">
                <motion.p
                  className="font-serif text-2xl md:text-3xl tracking-tight text-center"
                  style={{ color: "#3d2210" }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  Tap the folder
                </motion.p>
                <motion.p
                  className="text-[10px] md:text-[11px] tracking-[0.24em] uppercase font-semibold mt-2 text-center"
                  style={{ color: "rgba(61,34,16,0.55)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  to reveal the projects
                </motion.p>

                {/* Pulsing hint arrow */}
                <motion.div
                  className="mt-4"
                  animate={prefersReduced ? {} : { y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 8 L10 14 L16 8" stroke="#3d2210" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Opening animation overlay — flaps fly open */}
            <AnimatePresence>
              {opened && (
                <>
                  {/* Left flap */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-0 origin-left rounded-l-2xl"
                    style={{
                      width: "50%",
                      backgroundColor: "#C9BFA8",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E")`,
                      backgroundSize: "250px 250px",
                      zIndex: 5,
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -105 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
                  />
                  {/* Right flap */}
                  <motion.div
                    className="absolute top-0 bottom-0 right-0 origin-right rounded-r-2xl"
                    style={{
                      width: "50%",
                      backgroundColor: "#C9BFA8",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.08'/%3E%3C/svg%3E")`,
                      backgroundSize: "250px 250px",
                      zIndex: 5,
                    }}
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: 105 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.85, ease: [0.65, 0, 0.35, 1] }}
                  />
                </>
              )}
            </AnimatePresence>
          </button>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold"
          >
            Creative Portfolio &middot; 2026
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}