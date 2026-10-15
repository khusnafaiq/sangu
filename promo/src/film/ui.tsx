import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { SCREEN_H, SCREEN_W, StatusBar } from "../components/Phone";

// Light, airy palette for the film (the app itself stays dark).
export const L = {
  ink: "#17181C",
  ink2: "#5B606B",
  ink3: "#9AA0AA",
  glass: "rgba(255,255,255,0.46)",
  glassBorder: "rgba(255,255,255,0.85)",
  mint: "#7BE3BC",
  sky: "#A9CDF6",
  peach: "#F9C7A8",
  accent: "#10B981",
} as const;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Soft white/mint gradient with drifting colour blobs (the reference's lavender/peach look, in Sangu green). */
export const LightBg: React.FC<{ peach?: number; drift?: number }> = ({ peach = 1, drift = 1 }) => {
  const frame = useCurrentFrame();
  const t = (frame / 30) * drift;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #F7F9F8 0%, #EEF3F2 55%, #E9EFF2 100%)", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 900,
          left: -380 + Math.sin(t * 0.4) * 60,
          bottom: -520 + Math.cos(t * 0.3) * 40,
          borderRadius: "50%",
          background: L.sky,
          filter: "blur(140px)",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1100,
          height: 800,
          left: 420 + Math.cos(t * 0.35) * 70,
          top: -420 + Math.sin(t * 0.3) * 40,
          borderRadius: "50%",
          background: L.mint,
          filter: "blur(150px)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 700,
          right: -260 + Math.sin(t * 0.45) * 50,
          bottom: -380 + Math.cos(t * 0.4) * 50,
          borderRadius: "50%",
          background: L.peach,
          filter: "blur(130px)",
          opacity: 0.8 * peach,
        }}
      />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 60% 55% at 50% 45%, rgba(255,255,255,0.75), rgba(255,255,255,0) 70%)" }} />
    </AbsoluteFill>
  );
};

/** Near-black stage with a green/teal tint for the "night" interludes. */
export const DarkBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: "radial-gradient(ellipse 80% 70% at 30% 20%, #0E2A22 0%, #07110E 45%, #040506 100%)",
    }}
  />
);

