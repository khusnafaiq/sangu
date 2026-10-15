import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../theme";
import { CatatScreen, HomeScreen } from "../../components/AppUI";
import { Cursor, L, LightBg, Screen, TypeText } from "../ui";
import { RecapScreen, WalletScreen } from "../screens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SPLIT = 54; // tilted hero → upright phone with single words

const WORDS = [
  { word: "Cepat.", from: SPLIT, to: SPLIT + 26 },
  { word: "Rapi.", from: SPLIT + 26, to: SPLIT + 52 },
  { word: "Tenang.", from: SPLIT + 52, to: 999 },
];

// 0:26 — "Ini cara baru ngatur uang." over a tilted phone, then Cepat. / Rapi. / Tenang.
export const F9Words: React.FC = () => {
  const frame = useCurrentFrame();
  const upright = interpolate(frame, [SPLIT - 6, SPLIT + 14], [0, 1], { ...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1) });
  const screenIdx = frame < SPLIT ? -1 : WORDS.findIndex((w) => frame >= w.from && frame < w.to);

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <LightBg />
      <TypeText
        segs={[{ text: "Ini cara baru " }, { text: "ngatur uang.", bold: true }]}
        start={4}
        cps={1}
        style={{
          position: "absolute",
          top: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 66,
          fontWeight: 500,
          letterSpacing: -1.5,
          opacity: interpolate(frame, [SPLIT - 10, SPLIT], [1, 0], clamp),
          filter: `blur(${interpolate(frame, [SPLIT - 10, SPLIT], [0, 14], clamp)}px)`,
        }}
      />

      <AbsoluteFill style={{ perspective: 2400 }}>
        <div
          style={{
            position: "absolute",
            left: interpolate(upright, [0, 1], [780, 470]),
            top: interpolate(upright, [0, 1], [330, 80]),
            transformOrigin: "50% 50%",
            transform: `rotateX(${interpolate(upright, [0, 1], [52, 0])}deg) rotateZ(${interpolate(upright, [0, 1], [-34, 0])}deg) scale(${interpolate(upright, [0, 1], [1.35, 1.08])}) translateX(${interpolate(frame, [0, SPLIT], [120, 0], clamp) * (1 - upright)}px)`,
          }}
        >
          <Screen>
            {screenIdx <= 0 ? (
              frame < SPLIT ? (
                <WalletScreen />
              ) : (
                <CatatScreen transcript={<span style={{ color: "#8A8A94" }}>Kopi 28rb pakai BCA</span>} listening={0} frame={frame} />
              )
            ) : screenIdx === 1 ? (
              <RecapScreen />
            ) : (
              <HomeScreen safeToday={316350} ring={interpolate(frame, [SPLIT + 56, SPLIT + 66], [0, 1], clamp)} />
            )}
            {screenIdx === 0 ? (
              <Cursor
                x={interpolate(frame, [SPLIT + 4, SPLIT + 14], [260, 318], clamp)}
                y={interpolate(frame, [SPLIT + 4, SPLIT + 14], [560, 710], clamp)}
                press={interpolate(frame, [SPLIT + 15, SPLIT + 24], [0, 1], clamp)}
                opacity={interpolate(frame, [SPLIT + 2, SPLIT + 6], [0, 1], clamp)}
                size={26}
              />
            ) : null}
          </Screen>
        </div>
      </AbsoluteFill>

      {WORDS.map((w) => (
        <div
          key={w.word}
          style={{
            position: "absolute",
            left: 1120,
            top: 440,
            fontSize: 130,
            fontWeight: 700,
            letterSpacing: -4,
            color: L.ink,
            opacity: interpolate(frame, [w.from, w.from + 6, w.to - 4, w.to], [0, 1, 1, 0], clamp),
            filter: `blur(${interpolate(frame, [w.from, w.from + 6, w.to - 4, w.to], [14, 0, 0, 14], clamp)}px)`,
            translate: `${interpolate(frame, [w.from, w.from + 14], [30, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) })}px 0px`,
          }}
        >
          {w.word}
        </div>
      ))}
    </AbsoluteFill>
  );
};
