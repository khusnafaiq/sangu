import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Lockup, NightBg, clamp, slow, useT } from "../kit";

// On the music drop: icon with "Sangu" beside it, soft green bloom; the wordmark lands on
// "Kenalin, Sangu." 75 frames.
export const N2Logo: React.FC = () => {
  const frame = useT();
  const p = interpolate(frame, [6, 46], [0, 1], { ...clamp, easing: slow });
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
            opacity: interpolate(frame, [0, 30], [0, 1], clamp),
          }}
        />
        <div
          style={{
            scale: String(interpolate(frame, [0, 75], [0.96, 1.02], clamp)),
          }}
        >
          <Lockup p={p} size={150} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
