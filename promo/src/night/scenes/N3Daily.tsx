import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { FONT } from "../../theme";
import { HomeScreen } from "../../components/AppUI";
import {
  DarkScreen,
  GLOW,
  GlowLine,
  NightBg,
  clamp,
  glide,
  useT,
  veil,
} from "../kit";

// Where "Rp 316.350" sits inside the phone (DarkScreen-local px) and its size there.
const PIN = { x: 130, y: 178 };
const APP_SIZE = 42;
const BIG = 100;

// The calm number as text only, then a pinned pull back into the app; the titles land with
// "… tiap hari." in the voice-over. 165 frames, played at 120.
export const N3Daily: React.FC = () => {
  const frame = useT();
  const z = interpolate(frame, [52, 108], [0, 1], { ...clamp, easing: glide });
  const s = interpolate(z, [0, 1], [BIG / APP_SIZE, 1.55]);
  const px = interpolate(z, [0, 1], [960, 1150]);
  const py = interpolate(z, [0, 1], [526, 610]);

  return (
    <AbsoluteFill>
      <NightBg x={interpolate(z, [0, 1], [50, 66])} />
      {/* the phone, pinned on the number while it pulls back */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${px - PIN.x * s}px, ${py - PIN.y * s}px) scale(${s})`,
          opacity: interpolate(frame, [46, 60], [0, 1], clamp),
        }}
      >
        <DarkScreen glow={z}>
          <HomeScreen
            safeToday={316350}
            ring={interpolate(frame, [116, 130], [0, 1], clamp)}
          />
        </DarkScreen>
      </div>

      {/* text-only beat */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 380,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: 40,
          color: "#A7B0AC",
          ...veil(frame, 14, 48, 24, 12, 8),
        }}
      >
        aman dipakai hari ini
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 476,
          translate: "-50% 0px",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: BIG,
            fontWeight: 700,
            letterSpacing: -BIG * 0.03,
            lineHeight: 1,
            color: "#C9F7E3",
            textShadow: GLOW.green,
            whiteSpace: "pre",
            ...veil(frame, 2, 52, 26, 12, 0),
          }}
        >
          Rp 316.350
        </div>
      </div>

      <GlowLine
        words={[{ t: "Jatah aman," }]}
        at={100}
        size={96}
        style={{ position: "absolute", left: 230, top: 400 }}
      />
      <GlowLine
        words={[{ t: "tiap hari." }]}
        at={112}
        size={96}
        style={{ position: "absolute", left: 230, top: 512, color: "#9FE9C8" }}
      />
    </AbsoluteFill>
  );
};
