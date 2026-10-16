import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RecapScreen } from "../../film/screens";
import { NotifCatat, PHONE_MID, SAVE_PIN, pinned } from "./N4cNotif";
import { DarkScreen, GlowLine, NightBg, clamp, glide } from "../kit";

// Starts on the "Simpan" close-up where N4c ends, pulls back, then lays the phone into a tilted hero shot
// with the background glow under it. 140 frames.
export const N5Neon: React.FC = () => {
  const frame = useCurrentFrame();
  const back = interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: glide });
  const t = interpolate(frame, [36, 86], [0, 1], { ...clamp, easing: glide });
  const catat = interpolate(frame, [58, 66], [1, 0], clamp);
  const recap = interpolate(frame, [64, 76], [0, 1], clamp);
  const out = interpolate(frame, [122, 140], [1, 0], clamp);

  const s = interpolate(back, [0, 1], [3, 1]);
  // pin = where the button sits; at s = 1 the phone centre is pin + (PHONE_MID - SAVE_PIN)
  const dx = PHONE_MID.x - SAVE_PIN.x;
  const dy = PHONE_MID.y - SAVE_PIN.y;
  const px =
    t > 0
      ? interpolate(t, [0, 1], [700 - dx, 1320 - dx])
      : interpolate(back, [0, 1], [960, 700 - dx]);
  const py =
    t > 0
      ? interpolate(t, [0, 1], [540 - dy, 520 - dy])
      : interpolate(back, [0, 1], [600, 540 - dy]);

  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: out }}>
        <NightBg
          light={interpolate(t, [0, 1], [1, 1.3])}
          x={interpolate(frame, [0, 40, 86], [50, 36, 69], clamp)}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: pinned(s, px, py),
          perspective: 2200,
          opacity: out,
          filter: out < 1 ? `blur(${(1 - out) * 14}px)` : undefined,
        }}
      >
        <div
          style={{
            transformOrigin: `${PHONE_MID.x}px ${PHONE_MID.y}px`,
            transform: `rotateX(${40 * t}deg) rotateY(${4 * t}deg) rotateZ(${interpolate(frame, [36, 86, 140], [0, -30, -26], clamp)}deg) scale(${interpolate(t, [0, 1], [1, 1.22])})`,
          }}
        >
          <DarkScreen glow={back}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: catat,
                filter: catat < 1 ? `blur(${(1 - catat) * 6}px)` : undefined,
              }}
            >
              <NotifCatat frame={frame} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: recap,
                filter: recap < 1 ? `blur(${(1 - recap) * 6}px)` : undefined,
              }}
            >
              <RecapScreen
                bar={interpolate(frame, [68, 100], [0, 1], {
                  ...clamp,
                  easing: glide,
                })}
                lit={Math.round(interpolate(frame, [76, 120], [0, 28], clamp))}
              />
            </div>
          </DarkScreen>
        </div>
      </div>
      <GlowLine
        words={[{ t: "Rapi," }, { t: " otomatis." }]}
        at={90}
        out={122}
        stagger={8}
        size={96}
        style={{ position: "absolute", left: 150, top: 150 }}
      />
    </AbsoluteFill>
  );
};
