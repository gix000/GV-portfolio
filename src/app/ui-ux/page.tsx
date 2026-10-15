"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { siteData, type VideoProject } from "@/lib/data";

function VideoCard({
  video,
  index,
  onPlay,
}: {
  video: VideoProject;
  index: number;
  onPlay: (v: VideoProject) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative cursor-pointer"
      onClick={() => onPlay(video)}
      data-cursor-hover
    >
      {/* Poster image container */}
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-paper-lo shadow-lg">
        <Image
          src={video.poster}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Persistent play indicator - always visible so tap affordance is clear */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg group-hover:bg-white/95 group-hover:scale-110 transition-all duration-400"
          >
            <svg
              width="18"
              height="22"
              viewBox="0 0 20 24"
              fill="none"
              className="ml-1 text-ink"
            >
              <path d="M2 2L18 12L2 22V2Z" fill="currentColor" />
            </svg>
          </motion.div>
        </div>
        {/* "Tap to play" label - visible by default, fades on hover as play button takes over */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center pointer-events-none">
          <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 transition-opacity duration-300 group-hover:opacity-0">
            Tap to play
          </span>
        </div>
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
      </div>

      {/* Info below card */}
      <div className="mt-4">
        <h3 className="font-serif text-xl md:text-2xl tracking-tight text-ink group-hover:text-accent transition-colors duration-300">
          {video.title}
        </h3>
        <p className="mt-2 text-sm text-ink-70 leading-relaxed line-clamp-2">
          {video.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {video.tags.map((tag) => (
            <span
              key={tag}
              className="text-[9px] tracking-[0.15em] uppercase font-semibold text-ink-50 border border-line rounded-full px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: VideoProject;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play when modal opens
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be blocked; user can tap play manually
      });
    }
    // Lock body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close video"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 2L14 14M14 2L2 14"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Video container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-5xl aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.poster}
          controls
          playsInline
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Title below video */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="absolute bottom-6 left-0 right-0 text-center pointer-events-none"
      >
        <h2 className="font-serif text-xl md:text-2xl text-white tracking-tight">
          {video.title}
        </h2>
      </motion.div>
    </motion.div>
  );
}

export default function UiUxPage() {
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  return (
    <>
      <div className="min-h-screen bg-paper">
        {/* Back link */}
        <div className="fixed top-0 left-0 right-0 z-50 px-[clamp(28px,6vw,72px)] py-5 flex items-center justify-between bg-paper/80 backdrop-blur-sm">
          <Link
            href="/#top"
            className="text-[11px] tracking-[0.18em] uppercase font-semibold hover:text-accent transition-colors duration-300 text-ink"
            data-cursor-hover
          >
            &larr; Back to Home
          </Link>
          <span className="text-[10px] tracking-[0.15em] uppercase text-ink-50 font-semibold">
            UI/UX Work
          </span>
        </div>

        <div className="pt-28 pb-20 px-[clamp(28px,6vw,72px)]">
          <div className="max-w-[1280px] mx-auto">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-16"
            >
              <div className="flex items-center gap-4 text-[11px] tracking-[0.2em] uppercase text-ink-50 font-semibold mb-6">
                <span className="text-accent">03</span>
                <span>UI/UX Design</span>
                <span className="flex-1 h-px bg-line" />
              </div>
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-ink leading-[1.05] mb-4">
                Interface & Experience
              </h1>
              <p className="text-ink-70 max-w-xl leading-relaxed text-lg">
                Digital product design work - from dashboards and mobile apps to
                conversion-focused flows. Each video walks through the thinking,
                process, and interaction details behind the design.
              </p>
            </motion.div>

            {/* Video grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {siteData.uiuxVideos.map((video, i) => (
                <VideoCard
                  key={video.key}
                  video={video}
                  index={i}
                  onPlay={setActiveVideo}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen video modal */}
      <AnimatePresence>
        {activeVideo && (
          <VideoModal
            video={activeVideo}
            onClose={() => setActiveVideo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}