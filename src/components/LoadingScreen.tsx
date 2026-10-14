"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGone, setIsGone] = useState(false);
  const prefersReduced = useReducedMotion();

  // Auto-dismiss after interaction or timeout if user doesn't tap (optional, but good for UX)
  // For now, we rely on tap as requested ("when i tap on the folder")

  function handleTap() {
    if (isOpen) return;
    setIsOpen(true);
    // Wait for the folder opening animation to finish before removing from DOM
    setTimeout(() => setIsGone(true), prefersReduced ? 100 : 1200);
  }

  return (
    <AnimatePresence>
      {!isGone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#E8E4DE]"
        >
          {/* Background Grain */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* The Folder Container */}
          <div
            className="relative cursor-pointer focus:outline-none"
            onClick={handleTap}
            style={{ width: "min(85vw, 420px)", perspective: "1200px" }}
          >
            {/* BACK OF FOLDER (Static) */}
            <div
              className="absolute bottom-0 left-0 right-0 h-[70%] rounded-b-xl rounded-t-sm bg-[#D4C5B0] shadow-inner"
              style={{ zIndex: 1 }}
            />

            {/* PAPERS INSIDE (Reveal on open) */}
            <motion.div
              className="absolute bottom-[10%] left-[5%] right-[5%] h-[80%] bg-white rounded-sm shadow-sm origin-bottom"
              initial={{ y: 0, rotateX: 0 }}
              animate={isOpen ? { y: -20, rotateX: 5 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: 2 }}
            >
               <div className="w-full h-full p-4 flex flex-col gap-2 opacity-0">
                  {/* Fake text lines */}
                  <div className="h-2 w-3/4 bg-gray-200 rounded" />
                  <div className="h-2 w-1/2 bg-gray-200 rounded" />
                  <div className="h-2 w-5/6 bg-gray-200 rounded" />
               </div>
            </motion.div>

            {/* FRONT FLAP (The part that opens) */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[75%] rounded-b-xl rounded-t-sm origin-bottom shadow-2xl overflow-hidden"
              style={{
                zIndex: 3,
                background: "linear-gradient(180deg, #F2EDE4 0%, #E0D5C1 100%)",
                transformStyle: "preserve-3d",
              }}
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: -105 } : {}} // Open upwards/backwards
              transition={{
                duration: 0.8,
                delay: 0.1,
                ease: [0.45, 0, 0.55, 1]
              }}
            >
              {/* Flap Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 backface-hidden">
                 <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                 >
                    <Image
                      src="/assets/img/logo.png"
                      alt="GV"
                      width={120}
                      height={85}
                      className="w-24 h-auto drop-shadow-md mb-4"
                      priority
                    />
                 </motion.div>

                 <motion.p
                    className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8B7355]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                 >
                    Tap to Enter
                 </motion.p>
              </div>

              {/* Flap Texture/Highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/30" />
            </motion.div>

            {/* TAB (Attached to front flap) */}
            <motion.div
               className="absolute -top-6 left-8 w-24 h-8 bg-[#C4A57B] rounded-t-lg shadow-sm"
               style={{ zIndex: 4 }}
               initial={{ rotateX: 0 }}
               animate={isOpen ? { rotateX: -105 } : {}}
               transition={{
                 duration: 0.8,
                 delay: 0.1,
                 ease: [0.45, 0, 0.55, 1]
               }}
            >
               <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}