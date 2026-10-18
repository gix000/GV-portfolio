"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// The folder intro is for visitors, not for the admin panel.
export function LoadingScreen() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <LoadingScreenInner />;
}

function LoadingScreenInner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGone, setIsGone] = useState(false);

  // Lock ALL scroll while loading screen is visible — body, html, AND lenis
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (!isGone) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.touchAction = "none";
      if (lenis) lenis.stop();
    } else {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      if (lenis) lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.touchAction = "";
      if (lenis) lenis.start();
    };
  }, [isGone]);

  function handleTap() {
    if (isOpen) return;
    setIsOpen(true);
    // Scroll to top when folder opens so user lands at the header
    const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: { immediate?: boolean }) => void } }).__lenis;
    if (lenis) { lenis.scrollTo(0, { immediate: true }); } else { window.scrollTo({ top: 0, left: 0 }); }
    setTimeout(() => setIsGone(true), 1000);
  }

  return (
    <AnimatePresence>
      {!isGone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#EDE0BE]"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-multiply"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="relative cursor-pointer select-none"
            onClick={handleTap}
            style={{ width: "min(85vw, 380px)", height: "280px" }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-[65%] rounded-b-xl rounded-t-sm bg-[#D9C9A3] z-10" />
            <motion.div
              className="absolute bottom-[12%] left-[6%] right-[6%] h-[75%] bg-white rounded-sm z-20 overflow-hidden"
              initial={{ y: 0 }}
              animate={isOpen ? { y: -40 } : {}}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-6 space-y-3 opacity-60">
                <div className="h-2 w-3/4 bg-gray-200 rounded" />
                <div className="h-2 w-1/2 bg-gray-200 rounded" />
                <div className="h-2 w-5/6 bg-gray-200 rounded" />
                <div className="h-2 w-2/3 bg-gray-200 rounded" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <Image src="/assets/img/logo.png" alt="" width={100} height={100} className="w-24 h-auto grayscale" />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[70%] rounded-b-xl rounded-t-sm origin-bottom z-30 overflow-hidden"
              style={{ background: "linear-gradient(180deg, #F5EBD0 0%, #D9C9A3 100%)" }}
              initial={{ rotateX: 0 }}
              animate={isOpen ? { rotateX: -110 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.45, 0, 0.55, 1] }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Image src="/assets/img/logo.png" alt="GV" width={120} height={85} className="w-24 h-auto drop-shadow-md mb-4" priority />
                </motion.div>
                <motion.p
                  className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#7F011F]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                >
                  Tap to Enter
                </motion.p>
              </div>
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
