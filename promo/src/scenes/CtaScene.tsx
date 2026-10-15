import React from "react";
import { AbsoluteFill, Easing, Img, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT } from "../theme";
import { Icon } from "../components/Icon";

export const CtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame / 16) * 12;
  const shine = interpolate(frame, [58, 84], [-40, 140], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text, alignItems: "center", justifyContent: "center" }}>
      <Audio name="Shimmer" src={staticFile("audio/sfx-shimmer.wav")} from={2} volume={0.4} />
      <Audio name="Button" src={staticFile("audio/sfx-pop.wav")} from={38} volume={0.48} />

      <div
        style={{
          position: "absolute",
          width: 1000,
          height: 1000,
          top: 180,
          borderRadius: 500,
          background: "radial-gradient(circle, rgba(52,211,153,0.28) 0%, rgba(52,211,153,0.06) 42%, rgba(52,211,153,0) 70%)",
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -40 }}>
        <Img
          name="Logo mark"
          src={staticFile("brand/logo-mark-512.png")}
          style={{
            width: 300,
            height: 300,
            filter: "drop-shadow(0 30px 60px rgba(52,211,153,0.35))",
            opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: interpolate(frame, [0, 22], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
            translate: `0px ${float}px`,
          }}
        />
        <Interactive.Div
          name="Wordmark"
          style={{
            marginTop: 36,
            fontSize: 170,
            fontWeight: 800,
            letterSpacing: -8,
            lineHeight: 1,
            opacity: interpolate(frame, [8, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [8, 26], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Sangu
        </Interactive.Div>
        <Interactive.Div
          name="Tagline"
          style={{
            marginTop: 28,
            fontSize: 56,
            fontWeight: 600,
            letterSpacing: -1.5,
            lineHeight: 1.22,
            color: C.green,
            textAlign: "center",
            opacity: interpolate(frame, [18, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [18, 36], ["0px 30px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Sangu hari ini,
          <br />
          tenang sampai gajian.
        </Interactive.Div>

        <Interactive.Div
          name="CTA button"
          style={{
            position: "relative",
            overflow: "hidden",
            marginTop: 80,
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "36px 64px",
            borderRadius: 999,
            background: C.text,
            color: C.bg,
            fontSize: 54,
            fontWeight: 800,
            letterSpacing: -1.5,
            boxShadow: "0 30px 80px rgba(52,211,153,0.25)",
            opacity: interpolate(frame, [36, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: interpolate(frame, [36, 54], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1), output: "perceptual-scale" }),
          }}
        >
          Mulai catat sekarang
          <Icon name="arrowRight" size={50} color={C.bg} strokeWidth={2.6} />
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${shine}%`,
              width: 140,
              background: "linear-gradient(100deg, rgba(52,211,153,0) 0%, rgba(52,211,153,0.45) 50%, rgba(52,211,153,0) 100%)",
              rotate: "12deg",
            }}
          />
        </Interactive.Div>

        <Interactive.Div
          name="URL"
          style={{
            marginTop: 44,
            fontSize: 44,
            fontWeight: 700,
            letterSpacing: -0.5,
            color: C.text,
            opacity: interpolate(frame, [46, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          khusnafaiq.github.io/sangu
        </Interactive.Div>
        <Interactive.Div
          name="Fine print"
          style={{
            marginTop: 16,
            fontSize: 34,
            fontWeight: 500,
            color: C.muted,
            textAlign: "center",
            opacity: interpolate(frame, [52, 62], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Buka di browser HP · Tambahkan ke Layar Utama
        </Interactive.Div>
      </div>
    </AbsoluteFill>
  );
};
