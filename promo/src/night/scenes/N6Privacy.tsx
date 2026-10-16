import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT } from "../../theme";
import { GLOW, GlowLine, INK, NightBg, clamp, useT, veil } from "../kit";

const SIZE = 112;

// Text only, on the voice-over. "Tanpa" stays, the word after it changes; then one calm line that
// lands with a heartbeat (two pulses of the line, the background light and a ring) right after
// "… HP kamu." The thumps are sfx-pulse in timeline.ts. 135 frames.
export const N6Privacy: React.FC = () => {
  const frame = useT();
  const beat = Math.max(
    interpolate(frame, [112, 115, 130], [0, 1, 0], clamp),
    interpolate(frame, [124, 127, 144], [0, 0.7, 0], clamp),
  );
  const ring = (at: number, peak: number) => {
    const p = interpolate(frame, [at, at + 26], [0, 1], clamp);
    return (
      <div
        style={{
          position: "absolute",
          left: 960 - (240 + 700 * p),
          top: 528 - (240 + 700 * p) * 0.45,
          width: 2 * (240 + 700 * p),
          height: 2 * (240 + 700 * p) * 0.45,
          borderRadius: "50%",
          border: "14px solid rgba(110,231,183,1)",
          opacity: frame >= at ? peak * (1 - p) * 0.22 : 0,
          filter: "blur(14px)",
        }}
      />
    );
  };
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
      <NightBg light={0.8 + 1.6 * beat} />
      {ring(112, 1)}
      {ring(124, 0.7)}
      <div style={{ position: "absolute", left: 600, top: 470, ...base }}>
        <span
          style={{
            display: "inline-block",
            fontWeight: 700,
            ...veil(frame, 4, 60, 16, 12, 8),
          }}
        >
          Tanpa
        </span>
        <span
          style={{
            position: "absolute",
            left: "100%",
            top: 0,
            ...veil(frame, 14, 34, 16, 10, 8),
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
            ...veil(frame, 42, 60, 16, 12, 8),
          }}
        >
          {" "}
          akun.
        </span>
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          scale: String(1 + 0.06 * beat),
        }}
      >
        <GlowLine
          words={[
            { t: "Datamu", at: 66 },
            { t: " cuma", at: 87 },
            { t: " di", at: 94 },
            { t: " HP", at: 97 },
            { t: " kamu.", at: 104 },
          ]}
          at={66}
          inDur={14}
          size={96}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 480,
            textAlign: "center",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