/** Frosted glass tile. */
export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; dark?: boolean }> = ({ style, children, dark }) => (
  <div
    style={{
      borderRadius: 30,
      background: dark ? "rgba(18,18,21,0.72)" : L.glass,
      border: `2px solid ${dark ? "rgba(255,255,255,0.10)" : L.glassBorder}`,
      boxShadow: dark ? "0 30px 70px rgba(10,20,30,0.25)" : "0 24px 60px rgba(60,80,90,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
      backdropFilter: "blur(18px)",
      color: dark ? C.text : L.ink,
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);

export type Seg = { text: string; bold?: boolean; color?: string; br?: boolean };

/**
 * Typewriter with a coloured, slightly blurred leading edge that settles into ink
 * (the reference's signature text reveal).
 */
export const TypeText: React.FC<{
  segs: Seg[];
  start: number;
  cps?: number; // characters per frame
  style?: React.CSSProperties;
  ink?: string;
  lead?: string;
}> = ({ segs, start, cps = 1, style, ink = L.ink, lead = L.accent }) => {
  const frame = useCurrentFrame();
  const typed = (frame - start) * cps;
  let i = 0;
  return (
    <div style={{ fontFamily: FONT, ...style }}>
      {segs.map((s, k) => (
        <React.Fragment key={k}>
          {s.br ? <br /> : null}
          <span style={{ fontWeight: s.bold ? 700 : undefined }}>
            {s.text.split("").map((ch, j) => {
              const age = typed - i++;
              if (age < 0) {
                return (
                  <span key={j} style={{ opacity: 0 }}>
                    {ch}
                  </span>
                );
              }
              const settle = interpolate(age, [0, 7], [0, 1], clamp);
              return (
                <span
                  key={j}
                  style={{
                    color: settle >= 1 ? s.color ?? ink : mix(lead, s.color ?? ink, settle),
                    opacity: interpolate(age, [0, 1.5], [0.25, 1], clamp),
                    filter: age < 2.5 ? `blur(${interpolate(age, [0, 2.5], [5, 0], clamp)}px)` : undefined,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};

const hex = (h: string) => [1, 3, 5].map((o) => parseInt(h.slice(o, o + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
};

/** White tap cursor (dot with soft shadow); `press` 0..1 squashes it and emits a ripple. */
export const Cursor: React.FC<{ x: number; y: number; press?: number; opacity?: number; size?: number }> = ({ x, y, press = 0, opacity = 1, size = 34 }) => (
  <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, opacity, pointerEvents: "none", zIndex: 50 }}>
    <div
      style={{
        position: "absolute",
        inset: -size * 0.9 * press,
        borderRadius: "50%",
        border: `3px solid rgba(255,255,255,${0.7 * (1 - press)})`,
        opacity: press > 0 ? 1 : 0,
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: "#fff",
        scale: String(1 - 0.22 * Math.sin(Math.PI * press)),
        boxShadow: "0 6px 18px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    />
  </div>
);

/** Frameless phone screen (rounded glass edge), like the reference's floating devices. */
export const Screen: React.FC<{ children: React.ReactNode; edge?: string; shadow?: boolean }> = ({ children, edge = "rgba(255,255,255,0.9)", shadow = true }) => (
  <div
    style={{
      width: SCREEN_W + 12,
      height: SCREEN_H + 12,
      padding: 6,
      borderRadius: 60,
      background: edge,
      boxShadow: shadow ? "0 40px 90px rgba(30,50,60,0.22), 0 8px 24px rgba(30,50,60,0.12)" : "none",
    }}
  >
    <div style={{ width: SCREEN_W, height: SCREEN_H, borderRadius: 54, overflow: "hidden", position: "relative", background: C.bg, fontFamily: FONT, color: C.text }}>
      <StatusBar />
      {children}
    </div>
  </div>
);

/** Glossy neon ribbons for the dark hero shot. `t` is a 0..1 sweep. */
export const NeonRibbons: React.FC<{ t: number }> = ({ t }) => {
  const paths = [
    { d: "M -200 1250 C 300 900, 520 520, 760 300 S 1250 -40, 1500 -200", w: 46, c1: "#34D399", c2: "#0EA5E9", o: 0 },
    { d: "M 2100 1150 C 1700 980, 1500 760, 1380 560 S 1180 120, 1260 -220", w: 30, c1: "#38BDF8", c2: "#6366F1", o: 0.3 },
    { d: "M 2150 250 C 1880 360, 1700 520, 1640 760 S 1700 1150, 1900 1300", w: 18, c1: "#FB923C", c2: "#F472B6", o: 0.55 },
  ];
  return (
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
      <defs>
        {paths.map((p, i) => (
          <linearGradient key={i} id={`rib${i}`} x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor={p.c1} stopOpacity="0" />
            <stop offset="0.35" stopColor={p.c1} />
            <stop offset="0.7" stopColor={p.c2} />
            <stop offset="1" stopColor={p.c2} stopOpacity="0" />
          </linearGradient>
        ))}
        <filter id="ribGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>
      {paths.map((p, i) => {
        const dash = 2600;
        const off = dash - interpolate(t, [p.o * 0.6, p.o * 0.6 + 0.55], [0, dash * 1.0], clamp);
        return (
          <g key={i}>
            <path d={p.d} fill="none" stroke={`url(#rib${i})`} strokeWidth={p.w * 2.2} strokeLinecap="round" filter="url(#ribGlow)" opacity={0.7} strokeDasharray={dash} strokeDashoffset={off} />
            <path d={p.d} fill="none" stroke={`url(#rib${i})`} strokeWidth={p.w} strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={off} />
            <path d={p.d} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth={Math.max(2, p.w * 0.12)} strokeLinecap="round" strokeDasharray={dash} strokeDashoffset={off} />
          </g>
        );
      })}
    </svg>
  );
};

/** Blur+fade in at the start of a scene and out at the end (the reference's soft cuts). */
export const useSoftCut = (dur: number, inF = 12, outF = 12) => {
  const frame = useCurrentFrame();
  const vIn = interpolate(frame, [0, inF], [0, 1], clamp);
  const vOut = interpolate(frame, [dur - outF, dur], [1, 0], clamp);
  const v = Math.min(vIn, vOut);
  return { opacity: v, filter: v < 1 ? `blur(${(1 - v) * 18}px)` : undefined };
};
