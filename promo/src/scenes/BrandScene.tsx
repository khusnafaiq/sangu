import React from "react";
import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT } from "../theme";

const WORD = "Sangu";

// 4–7s: brand reveal on the music drop.
export const BrandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 14) * 10;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text, alignItems: "center", justifyContent: "center" }}>
      <Audio name="Whoosh" src={staticFile("audio/sfx-whoosh.wav")} volume={0.56} />
      <Audio name="Shimmer" src={staticFile("audio/sfx-shimmer.wav")} from={6} volume={0.48} />

      <Interactive.Div
        name="Glow"
        style={{
          position: "absolute",
          width: 1100,
          height: 1100,
          borderRadius: 550,
          background: "radial-gradient(circle, rgba(52,211,153,0.35) 0%, rgba(52,211,153,0.08) 40%, rgba(52,211,153,0) 70%)",
          top: 260,
          opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [0, 40], [0.5, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -80 }}>
        <Img
          name="Logo mark"
          src={staticFile("brand/logo-mark-512.png")}
          style={{
            width: 420,
            height: 420,
            filter: `blur(${interpolate(frame, [0, 18], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px) drop-shadow(0 30px 60px rgba(52,211,153,0.35))`,
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: interpolate(frame, [0, 26], [0.45, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
            rotate: interpolate(frame, [0, 30], ["-35deg", "0deg"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            translate: `0px ${float}px`,
          }}
        />

        <Interactive.Div
          name="Wordmark"
          style={{ display: "flex", fontSize: 196, fontWeight: 800, letterSpacing: -9, lineHeight: 1, marginTop: 40 }}
        >
          {WORD.split("").map((ch, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: interpolate(frame, [12 + i * 3, 20 + i * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                translate: `0px ${interpolate(frame, [12 + i * 3, 28 + i * 3], [70, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
              }}
            >
              {ch}
            </span>
          ))}
        </Interactive.Div>

        <Interactive.Div
          name="Tagline"
          style={{
            marginTop: 34,
            fontSize: 60,
            fontWeight: 600,
            letterSpacing: -1.5,
            lineHeight: 1.2,
            color: C.green,
            textAlign: "center",
            opacity: interpolate(frame, [32, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [32, 50], ["0px 30px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Sangu hari ini,
          <br />
          tenang sampai gajian.
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
