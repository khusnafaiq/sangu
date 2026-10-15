import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { HomeScreen } from "../../components/AppUI";
import { LightBg, Screen, TypeText } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0:06 — phone right, tagline typed on the left.
export const F3Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <LightBg />
      <TypeText
        segs={[{ text: "Sangu hari ini,", bold: true }, { text: "tenang sampai", br: true }, { text: "gajian.", br: true }]}
        start={16}
        cps={0.75}
        style={{ position: "absolute", left: 200, top: 340, fontSize: 92, fontWeight: 500, letterSpacing: -2.5, lineHeight: 1.18 }}
      />
      <Interactive.Div
        name="Phone"
        style={{
          position: "absolute",
          left: 1110,
          top: 110,
          transformOrigin: "0% 0%",
          scale: "1.27",
          opacity: interpolate(frame, [0, 14], [0, 1], clamp),
          translate: interpolate(frame, [0, 30, 120], ["220px 40px", "0px 0px", "0px -26px"], { ...clamp, easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear] }),
          filter: `blur(${interpolate(frame, [0, 16], [16, 0], clamp)}px)`,
        }}
      >
        <Screen>
          <HomeScreen safeToday={316350} ring={0} />
        </Screen>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
