import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../theme";
import { Paced } from "./kit";
import { SCENES, SceneId, TOTAL } from "./timeline";
import { Voiceover } from "./Voiceover";
import { NightSound } from "./NightSound";
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
  const v = interpolate(frame, [at, at + 8], [1, 0], {
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

const COMPONENTS: Record<SceneId, React.FC> = {
  hook: N1HookE,
  logo: N2Logo,
  jatah: N3Daily,
  catat: N4Voice,
  nota: N4bNota,
  notif: N4cNotif,
  neon: N5Neon,
  privasi: N6Privacy,
  end: N7End,
};

// Scenes that end on a blur; the others cut on a match or fade themselves.
const BLUR_OUT = new Set<SceneId>([
  "logo",
  "jatah",
  "catat",
  "nota",
  "privasi",
]);

/** One scene at its pace in the film, for previewing it on its own. */
export const NightScene: React.FC<{ id: SceneId }> = ({ id }) => {
  const s = SCENES.find((x) => x.id === id)!;
  const Scene = COMPONENTS[id];
  return (
    <AbsoluteFill style={{ background: "#040506", fontFamily: FONT }}>
      <Paced rate={s.rate}>
        {BLUR_OUT.has(id) ? (
          <BlurOut at={s.dur - 8}>
            <Scene />
          </BlurOut>
        ) : (
          <Scene />
        )}
      </Paced>
    </AbsoluteFill>
  );
};

// Dark, minimal and upbeat: crisp type on a glowing stage, match cuts, cuts on the beat.
// 9 scenes back to back (see timeline.ts) ≈ 47 s.
export const SanguNight: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#040506", fontFamily: FONT }}>
      <NightSound total={TOTAL} />
      <Voiceover />
      <Series>
        {SCENES.map((s) => (
          <Series.Sequence key={s.id} name={s.name} durationInFrames={s.dur}>
            <NightScene id={s.id} />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
