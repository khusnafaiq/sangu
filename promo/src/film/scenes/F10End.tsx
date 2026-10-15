import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FONT } from "../../theme";
import { L, LightBg, TypeText } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0:30 — end line typed out, then app icon + link.
export const F10End: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <LightBg drift={0.6} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <TypeText
          segs={[{ text: "Sangu", bold: true }, { text: " hari ini, tenang sampai gajian." }]}
          start={6}
          cps={0.9}
          style={{ fontSize: 76, fontWeight: 500, letterSpacing: -1.8, marginTop: -60 }}
        />
        <div
          style={{
            position: "absolute",
            top: 640,
            display: "flex",
            alignItems: "center",
            gap: 20,
            opacity: interpolate(frame, [50, 64], [0, 1], clamp),
            translate: `0px ${interpolate(frame, [50, 70], [20, 0], clamp)}px`,
          }}
        >
          <div style={{ width: 76, height: 76, borderRadius: 20, background: "#fff", boxShadow: "0 8px 24px rgba(40,70,80,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img src={staticFile("brand/logo-mark-512.png")} style={{ width: 58, height: 58 }} />
          </div>
          <span style={{ fontSize: 40, fontWeight: 600, color: L.ink2, letterSpacing: -0.5 }}>khusnafaiq.github.io/sangu</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
