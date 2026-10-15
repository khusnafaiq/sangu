import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT } from "../../theme";
import { GLOW, GlowLine, INK, NightBg, veil } from "../kit";

const SIZE = 112;

// 0:26 — text only. "Tanpa" stays, the word after it changes; then one calm line.
export const N6Privacy: React.FC = () => {
  const frame = useCurrentFrame();
  const base: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: SIZE,
    fontWeight: 500,
    letterSpacing: -SIZE * 0.03,
    color: INK,
    textShadow: GLOW.white,
    lineHeight: 1,
    whiteSpace: "pre",
  };
  return (
    <AbsoluteFill>
      <NightBg light={0.8} />
      <div style={{ position: "absolute", left: 600, top: 470, ...base }}>
        <span
          style={{
            display: "inline-block",
            fontWeight: 700,
            ...veil(frame, 6, 92, 24, 16, 8),
          }}
        >
          Tanpa
        </span>
        <span
          style={{
            position: "absolute",
            left: "100%",
            top: 0,
            ...veil(frame, 14, 52, 24, 16, 8),
          }}
        >
          {" "}
          login.
        </span>
        <span
          style={{
            position: "absolute",
            left: "100%",
            top: 0,
            color: "#9FE9C8",
            textShadow: GLOW.green,
            ...veil(frame, 60, 92, 24, 16, 8),
          }}
        >
          {" "}
          akun.
        </span>
      </div>
      <GlowLine
        words={[
          { t: "Datamu" },
          { t: " cuma" },
          { t: " di" },
          { t: " HP" },
          { t: " kamu." },
        ]}
        at={96}
        stagger={5}
        size={96}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />
    </AbsoluteFill>
  );
};
