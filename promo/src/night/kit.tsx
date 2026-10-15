import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { C, FONT } from "../theme";
import { SCREEN_H, SCREEN_W, StatusBar } from "../components/Phone";

// "Night" cut: near-black stage, glowing type, slow blur reveals, match cuts.

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const slow = Easing.bezier(0.22, 1, 0.36, 1);
export const glide = Easing.bezier(0.65, 0, 0.35, 1);

export const INK = "#F2F5F3";
export const GLOW = {
  white: "0 0 12px rgba(255,255,255,0.32), 0 0 46px rgba(52,211,153,0.28)",
  red: "0 0 14px rgba(251,93,120,0.75), 0 0 64px rgba(251,93,120,0.45)",
  green: "0 0 14px rgba(52,211,153,0.75), 0 0 64px rgba(52,211,153,0.45)",
  soft: "0 0 10px rgba(255,255,255,0.18), 0 0 36px rgba(52,211,153,0.16)",
} as const;

/** Near-black stage with a faint, slowly breathing green light. */
export const NightBg: React.FC<{ light?: number }> = ({ light = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ background: "#040506", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1000,
          left: -300 + Math.sin(t * 0.25) * 60,
          top: -520 + Math.cos(t * 0.2) * 40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(52,211,153,0.16), rgba(52,211,153,0) 65%)",
          opacity: light,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1300,
          height: 900,
          right: -360 + Math.cos(t * 0.22) * 50,
          bottom: -480 + Math.sin(t * 0.27) * 40,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.10), rgba(56,189,248,0) 65%)",
          opacity: light,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Blur-in / blur-out envelope for one element (slow, cinematic).
 * Returns style props: opacity, filter (blur), translate.
 */
export const veil = (
  frame: number,
  inAt: number,
  outAt = 1e9,
  inDur = 22,
  outDur = 16,
  rise = 14,
): React.CSSProperties => {
  const vin = interpolate(frame, [inAt, inAt + inDur], [0, 1], {
    ...clamp,
    easing: slow,
  });
  const vout = interpolate(frame, [outAt, outAt + outDur], [1, 0], {
    ...clamp,
    easing: Easing.in(Easing.quad),
  });
  const v = Math.min(vin, vout);
  const blur = (1 - vin) * 22 + (1 - vout) * 16;
  return {
    opacity: v,
    filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
    translate: `0px ${(1 - vin) * rise - (1 - vout) * rise * 0.6}px`,
  };
};

/** One line of glowing type, words revealed one after another. */
export const GlowLine: React.FC<{
  words: { t: string; color?: string; glow?: string; bold?: boolean }[];
  at: number;
  out?: number;
  stagger?: number;
  size?: number;
  style?: React.CSSProperties;
}> = ({ words, at, out = 1e9, stagger = 5, size = 100, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 500,
        letterSpacing: -size * 0.03,
        color: INK,
        whiteSpace: "pre",
        textShadow: GLOW.white,
        ...style,
      }}
    >
      {words.map((w, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            color: w.color,
            textShadow: w.glow,
            fontWeight: w.bold ? 700 : undefined,
            ...veil(frame, at + i * stagger, out, 22, 16, 10),
          }}
        >
          {w.t}
        </span>
      ))}
    </div>
  );
};

/** The real app icon (white tile, green mark). */
export const AppIcon: React.FC<{
  size: number;
  style?: React.CSSProperties;
}> = ({ size, style }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.23,
      background: "linear-gradient(180deg, #FFFFFF, #F1F5F3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 ${size * 0.5}px rgba(52,211,153,0.35), 0 ${size * 0.12}px ${size * 0.4}px rgba(0,0,0,0.5)`,
      flexShrink: 0,
      ...style,
    }}
  >
    <Img
      src={staticFile("brand/logo-mark-512.png")}
      style={{ width: size * 0.78, height: size * 0.78 }}
    />
  </div>
);

/** Icon + "Sangu" side by side. `p` 0..1 drives the reveal. */
export const Lockup: React.FC<{ p: number; size?: number }> = ({
  p,
  size = 150,
}) => {
  const icon = interpolate(p, [0, 0.55], [0, 1], { ...clamp, easing: slow });
  const word = interpolate(p, [0.3, 1], [0, 1], { ...clamp, easing: slow });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.26 }}>
      <AppIcon
        size={size}
        style={{
          opacity: icon,
          scale: String(0.86 + 0.14 * icon),
          filter: icon < 1 ? `blur(${(1 - icon) * 18}px)` : undefined,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: size * 0.92,
          fontWeight: 700,
          letterSpacing: -size * 0.035,
          color: INK,
          textShadow: GLOW.white,
          opacity: word,
          filter: word < 1 ? `blur(${(1 - word) * 16}px)` : undefined,
          translate: `${(1 - word) * -40}px 0px`,
          lineHeight: 1,
          paddingBottom: size * 0.06,
        }}
      >
        Sangu
      </div>
    </div>
  );
};

/** Phone screen with a thin rim light for the dark stage. */
export const DarkScreen: React.FC<{
  children: React.ReactNode;
  glow?: number;
}> = ({ children, glow = 1 }) => (
  <div
    style={{
      width: SCREEN_W + 12,
      height: SCREEN_H + 12,
      padding: 6,
      borderRadius: 60,
      background:
        "linear-gradient(160deg, #4B5157 0%, #1A1D20 30%, #0E1012 70%, #2C3136 100%)",
      boxShadow: `0 0 0 1px rgba(255,255,255,0.08), 0 50px 120px rgba(0,0,0,0.7), 0 0 ${140 * glow}px rgba(52,211,153,${0.14 * glow})`,
    }}
  >
    <div
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        borderRadius: 54,
        overflow: "hidden",
        position: "relative",
        background: C.bg,
        fontFamily: FONT,
        color: C.text,
      }}
    >
      <StatusBar />
      {children}
    </div>
  </div>
);
