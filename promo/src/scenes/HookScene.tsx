import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, interpolateColors, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT, rupiah } from "../theme";

// Small spends that "leak" out of the balance while it drains.
const LEAKS = [
  { label: "Kopi kekinian", amount: "-28rb", x: 90, y: 1300, at: 32, rot: -5 },
  { label: "Ojol", amount: "-22rb", x: 640, y: 1350, at: 38, rot: 4 },
  { label: "Checkout", amount: "-189rb", x: 150, y: 1470, at: 44, rot: 3 },
  { label: "Langganan", amount: "-54rb", x: 560, y: 1560, at: 50, rot: -4 },
  { label: "Jajan", amount: "-35rb", x: 230, y: 1660, at: 56, rot: -2 },
  { label: "Nongkrong", amount: "-120rb", x: 560, y: 1730, at: 62, rot: 5 },
];

// 0–4s: the pain. Mid-month, balance melts, payday is still far away.
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();

  const day = Math.round(interpolate(frame, [2, 22], [1, 15], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }));
  const drain = interpolate(frame, [30, 74], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.15, 1) });
  const balance = 4500000 - drain * (4500000 - 87000);
  const shake = frame > 74 && frame < 92 ? Math.sin(frame * 2.4) * (92 - frame) * 0.9 : 0;
  const balanceColor = interpolateColors(drain, [0, 0.6, 1], [C.text, C.text, C.red]);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <Audio name="Ticks" src={staticFile("audio/sfx-ticks.wav")} from={30} volume={0.44} />
      <Audio name="Thud" src={staticFile("audio/sfx-thud.wav")} from={73} volume={0.72} />

      {/* Calendar tile flipping to the 15th */}
      <Interactive.Div
        name="Calendar"
        style={{
          position: "absolute",
          top: 380,
          left: 415,
          width: 250,
          borderRadius: 46,
          overflow: "hidden",
          background: C.surface1,
          border: "2px solid rgba(255,255,255,0.10)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          scale: interpolate(frame, [0, 14], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
          opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          rotate: interpolate(frame, [0, 18], ["-12deg", "-4deg"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ background: C.red, color: "#fff", textAlign: "center", fontSize: 44, fontWeight: 800, letterSpacing: 7, padding: "14px 0 12px" }}>OKT</div>
        <div style={{ textAlign: "center", fontSize: 156, fontWeight: 800, letterSpacing: -7, lineHeight: 1, padding: "20px 0 30px", fontVariantNumeric: "tabular-nums" }}>
          {day}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Headline"
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 112,
          fontWeight: 800,
          letterSpacing: -4.5,
          lineHeight: 1,
          opacity: interpolate(frame, [14, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [14, 30], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        Baru tanggal 15,
      </Interactive.Div>

      <Interactive.Div
        name="Balance card"
        style={{
          position: "absolute",
          top: 890,
          left: 80,
          right: 80,
          padding: "40px 52px 46px",
          borderRadius: 44,
          background: "linear-gradient(180deg, rgba(24,24,28,0.95), rgba(18,18,21,0.95))",
          border: "2px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
          opacity: interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [20, 38], ["0px 80px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ fontSize: 40, color: C.text2, fontWeight: 500 }}>Saldo kamu</div>
        <div
          style={{
            fontSize: 124,
            fontWeight: 800,
            letterSpacing: -5,
            lineHeight: 1.1,
            marginTop: 8,
            color: balanceColor,
            fontVariantNumeric: "tabular-nums",
            translate: `${shake}px 0px`,
          }}
        >
          Rp {rupiah(balance)}
        </div>
        <div style={{ marginTop: 26, height: 18, borderRadius: 9, background: C.surface3, overflow: "hidden" }}>
          <div
            style={{
              width: `${(1 - drain * 0.98) * 100}%`,
              height: "100%",
              borderRadius: 9,
              background: interpolateColors(drain, [0, 0.55, 1], [C.green, C.yellow, C.red]),
            }}
          />
        </div>
      </Interactive.Div>

      {LEAKS.map((l) => (
        <div
          key={l.label}
          style={{
            position: "absolute",
            left: l.x,
            top: l.y,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 28px",
            borderRadius: 999,
            background: "rgba(24,24,28,0.92)",
            border: "2px solid rgba(251,93,120,0.35)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
            fontSize: 38,
            fontWeight: 600,
            whiteSpace: "nowrap",
            rotate: `${l.rot}deg`,
            opacity: interpolate(frame, [l.at, l.at + 6, 74, 84], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            scale: String(interpolate(frame, [l.at, l.at + 12], [0.6, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) })),
            translate: `0px ${interpolate(frame, [l.at, 84], [-40, 70], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px`,
          }}
        >
          <span style={{ color: C.text2 }}>{l.label}</span>
          <span style={{ color: C.red, fontWeight: 800 }}>{l.amount}</span>
        </div>
      ))}

      <Interactive.Div
        name="Payday line"
        style={{
          position: "absolute",
          top: 1290,
          left: 80,
          right: 80,
          fontSize: 68,
          fontWeight: 700,
          letterSpacing: -2.2,
          color: C.text2,
          textAlign: "center",
          lineHeight: 1.18,
          opacity: interpolate(frame, [82, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [82, 98], ["0px 40px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        padahal gajian masih
        <br />
        <span style={{ color: C.text }}>10 hari lagi.</span>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
