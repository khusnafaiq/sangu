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

// "Night" cut: near-black stage lit by a soft SaaS-style background glow, crisp type,
// slow blur reveals, match cuts.

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
export const slow = Easing.bezier(0.22, 1, 0.36, 1);
export const glide = Easing.bezier(0.65, 0, 0.35, 1);

export const INK = "#F2F5F3";
// Type stays crisp (no text glow); the light lives in the background instead.
export const GLOW = {
  white: "none",
  red: "none",
  green: "none",
  soft: "none",
} as const;

/**
 * Premium dark stage: a soft aurora glow (emerald, teal, a touch of indigo) rising from the bottom
 * edge of the frame, a faint grid that fades out above it, and a vignette.
 * `x` (in %) slides the glow under the subject.
 */
export const NightBg: React.FC<{ light?: number; x?: number }> = ({
  light = 1,
  x = 50,
}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const cx = (x / 100) * 1920;
  const blob = (
    w: number,
    h: number,
    dx: number,
    dy: number,
    color: string,
    o: number,
    phase: number,
    blur = 130,
  ): React.CSSProperties => ({
    position: "absolute",
    width: w,
    height: h,
    left: cx - w / 2 + dx + Math.sin(t * 0.3 + phase) * 60,
    top: 1080 - h / 2 + dy + Math.cos(t * 0.25 + phase) * 20,
    borderRadius: "50%",
    background: color,
    filter: `blur(${blur}px)`,
    opacity: o * light,
  });
  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          backgroundPosition: `${cx % 96}px 0px`,
          maskImage: `radial-gradient(ellipse 48% 62% at ${x}% 100%, rgba(0,0,0,${0.9 * light}), transparent 80%)`,
          WebkitMaskImage: `radial-gradient(ellipse 48% 62% at ${x}% 100%, rgba(0,0,0,${0.9 * light}), transparent 80%)`,
        }}
      />
      <div style={blob(1600, 640, 0, 150, "#10B981", 0.55, 0)} />
      <div style={blob(1000, 460, 380, 140, "#0EA5E9", 0.34, 2)} />
      <div style={blob(900, 420, -420, 150, "#6366F1", 0.22, 4)} />
      <div style={blob(1000, 200, 0, 70, "#6EE7B7", 0.32, 1, 80)} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(5,6,7,0.65) 0%, rgba(5,6,7,0) 45%), radial-gradient(ellipse 80% 80% at 50% 60%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)",
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
      boxShadow: `0 ${size * 0.12}px ${size * 0.4}px rgba(0,0,0,0.55)`,
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
