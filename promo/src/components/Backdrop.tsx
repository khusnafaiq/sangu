import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C } from "../theme";

// Dark canvas with slow-drifting brand glows, shared by every scene.
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{ backgroundColor: C.canvas, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          width: 1500,
          height: 1500,
          left: -620 + Math.sin(t * 0.45) * 90,
          top: -560 + Math.cos(t * 0.35) * 70,
          background: "radial-gradient(circle, rgba(52,211,153,0.20) 0%, rgba(52,211,153,0.06) 38%, rgba(52,211,153,0) 66%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 1400,
          height: 1400,
          right: -640 + Math.cos(t * 0.4) * 80,
          bottom: -520 + Math.sin(t * 0.3) * 90,
          background: "radial-gradient(circle, rgba(56,189,248,0.10) 0%, rgba(52,211,153,0.07) 35%, rgba(52,211,153,0) 66%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.075) 1.6px, transparent 1.6px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `0px ${(-frame * 0.35) % 44}px`,
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 45%, black 10%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 45%, black 10%, transparent 80%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 90% 70% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

export const withBackdrop = (Scene: React.FC) => {
  const WithBackdrop: React.FC = () => (
    <AbsoluteFill>
      <Backdrop />
      <Scene />
    </AbsoluteFill>
  );
  return WithBackdrop;
};
