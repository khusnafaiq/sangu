import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Same tokens as the app (index.html :root).
export const C = {
  bg: "#09090B",
  canvas: "#050506",
  surface1: "#121215",
  surface2: "#18181C",
  surface3: "#232329",
  border: "rgba(255, 255, 255, 0.08)",
  borderHover: "rgba(255, 255, 255, 0.18)",
  text: "#FAFAFA",
  text2: "#A1A1AA",
  muted: "#8A8A94",
  green: "#34D399",
  red: "#FB5D78",
  blue: "#38BDF8",
  yellow: "#FBBF24",
  purple: "#A78BFA",
  pink: "#E879F9",
  orange: "#FB923C",
} as const;

export const FONT = "Plus Jakarta Sans";
export const MONO = "'Courier New', 'Liberation Mono', 'DejaVu Sans Mono', monospace";

// The app ships Plus Jakarta Sans as a variable font (400–800), split by unicode range.
loadFont({
  family: FONT,
  url: staticFile("fonts/PlusJakartaSans-latin.woff2"),
  weight: "400 800",
  unicodeRange:
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
});
loadFont({
  family: FONT,
  url: staticFile("fonts/PlusJakartaSans-latin-ext.woff2"),
  weight: "400 800",
  unicodeRange:
    "U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF",
});

/** 1234567 -> "1.234.567" (id-ID grouping, as in the app). */
export const rupiah = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
