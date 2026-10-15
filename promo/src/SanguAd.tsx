import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { pushCut } from "@remotion/transitions/push-cut";
import { Easing } from "remotion";
import { Backdrop } from "./components/Backdrop";
import { HookScene } from "./scenes/HookScene";
import { BrandScene } from "./scenes/BrandScene";
import { DailyScene } from "./scenes/DailyScene";
import { VoiceScene } from "./scenes/VoiceScene";
import { ScanScene } from "./scenes/ScanScene";
import { RecapScene } from "./scenes/RecapScene";
import { PrivacyScene } from "./scenes/PrivacyScene";
import { CtaScene } from "./scenes/CtaScene";

const cut = linearTiming({ durationInFrames: 15, easing: Easing.bezier(0.65, 0, 0.35, 1) });

// 8 scenes (1005 frames) − 7 transitions × 15 frames = 900 frames = 30 s.
export const SanguAd: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Audio
      name="Music"
      src={staticFile("audio/music.wav")}
      volume={(f) => interpolate(f, [0, 6, 860, 900], [0, 0.55, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
    />
    <TransitionSeries>
      <TransitionSeries.Sequence name="Hook" durationInFrames={120}>
        <HookScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={pushCut({ flashColor: "#34D399", flashOpacity: 0.35 })} timing={cut} />
      <TransitionSeries.Sequence name="Brand" durationInFrames={90}>
        <BrandScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={cut} />
      <TransitionSeries.Sequence name="Jatah harian" durationInFrames={150}>
        <DailyScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={cut} />
      <TransitionSeries.Sequence name="Catat suara" durationInFrames={150}>
        <VoiceScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={cut} />
      <TransitionSeries.Sequence name="Foto nota" durationInFrames={120}>
        <ScanScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={cut} />
      <TransitionSeries.Sequence name="Rekapan" durationInFrames={150}>
        <RecapScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut} />
      <TransitionSeries.Sequence name="Privasi" durationInFrames={105}>
        <PrivacyScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={fade()} timing={cut} />
      <TransitionSeries.Sequence name="CTA" durationInFrames={120}>
        <CtaScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);
