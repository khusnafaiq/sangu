import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { CatatScreen, HomeScreen } from "../../components/AppUI";
import { DarkBg, Screen } from "../ui";
import { OnboardingScreen, RecapScreen, WalletScreen } from "../screens";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const pick = (i: number, frame: number) => {
  switch (i % 5) {
    case 0:
      return <HomeScreen safeToday={316350} ring={0} />;
    case 1:
      return <CatatScreen transcript={<span style={{ color: "#8A8A94" }}>Kopi 28rb pakai BCA</span>} listening={0} frame={frame} />;
    case 2:
      return <RecapScreen />;
    case 3:
      return <WalletScreen />;
    default:
      return <OnboardingScreen name="Rani" />;
  }
};

// 0:10 — a tilted wall of Sangu screens sliding past on a dark stage.
export const F4Wall: React.FC = () => {
  const frame = useCurrentFrame();
  const cols = 6;
  const rows = 3;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <DarkBg />
      <AbsoluteFill style={{ perspective: 2400, alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 405px)`,
            gap: 70,
            transform: `rotateX(32deg) rotateZ(-24deg) translate(${interpolate(frame, [0, 96], [160, -180], clamp)}px, ${interpolate(frame, [0, 96], [120, -60], clamp)}px)`,
            transformStyle: "preserve-3d",
          }}
        >
          {Array.from({ length: cols * rows }).map((_, i) => (
            <div key={i} style={{ translate: `0px ${(i % cols) % 2 ? 230 : 0}px` }}>
              <Screen edge="rgba(255,255,255,0.14)" shadow={false}>
                {pick(i + Math.floor(i / cols) * 2, frame)}
              </Screen>
            </div>
          ))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(4,5,6,0) 45%, rgba(4,5,6,0.85) 100%)" }} />
    </AbsoluteFill>
  );
};
