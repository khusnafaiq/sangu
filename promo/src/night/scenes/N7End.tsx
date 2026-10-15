import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GlowLine, Lockup, NightBg, clamp, slow } from "../kit";

// 0:31 — "Tenang sampai gajian." dissolves into the icon + Sangu lockup on the same centre.
export const N7End: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <NightBg />
      <GlowLine
        words={[{ t: "Tenang" }, { t: " sampai" }, { t: " gajian." }]}
        at={6}
        out={56}
        stagger={7}
        size={104}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 476,
          textAlign: "center",
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 1100,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(52,211,153,0.2), rgba(52,211,153,0) 65%)",
            opacity: interpolate(frame, [60, 100], [0, 1], clamp),
          }}
        />
        <Lockup
          p={interpolate(frame, [62, 108], [0, 1], { ...clamp, easing: slow })}
          size={150}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
