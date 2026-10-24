"use client";

// Single place GSAP plugins are registered, so every component imports the
// same configured instance.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Matches the framer-motion curve used across the site: [0.22, 1, 0.36, 1].
export const EASE_OUT = "expo.out";
export const EASE_IN_OUT = "expo.inOut";

// Every animation is added under this query, so reduced-motion visitors get
// the final, static state with no splitting or transforms at all.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText, useGSAP };
