import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT } from "../theme";
import { Icon, IconName } from "../components/Icon";

const CHIPS: [IconName, string][] = [
  ["offline", "Bisa offline"],
  ["download", "Backup sendiri"],
];

// No login, no account: data never leaves the phone.
export const PrivacyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 30], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text, alignItems: "center", justifyContent: "center" }}>
      <Audio name="Lock" src={staticFile("audio/sfx-lock.wav")} from={26} volume={0.56} />

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: -40 }}>
        <Interactive.Div
          name="Shield"
          style={{
            position: "relative",
            width: 300,
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            scale: interpolate(frame, [0, 20], [0.7, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
          }}
        >
          {[0, 1].map((i) => {
            const p = ((frame / 45 + i / 2) % 1) * interpolate(frame, [20, 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 150,
                  border: `3px solid rgba(52,211,153,${0.5 * (1 - p)})`,
                  scale: String(1 + p * 0.8),
                }}
              />
            );
          })}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 150,
              background: "radial-gradient(circle, rgba(52,211,153,0.28), rgba(52,211,153,0) 70%)",
            }}
          />
          <Icon name="shield" size={210} color={C.green} strokeWidth={1.6} pathLength={1} dashOffset={draw} style={{ filter: "drop-shadow(0 0 24px rgba(52,211,153,0.6))" }} />
        </Interactive.Div>

        <Interactive.Div
          name="No login"
          style={{
            marginTop: 70,
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -5,
            lineHeight: 1.05,
            textAlign: "center",
            opacity: interpolate(frame, [12, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [12, 28], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Tanpa login.
        </Interactive.Div>
        <Interactive.Div
          name="No account"
          style={{
            fontSize: 112,
            fontWeight: 800,
            letterSpacing: -5,
            lineHeight: 1.05,
            textAlign: "center",
            color: C.green,
            opacity: interpolate(frame, [20, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [20, 36], ["0px 50px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Tanpa akun.
        </Interactive.Div>

        <Interactive.Div
          name="Support"
          style={{
            marginTop: 40,
            maxWidth: 860,
            fontSize: 48,
            fontWeight: 500,
            lineHeight: 1.3,
            color: C.text2,
            textAlign: "center",
            opacity: interpolate(frame, [36, 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            translate: interpolate(frame, [36, 52], ["0px 30px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          }}
        >
          Semua data tersimpan di HP kamu sendiri, nggak dikirim ke mana pun.
        </Interactive.Div>

        <div style={{ display: "flex", gap: 20, marginTop: 56 }}>
          {CHIPS.map(([icon, label], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "20px 30px",
                borderRadius: 999,
                background: C.surface2,
                border: `2px solid ${C.borderHover}`,
                fontSize: 36,
                fontWeight: 600,
                opacity: interpolate(frame, [52 + i * 6, 60 + i * 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                scale: String(interpolate(frame, [52 + i * 6, 68 + i * 6], [0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.34, 1.56, 0.64, 1) })),
              }}
            >
              <Icon name={icon} size={38} color={C.green} strokeWidth={2} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
