import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Lockup, NightBg, clamp, slow } from "../kit";

// 0:07 — icon with "Sangu" beside it, soft green bloom.
export const N2Logo: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 52], [0, 1], { ...clamp, easing: slow });
  return (
    <AbsoluteFill>
      <NightBg />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            position: "absolute",
            width: 1100,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(52,211,153,0.22), rgba(52,211,153,0) 65%)",
            opacity: interpolate(frame, [0, 40], [0, 1], clamp),
          }}
        />
        <div
          style={{
            scale: String(interpolate(frame, [0, 90], [0.97, 1.02], clamp)),
          }}
        >
          <Lockup p={p} size={150} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
