"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSiteData } from "@/lib/useSiteData";

// Shown once per visit. Skipped on the admin panel and on shared project
// links, which should open straight onto the project.
let introSeen = false;

export function LoadingScreen() {
  const pathname = usePathname();
  const [skip] = useState(() => introSeen || !!pathname?.startsWith("/projects"));
  if (skip || pathname?.startsWith("/admin")) {
    introSeen = true;
    return null;
  }
  return <LoadingScreenInner />;
}

// Folder geometry (px, before the fit-to-screen scale).
const W = 280; // overall width
const FLAP_TOP = 58; // where the glass front flap starts
const FLAP_H = 152;
// Front flap outline: a tab on the left, sloping down to the lower right edge.
const FLAP_PATH =
  "M14,0 H108 C115,0 119,2 123,7 L134,20 C138,24 142,26 149,26 H264 C273,26 280,33 280,42 V136 C280,145 273,152 264,152 H16 C7,152 0,145 0,136 V14 C0,6 6,0 14,0 Z";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

function LoadingScreenInner() {
  const tapToEnter = useSiteData().data.ui.intro.tapToEnter;
  const [isOpen, setIsOpen] = useState(false);
  const [isGone, setIsGone] = useState(false);
  const [scale, setScale] = useState(1);

  // Fit the folder to narrow phones.
  useEffect(() => {
    const fit = () => setScale(Math.min(1.15, (window.innerWidth - 64) / W));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

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
    // Land at the top of the page once the folder opens.
    const lenis = (window as unknown as { __lenis?: { scrollTo: (n: number, o?: { immediate?: boolean }) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0 });
    setTimeout(() => {
      introSeen = true;
      setIsGone(true);
    }, 1250);
  }

  // Three sheets inside the folder: back-to-front, each lifts out on open.
  const sheets = [
    { left: 150, top: 18, w: 96, h: 120, rot: 4, lift: -64, liftRot: 9, delay: 0.02 },
    { left: 112, top: 10, w: 104, h: 128, rot: 2, lift: -84, liftRot: 4, delay: 0.06 },
    { left: 40, top: 4, w: 150, h: 132, rot: -1, lift: -104, liftRot: -5, delay: 0.1 },
  ];

  return (
    <AnimatePresence>
      {!isGone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: EASE_IN_OUT } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#EDE0BE] select-none"
          onClick={handleTap}
          role="button"
          aria-label={tapToEnter}
        >
          {/* paper grain + soft vignette */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(120% 80% at 50% 45%, rgba(250,243,222,0.9) 0%, rgba(237,224,190,0) 60%)" }}
          />

          {/* Folder */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={
              isOpen
                ? { opacity: 0, y: -10, scale: 1.08, transition: { duration: 0.5, delay: 0.7, ease: EASE_IN_OUT } }
                : { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease: EASE_OUT } }
            }
            className="relative cursor-pointer"
            style={{ width: W * scale, height: (FLAP_TOP + FLAP_H) * scale }}
          >
            <div
              className="absolute left-0 top-0 origin-top-left"
              style={{ width: W, height: FLAP_TOP + FLAP_H, transform: `scale(${scale})`, perspective: 900 }}
            >
              {/* ground shadow */}
              <motion.div
                className="absolute rounded-[50%]"
                style={{
                  left: 22,
                  right: 22,
                  top: FLAP_TOP + FLAP_H - 6,
                  height: 26,
                  background: "radial-gradient(closest-side, rgba(92,1,22,0.22), rgba(92,1,22,0))",
                }}
                animate={isOpen ? { opacity: 0.4, scaleX: 1.1 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
              />

              {/* back panel */}
              <div
                className="absolute rounded-[18px]"
                style={{
                  left: 10,
                  right: 10,
                  top: 0,
                  height: FLAP_TOP + FLAP_H - 6,
                  background: "linear-gradient(180deg, #D9C9A3 0%, #CDBA8F 100%)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -10px 24px rgba(92,1,22,0.08)",
                }}
              />

              {/* sheets */}
              {sheets.map((sh, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-[10px] bg-white overflow-hidden"
                  style={{
                    left: sh.left,
                    top: sh.top,
                    width: sh.w,
                    height: sh.h,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06), 0 8px 18px -10px rgba(92,1,22,0.35)",
                  }}
                  initial={{ y: 26, rotate: sh.rot, opacity: 0 }}
                  animate={
                    isOpen
                      ? { y: sh.lift, rotate: sh.liftRot, opacity: 1, transition: { duration: 0.75, delay: 0.12 + sh.delay, ease: EASE_OUT } }
                      : { y: 0, rotate: sh.rot, opacity: 1, transition: { duration: 0.8, delay: 0.25 + sh.delay * 2, ease: EASE_OUT } }
                  }
                >
                  <div className="absolute left-[12%] right-[30%] top-[14%] h-[7px] rounded-full bg-[#E8E1D0]" />
                  {[0, 1, 2, 3].map((l) => (
                    <div
                      key={l}
                      className="absolute left-[12%] h-[4px] rounded-full bg-[#EFEAE0]"
                      style={{ top: `${30 + l * 10}%`, right: `${18 + (l % 2) * 14}%` }}
                    />
                  ))}
                  {i === sheets.length - 1 && (
                    <div className="absolute right-[10%] bottom-[10%] w-[34%] opacity-80">
                      <Image src="/assets/img/logo.png" alt="" width={140} height={94} className="w-full h-auto" priority />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* frosted glass front flap */}
              <motion.div
                className="absolute left-0"
                style={{ top: FLAP_TOP, width: W, height: FLAP_H, transformOrigin: "50% 100%" }}
                initial={false}
                animate={isOpen ? { rotateX: -52, y: 10 } : { rotateX: 0, y: 0 }}
                transition={{ duration: 0.7, ease: EASE_IN_OUT }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `path("${FLAP_PATH}")`,
                    WebkitClipPath: `path("${FLAP_PATH}")`,
                    background:
                      "linear-gradient(180deg, rgba(250,243,222,0.42) 0%, rgba(232,218,184,0.62) 55%, rgba(217,201,163,0.78) 100%)",
                    WebkitBackdropFilter: "blur(10px) saturate(150%)",
                    backdropFilter: "blur(10px) saturate(150%)",
                  }}
                >
                  {/* light sweep */}
                  {!isOpen && (
                    <motion.div
                      className="absolute inset-y-0 w-1/3"
                      style={{ background: "linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)" }}
                      initial={{ x: "-120%" }}
                      animate={{ x: "380%" }}
                      transition={{ duration: 1.6, delay: 1.2, repeat: Infinity, repeatDelay: 2.4, ease: "easeInOut" }}
                    />
                  )}
                  {/* logo on the glass */}
                  <div className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[74px] opacity-90">
                    <Image src="/assets/img/logo.png" alt="GV" width={148} height={100} className="w-full h-auto" priority />
                  </div>
                </div>
                {/* bright rim on the glass edge */}
                <svg className="absolute inset-0 pointer-events-none" width={W} height={FLAP_H} viewBox={`0 0 ${W} ${FLAP_H}`} aria-hidden="true">
                  <defs>
                    <linearGradient id="gv-rim" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
                      <stop offset="0.4" stopColor="#fff" stopOpacity="0.25" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                  <path d={FLAP_PATH} fill="none" stroke="url(#gv-rim)" strokeWidth="1.5" />
                </svg>
              </motion.div>
            </div>
          </motion.div>

          {/* Tap to enter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isOpen ? { opacity: 0, y: 6, transition: { duration: 0.25 } } : { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.7, ease: EASE_OUT } }}
            className="glass-btn glass-static mt-10 h-10 px-5 gap-2 text-[10px] tracking-[0.22em] uppercase font-bold text-[#7F011F]"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#7F011F]"
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            {tapToEnter}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
