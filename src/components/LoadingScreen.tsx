"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 400);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!loaded && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 28%, #F8F5ED 0%, #F2EDE4 46%, #E8E2D6 100%)",
          }}
        >
          {/* Grain overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-[clamp(28px,6vw,72px)] text-[11px] tracking-[0.22em] uppercase text-ink-70 font-semibold">
            <div className="flex flex-col gap-1">
              <b className="text-ink-soft font-bold tracking-[0.24em]">
                G.VIISUALS
              </b>
              <span className="hidden sm:inline">by George Charbel</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <b className="text-ink-soft font-bold tracking-[0.24em]">
                Beirut, LB
              </b>
              <span className="hidden sm:inline">
                Selected Works &middot; Vol. 01
              </span>
            </div>
          </div>

          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-12"
          >
            <Image
              src="/assets/img/logo.png"
              alt="GV Logo"
              width={140}
              height={100}
              className="h-28 w-auto"
              priority
            />
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 md:w-64">
            <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-3">
              <span>Loading</span>
              <span>{Math.min(Math.round(progress), 100)}%</span>
            </div>
            <div className="h-px bg-line w-full relative overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full bg-ink"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Bottom hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-ink-50 font-semibold"
          >
            Creative Portfolio &middot; 2026
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}