import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from "remotion";
import { N1HookE } from "./scenes/N1Hooks";
import { N2Logo } from "./scenes/N2Logo";
import { N3Daily } from "./scenes/N3Daily";
import { N4Voice } from "./scenes/N4Voice";
import { N4bNota } from "./scenes/N4bNota";
import { N4cNotif } from "./scenes/N4cNotif";
import { N5Neon } from "./scenes/N5Neon";
import { N6Privacy } from "./scenes/N6Privacy";
import { N7End } from "./scenes/N7End";

/** Blurs a scene away over its last frames (for cuts that are not match cuts). */
const BlurOut: React.FC<{ at: number; children: React.ReactNode }> = ({
  at,
  children,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        opacity: v,
        filter: v < 1 ? `blur(${(1 - v) * 18}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Dark, minimal cut: glowing type, slow blur reveals, match cuts between scenes.
// 9 scenes back to back = 1480 frames ≈ 49 s.
export const SanguNight: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#040506" }}>
      <Series>
        <Series.Sequence name="Hook" durationInFrames={300}>
          <N1HookE />
        </Series.Sequence>
        <Series.Sequence name="Logo" durationInFrames={90}>
          <BlurOut at={76}>
            <N2Logo />
          </BlurOut>
        </Series.Sequence>
        <Series.Sequence name="Jatah harian" durationInFrames={165}>
          <BlurOut at={151}>
            <N3Daily />
          </BlurOut>
        </Series.Sequence>
        <Series.Sequence name="Catat suara" durationInFrames={180}>
          <BlurOut at={166}>
            <N4Voice />
          </BlurOut>
        </Series.Sequence>
        <Series.Sequence name="Nota & screenshot" durationInFrames={150}>
          <BlurOut at={136}>
            <N4bNota />
          </BlurOut>
        </Series.Sequence>
        <Series.Sequence name="Notifikasi" durationInFrames={165}>
          <N4cNotif />
        </Series.Sequence>
        <Series.Sequence name="Neon" durationInFrames={140}>
          <N5Neon />
        </Series.Sequence>
        <Series.Sequence name="Privasi" durationInFrames={160}>
          <BlurOut at={146}>
            <N6Privacy />
          </BlurOut>
        </Series.Sequence>
        <Series.Sequence name="Penutup" durationInFrames={130}>
          <N7End />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
