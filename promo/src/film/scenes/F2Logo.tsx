import React from "react";
import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../theme";
import { L, LightBg } from "../ui";
import { TilesLayer } from "./F1Opening";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0:04 — app-icon card reveal (white card, green mark), like the reference's logo beat.
export const F2Logo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <LightBg />
      <AbsoluteFill style={{ opacity: 0.55 }}>
        <TilesLayer blur={16} push={0.08} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Interactive.Div
          name="Icon card"
          style={{
            width: 600,
            height: 640,
            borderRadius: 140,
            background: "linear-gradient(180deg, #FFFFFF 0%, #F8FBFA 100%)",
            boxShadow: "0 50px 120px rgba(40,70,80,0.18), 0 0 0 2px rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
            opacity: interpolate(frame, [0, 14], [0, 1], clamp),
            scale: interpolate(frame, [0, 28], [0.82, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
            filter: `blur(${interpolate(frame, [0, 18], [24, 0], clamp)}px)`,
          }}
        >
          <Img
            name="Mark"
            src={staticFile("brand/logo-mark-512.png")}
            style={{
              width: 330,
              height: 330,
              scale: interpolate(frame, [8, 30], [0.7, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
              rotate: interpolate(frame, [8, 34], ["-14deg", "0deg"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
            }}
          />
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              letterSpacing: 14,
              color: L.ink,
              opacity: interpolate(frame, [20, 32], [0, 1], clamp),
              translate: `0px ${interpolate(frame, [20, 38], [20, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
            }}
          >
            SANGU
          </div>
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
