import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { GlowLine, Lockup, NightBg, clamp, slow, useT } from "../kit";

// "Tenang sampai gajian." dissolves into the icon + Sangu lockup on the same centre, on the final
// chord; the voice-over says "Sangu." as the wordmark appears. 120 frames.
export const N7End: React.FC = () => {
  const frame = useT();
  return (
    <AbsoluteFill>
      <NightBg />
      <GlowLine
        words={[
          { t: "Tenang", at: 6 },
          { t: " sampai", at: 17 },
          { t: " gajian.", at: 29 },
        ]}
        at={6}
        out={44}
        inDur={16}
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
            opacity: interpolate(frame, [45, 75], [0, 1], clamp),
          }}
        />
        <Lockup
          p={interpolate(frame, [45, 81], [0, 1], { ...clamp, easing: slow })}
          size={150}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
