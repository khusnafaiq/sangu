import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Cursor, LightBg, Screen, TypeText } from "../ui";
import { OnboardingScreen } from "../screens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0:23 — first-run screen (no login, data stays on the phone); phone left, text right.
export const F8Privacy: React.FC = () => {
  const frame = useCurrentFrame();
  const name = "Rani".slice(0, Math.floor(interpolate(frame, [30, 46], [0, 4], clamp)));
  return (
    <AbsoluteFill>
      <LightBg peach={1.2} />
      <Interactive.Div
        name="Phone"
        style={{
          position: "absolute",
          left: 330,
          top: 64,
          transformOrigin: "0% 0%",
          scale: "1.12",
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          translate: interpolate(frame, [0, 28, 102], ["-200px 30px", "0px 0px", "0px -20px"], { ...clamp, easing: [Easing.bezier(0.16, 1, 0.3, 1), Easing.linear] }),
          filter: `blur(${interpolate(frame, [0, 14], [16, 0], clamp)}px)`,
        }}
      >
        <Screen>
          <OnboardingScreen name={name} caret={frame >= 26 && frame < 76 && Math.floor(frame / 8) % 2 === 0} />
          <Cursor
            x={interpolate(frame, [56, 74], [300, 196], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) })}
            y={interpolate(frame, [56, 74], [520, 793], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) })}
            press={interpolate(frame, [76, 86], [0, 1], clamp)}
            opacity={interpolate(frame, [52, 58, 92, 100], [0, 1, 1, 0], clamp)}
            size={26}
          />
        </Screen>
      </Interactive.Div>
      <TypeText
        segs={[{ text: "Tanpa login.", bold: true }, { text: "Tanpa akun.", bold: true, br: true }, { text: "Datamu tetap", br: true }, { text: "di HP kamu.", br: true }]}
        start={10}
        cps={0.9}
        style={{ position: "absolute", left: 1010, top: 290, fontSize: 84, fontWeight: 500, letterSpacing: -2.2, lineHeight: 1.2 }}
      />
    </AbsoluteFill>
  );
};
