import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT, rupiah } from "../theme";
import { Phone } from "../components/Phone";
import { HomeScreen } from "../components/AppUI";

const pop = (frame: number, start: number) => ({
  opacity: interpolate(frame, [start, start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  scale: String(interpolate(frame, [start, start + 16], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) })),
});

// "Aman dipakai hari ini": the daily safe-to-spend number, and how it is worked out.
export const DailyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const safeToday = interpolate(frame, [20, 58], [0, 316350], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const ring = interpolate(frame, [58, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <Audio name="Whoosh" src={staticFile("audio/sfx-whoosh.wav")} volume={0.44} />
      <Audio name="Count" src={staticFile("audio/sfx-count.wav")} from={20} volume={0.36} />
      <Audio name="Pop 1" src={staticFile("audio/sfx-pop.wav")} from={76} volume={0.48} />
      <Audio name="Pop 2" src={staticFile("audio/sfx-pop.wav")} from={86} volume={0.48} />
      <Audio name="Ding" src={staticFile("audio/sfx-ding.wav")} from={100} volume={0.44} />

      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          top: 140,
          left: 80,
          right: 80,
          textAlign: "center",
          fontSize: 94,
          fontWeight: 800,
          letterSpacing: -4,
          lineHeight: 1.04,
          opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [4, 22], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        Tahu jatah <span style={{ color: C.green }}>aman</span>
        <br />
        kamu hari ini.
      </Interactive.Div>

      <Interactive.Div
        name="Phone"
        style={{
          position: "absolute",
          top: 430,
          left: 331,
          transformOrigin: "50% 0%",
          scale: "1.72",
          translate: interpolate(frame, [0, 26], ["0px 700px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          opacity: interpolate(frame, [70, 84], [1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Phone>
          <HomeScreen safeToday={safeToday} ring={ring} />
        </Phone>
      </Interactive.Div>

      <Interactive.Div
        name="Formula card"
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: 1180,
          padding: "44px 48px 48px",
          borderRadius: 48,
          background: "rgba(18,18,21,0.82)",
          backdropFilter: "blur(24px)",
          border: "2px solid rgba(52,211,153,0.35)",
          boxShadow: "0 40px 120px rgba(0,0,0,0.6), 0 0 80px rgba(52,211,153,0.15)",
          opacity: interpolate(frame, [70, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [70, 90], ["0px 120px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ ...pop(frame, 76) }}>
            <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -2.4 }}>Rp 3.163.500</div>
            <div style={{ fontSize: 36, color: C.text2, marginTop: 4 }}>sisa budget</div>
          </div>
          <div style={{ fontSize: 76, fontWeight: 300, color: C.muted, ...pop(frame, 82) }}>÷</div>
          <div style={{ textAlign: "right", ...pop(frame, 86) }}>
            <div style={{ fontSize: 60, fontWeight: 800, letterSpacing: -2.4 }}>10 hari</div>
            <div style={{ fontSize: 36, color: C.text2, marginTop: 4 }}>ke gajian</div>
          </div>
        </div>
        <div style={{ height: 2, background: C.border, margin: "32px 0 28px" }} />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 18, ...pop(frame, 98) }}>
          <span style={{ fontSize: 88, fontWeight: 800, letterSpacing: -4, color: C.green }}>Rp {rupiah(316350)}</span>
          <span style={{ fontSize: 44, fontWeight: 600, color: C.text2 }}>/ hari</span>
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
