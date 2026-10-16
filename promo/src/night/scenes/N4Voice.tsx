import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../../theme";
import { CatatScreen, TxRow } from "../../components/AppUI";
import { Icon } from "../../components/Icon";
import {
  DarkScreen,
  GLOW,
  GlowLine,
  INK,
  NightBg,
  clamp,
  glide,
  slow,
  veil,
} from "../kit";

const WORDS = ["“Kopi", " susu", " 28rb", " pakai", " GoPay”"];
const SPOKEN = "Kopi susu 28rb pakai GoPay";
// Transcript centre inside the Catat screen (DarkScreen-local px) and its font size there.
const PIN = { x: 202.5, y: 218 };
const APP_SIZE = 19;
const BIG = 80;

/** Parsed result shown in the Catat composer (shared with N5 so the cut is seamless). */
export const VoiceResult: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <div
    style={{
      marginTop: 18,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      ...style,
    }}
  >
    <div style={{ fontSize: 12.5, color: C.text2 }}>
      1 transaksi terbaca · cek lalu simpan
    </div>
    <TxRow
      style={{ margin: "0 -6px" }}
      highlight={1}
      tx={{
        icon: "mic",
        title: "Kopi susu",
        wallet: "GoPay",
        cat: "Makan & Minum",
        amount: 28000,
      }}
    />
    <div
      style={{
        marginTop: 6,
        height: 48,
        borderRadius: 15,
        background: C.text,
        color: C.bg,
        fontSize: 15.5,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Simpan 1 transaksi · Rp 28.000
    </div>
  </div>
);

// 0:15 — the spoken sentence as text-only, then pull back: it is the transcript in Catat.
export const N4Voice: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [64, 122], [0, 1], { ...clamp, easing: glide });
  const s = interpolate(z, [0, 1], [BIG / APP_SIZE, 1.5]);
  const px = interpolate(z, [0, 1], [960, 690]);
  const py = interpolate(z, [0, 1], [530, 560]);
  const saved = frame >= 128;
  const row = interpolate(frame, [128, 148], [0, 1], {
    ...clamp,
    easing: slow,
  });

  const composer = saved ? (
    <VoiceResult
      style={{ opacity: row, translate: `0px ${(1 - row) * 16}px` }}
    />
  ) : undefined;

  return (
    <AbsoluteFill>
      <NightBg x={interpolate(z, [0, 1], [50, 36])} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: `translate(${px - PIN.x * s}px, ${py - PIN.y * s}px) scale(${s})`,
          opacity: interpolate(frame, [58, 72], [0, 1], clamp),
        }}
      >
        <DarkScreen glow={z}>
          <CatatScreen
            transcript={SPOKEN}
            listening={interpolate(
              frame,
              [60, 70, 118, 126],
              [1, 1, 1, 0],
              clamp,
            )}
            frame={frame}
            composer={composer}
          />
        </DarkScreen>
      </div>

      {/* text-only beat: mic + the words as they are spoken */}
      <div
        style={{
          position: "absolute",
          left: 912,
          top: 330,
          width: 96,
          height: 96,
          ...veil(frame, 0, 60, 20, 12, 0),
        }}
      >
        {[0, 1].map((i) => {
          const p =
            ((frame / 40 + i / 2) % 1) *
            interpolate(frame, [6, 14], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid rgba(52,211,153,${0.6 * (1 - p)})`,
                scale: String(1 + p * 0.9),
              }}
            />
          );
        })}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: C.green,
            boxShadow: "0 0 40px rgba(52,211,153,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="mic" size={42} color={C.bg} strokeWidth={2.2} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 490,
          translate: "-50% 0px",
          fontFamily: FONT,
          fontSize: BIG,
          fontWeight: 500,
          letterSpacing: -BIG * 0.025,
          lineHeight: 1,
          color: INK,
          textShadow: GLOW.white,
          whiteSpace: "pre",
          opacity: interpolate(frame, [62, 72], [1, 0], clamp),
        }}
      >
        {WORDS.map((w, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              ...veil(frame, 14 + i * 8, 1e9, 18, 12, 6),
            }}
          >
            {w}
          </span>
        ))}
      </div>

      <GlowLine
        words={[{ t: "Cukup" }, { t: " ngomong." }]}
        at={132}
        stagger={8}
        size={100}
        style={{ position: "absolute", left: 1050, top: 470 }}
      />
    </AbsoluteFill>
  );
};
