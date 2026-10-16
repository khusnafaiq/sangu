import React from "react";
import {
  AbsoluteFill,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Audio } from "@remotion/media";
import { FONT } from "../../theme";
import { GLOW, GlowLine, INK, NightBg, clamp, veil } from "../kit";

const SIZE = 112;

// Text only. "Tanpa" stays, the word after it changes; then one calm line that lands with a
// heartbeat (two pulses of the line, the background light and a ring). 190 frames.
export const N6Privacy: React.FC = () => {
  const frame = useCurrentFrame();
  const beat = Math.max(
    interpolate(frame, [138, 141, 156], [0, 1, 0], clamp),
    interpolate(frame, [150, 153, 170], [0, 0.7, 0], clamp),
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
      <Audio
        name="Heartbeat"
        src={staticFile("audio/sfx-pulse.wav")}
        from={136}
        volume={0.9}
      />
      {ring(138, 1)}
      {ring(150, 0.7)}
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
      <div
        style={{
          position: "absolute",
          inset: 0,
          scale: String(1 + 0.06 * beat),
        }}
      >
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
      </div>
    </AbsoluteFill>
  );
};
