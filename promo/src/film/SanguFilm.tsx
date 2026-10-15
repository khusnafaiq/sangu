import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { F1Opening } from "./scenes/F1Opening";
import { F2Logo } from "./scenes/F2Logo";
import { F3Intro } from "./scenes/F3Intro";
import { F4Wall } from "./scenes/F4Wall";
import { F5Daily } from "./scenes/F5Daily";
import { F6Neon } from "./scenes/F6Neon";
import { F7Features } from "./scenes/F7Features";
import { F8Privacy } from "./scenes/F8Privacy";
import { F9Words } from "./scenes/F9Words";
import { F10End } from "./scenes/F10End";

const soft = linearTiming({ durationInFrames: 12, easing: Easing.bezier(0.65, 0, 0.35, 1) });

// 16:9 product film in the style of the reference (light & airy, typed copy, dark hero interludes).
// 10 scenes (1131 frames) − 9 soft cuts × 12 frames = 1023 frames ≈ 34 s.
export const SanguFilm: React.FC = () => (
  <AbsoluteFill style={{ background: "#F4F7F6" }}>
    <TransitionSeries>
      <TransitionSeries.Sequence name="Pembuka" durationInFrames={132}>
        <F1Opening />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Logo" durationInFrames={84}>
        <F2Logo />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Perkenalan" durationInFrames={120}>
        <F3Intro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Dinding layar" durationInFrames={96}>
        <F4Wall />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Jatah harian" durationInFrames={120}>
        <F5Daily />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Neon catat suara" durationInFrames={120}>
        <F6Neon />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Fitur melayang" durationInFrames={120}>
        <F7Features />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Privasi" durationInFrames={102}>
        <F8Privacy />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Kata-kata" durationInFrames={132}>
        <F9Words />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={soft} />
      <TransitionSeries.Sequence name="Penutup" durationInFrames={105}>
        <F10End />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
