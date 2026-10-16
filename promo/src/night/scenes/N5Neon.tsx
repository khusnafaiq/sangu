import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { CatatScreen } from "../../components/AppUI";
import { NotifResult } from "./N4cNotif";
import { RecapScreen } from "../../film/screens";
import { DarkScreen, GlowLine, NightBg, clamp, glide } from "../kit";

// Continuous move from the flat phone (end of N4c) into a tilted hero shot, lit by the background glow.
export const N5Neon: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, 46], [0, 1], { ...clamp, easing: glide });
  const catat = interpolate(frame, [36, 44], [1, 0], clamp);
  const recap = interpolate(frame, [42, 54], [0, 1], clamp);
  const out = interpolate(frame, [122, 140], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: out }}>
        <NightBg
          light={interpolate(t, [0, 1], [1, 1.35])}
          x={interpolate(t, [0, 1], [36, 69])}
          y={48}
        />
        {/* a soft pool of light under the phone */}
        <div
          style={{
            position: "absolute",
            left: interpolate(t, [0, 1], [700, 1320]) - 420,
            top: 760,
            width: 840,
            height: 220,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(52,211,153,0.28), rgba(52,211,153,0) 70%)",
            filter: "blur(30px)",
            opacity: t,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div
          style={{
            position: "absolute",
            left: interpolate(t, [0, 1], [700, 1320]),
            top: interpolate(t, [0, 1], [546, 520]),
            transform: `translate(-50%, -50%) rotateX(${40 * t}deg) rotateY(${4 * t}deg) rotateZ(${interpolate(frame, [0, 46, 140], [0, -30, -26], clamp)}deg) scale(${interpolate(t, [0, 1], [1, 1.22])})`,
            opacity: out,
            filter: out < 1 ? `blur(${(1 - out) * 14}px)` : undefined,
          }}
        >
          <div
            style={{
              borderRadius: 64,
              boxShadow: `0 0 0 ${1.5 * t}px rgba(167,243,208,0.35)`,
            }}
          >
            <DarkScreen glow={1}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: catat,
                  filter: catat < 1 ? `blur(${(1 - catat) * 6}px)` : undefined,
                }}
              >
                <CatatScreen
                  transcript={
                    <span style={{ color: C.muted }}>Kopi 28rb pakai BCA</span>
                  }
                  listening={0}
                  frame={frame}
                  composer={<NotifResult />}
                />
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
                  bar={interpolate(frame, [46, 80], [0, 1], {
                    ...clamp,
                    easing: glide,
                  })}
                  lit={Math.round(
                    interpolate(frame, [56, 110], [0, 28], clamp),
                  )}
                />
              </div>
            </DarkScreen>
          </div>
        </div>
      </AbsoluteFill>
      <GlowLine
        words={[{ t: "Rapi," }, { t: " otomatis." }]}
        at={56}
        out={118}
        stagger={8}
        size={96}
        style={{ position: "absolute", left: 150, top: 150 }}
      />
    </AbsoluteFill>
  );
};
