import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { Phone } from "../../components/Phone";
import { CatatScreen } from "../../components/AppUI";
import { Cursor, NeonRibbons, TypeText } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const SPOKEN = "Kopi susu 28rb pakai GoPay dan parkir 5rb";
const DAN_AT = SPOKEN.indexOf(" dan ") + 1;

// 0:17 — dark hero shot: tilted phone, neon light ribbons, voice capture.
export const F6Neon: React.FC = () => {
  const frame = useCurrentFrame();
  const listening = interpolate(frame, [22, 28, 100, 106], [0, 1, 1, 0], clamp);
  const typed = Math.floor(interpolate(frame, [28, 96], [0, SPOKEN.length], clamp));
  const shown = SPOKEN.slice(0, typed);
  const transcript =
    typed === 0 ? (
      <span style={{ color: C.muted }}>Kopi 28rb pakai BCA</span>
    ) : (
      <>
        {shown.slice(0, Math.min(typed, DAN_AT))}
        {typed > DAN_AT ? <span style={{ color: C.green, fontWeight: 700 }}>{shown.slice(DAN_AT, Math.min(typed, DAN_AT + 3))}</span> : null}
        {typed > DAN_AT + 3 ? shown.slice(DAN_AT + 3) : null}
      </>
    );

  return (
    <AbsoluteFill style={{ background: "#030405", overflow: "hidden" }}>
      <NeonRibbons t={interpolate(frame, [0, 110], [0, 1], clamp)} />
      <AbsoluteFill style={{ perspective: 2200 }}>
        <div
          style={{
            position: "absolute",
            left: 1010,
            top: 40,
            transformOrigin: "50% 50%",
            transform: `rotateX(40deg) rotateY(4deg) rotateZ(${interpolate(frame, [0, 120], [-36, -28], clamp)}deg) scale(1.28) translateY(${interpolate(frame, [0, 120], [40, -30], clamp)}px)`,
          }}
        >
          <div style={{ borderRadius: 70, boxShadow: "0 0 0 3px rgba(56,189,248,0.55), 0 0 60px rgba(52,211,153,0.25)" }}>
            <Phone glow={0.4}>
              <CatatScreen transcript={transcript} listening={listening} frame={frame} />
              <Cursor x={196} y={523} press={interpolate(frame, [16, 26], [0, 1], clamp)} opacity={interpolate(frame, [6, 12, 34, 42], [0, 1, 1, 0], clamp)} size={26} />
            </Phone>
          </div>
        </div>
      </AbsoluteFill>
      <TypeText
        segs={[{ text: "Ngomong aja,", bold: true }, { text: "langsung tercatat.", br: true }]}
        start={40}
        cps={0.8}
        ink="#F5F7F6"
        lead="#34D399"
        style={{ position: "absolute", left: 140, top: 120, fontSize: 70, fontWeight: 500, letterSpacing: -1.6, lineHeight: 1.2 }}
      />
    </AbsoluteFill>
  );
};
