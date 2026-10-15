import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../theme";
import { GLOW, INK, NightBg, clamp, glide, veil } from "../kit";

const SIZE = 100;

/** A centred anchor word with words hanging off its left and right edges (so the anchor never moves). */
const Anchored: React.FC<{
  x: number;
  anchor: React.ReactNode;
  left?: string;
  right?: string;
  anchorStyle: React.CSSProperties;
  sideStyle: React.CSSProperties;
}> = ({ x, anchor, left, right, anchorStyle, sideStyle }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: 476,
      translate: "-50% 0px",
      whiteSpace: "pre",
    }}
  >
    <span style={{ display: "inline-block", ...anchorStyle }}>{anchor}</span>
    {left ? (
      <span
        style={{ position: "absolute", right: "100%", top: 0, ...sideStyle }}
      >
        {left}
      </span>
    ) : null}
    {right ? (
      <span
        style={{ position: "absolute", left: "100%", top: 0, ...sideStyle }}
      >
        {right}
      </span>
    ) : null}
  </div>
);

// 0:00 — "Rp 87.000" → "Saldo tinggal Rp 87.000." → "Gajian masih 10 hari lagi." → "Kenal rasanya?"
// The number slot stays put while the words around it change (typographic match cut);
// it eases right once so both sentences sit inside the frame.
export const N1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 210], [1, 1.035], clamp);
  const base: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: SIZE,
    fontWeight: 500,
    letterSpacing: -SIZE * 0.03,
    color: INK,
    lineHeight: 1,
  };

  return (
    <AbsoluteFill>
      <NightBg light={0.7} />
      <AbsoluteFill style={{ scale: String(drift) }}>
        {/* beat 1–2: the balance */}
        <Anchored
          x={interpolate(frame, [40, 74], [960, 1120], {
            ...clamp,
            easing: glide,
          })}
          anchor="Rp 87.000"
          left="Saldo tinggal "
          right="."
          anchorStyle={{
            ...base,
            fontWeight: 700,
            color: "#FF9BAE",
            textShadow: GLOW.red,
            ...veil(frame, 4, 100, 26, 18, 0),
          }}
          sideStyle={{
            ...base,
            textShadow: GLOW.white,
            ...veil(frame, 44, 96, 24, 16, 8),
          }}
        />
        {/* beat 3: same slot, now the days left */}
        <Anchored
          x={1120}
          anchor="10 hari"
          left="Gajian masih "
          right=" lagi."
          anchorStyle={{
            ...base,
            fontWeight: 700,
            color: "#FFE3A3",
            textShadow:
              "0 0 14px rgba(251,191,36,0.7), 0 0 64px rgba(251,191,36,0.4)",
            ...veil(frame, 104, 152, 24, 16, 0),
          }}
          sideStyle={{
            ...base,
            textShadow: GLOW.white,
            ...veil(frame, 110, 150, 24, 16, 8),
          }}
        />
        {/* beat 4: the question */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 488,
            textAlign: "center",
            ...base,
            fontSize: 84,
            color: "#DDE3E0",
            textShadow: GLOW.soft,
            ...veil(frame, 162, 194, 28, 16, 10),
          }}
        >
          Kenal rasanya?
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
