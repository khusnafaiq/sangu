import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../../theme";
import { CatatScreen, TxRow } from "../../components/AppUI";
import { Icon } from "../../components/Icon";
import {
  DarkScreen,
  GlowLine,
  INK,
  NightBg,
  clamp,
  glide,
  slow,
  veil,
} from "../kit";

// What the person says, word by word, timed to the voice-over (vo07). "terus" is one of the
// words the app splits transactions on, so this one sentence becomes two transactions.
type W = { t: string; at: number; tone?: "muted" | "split" };
const LINE1: W[] = [
  { t: "Ehem…", at: 8, tone: "muted" },
  { t: " beli", at: 30 },
  { t: " kopi", at: 37 },
  { t: " susu", at: 44 },
  { t: " 28rb", at: 52 },
  { t: " pakai", at: 62 },
  { t: " GoPay,", at: 70 },
];
const LINE2: W[] = [
  { t: "terus…", at: 84, tone: "split" },
  { t: " bayar", at: 124 },
  { t: " parkir", at: 132 },
  { t: " 3rb", at: 142 },
  { t: " pakai", at: 150 },
  { t: " cash.", at: 158 },
];

// The transcript as the app shows it (speech-to-text drops the "ehem").
const Transcript: React.FC = () => (
  <>
    Beli kopi susu 28rb pakai GoPay{" "}
    <span style={{ color: C.green, fontWeight: 700 }}>terus</span> bayar parkir
    3rb pakai cash
  </>
);

// Transcript centre inside the Catat screen (DarkScreen-local px) and its font size there.
const PIN = { x: 202.5, y: 246 };
const APP_SIZE = 19;
const BIG = 64;

/** Parsed result in the Catat composer: two transactions from one sentence. */
export const VoiceResult: React.FC<{ style?: React.CSSProperties }> = ({
  style,
}) => (
  <div
    style={{
      marginTop: 18,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...style,
    }}
  >
    <div style={{ fontSize: 12.5, color: C.text2 }}>
      2 transaksi terbaca · cek lalu simpan
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
    <TxRow
      style={{ margin: "0 -6px" }}
      highlight={1}
      tx={{
        icon: "mic",
        title: "Parkir",
        wallet: "Cash",
        cat: "Transportasi",
        amount: 3000,
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
      Simpan 2 transaksi · Rp 31.000
    </div>
  </div>
);

const Words: React.FC<{ words: W[]; frame: number }> = ({ words, frame }) => (
  <>
    {words.map((w, i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          color:
            w.tone === "muted"
              ? "#7F8784"
              : w.tone === "split"
                ? "#9FE9C8"
                : INK,
          fontStyle: w.tone === "muted" ? "italic" : undefined,
          fontWeight: w.tone === "split" ? 700 : undefined,
          ...veil(frame, w.at, 1e9, 18, 12, 6),
        }}
      >
        {w.t}
      </span>
    ))}
  </>
);

// 0:18 — the spoken sentence as text-only, then pull back: it is the transcript in Catat, and
// it turns into two transactions. 300 frames.
export const N4Voice: React.FC = () => {
  const frame = useCurrentFrame();
  const z = interpolate(frame, [178, 232], [0, 1], { ...clamp, easing: glide });
  const s = interpolate(z, [0, 1], [BIG / APP_SIZE, 1.5]);
  const px = interpolate(z, [0, 1], [960, 690]);
  const py = interpolate(z, [0, 1], [536, 500]);
  const saved = frame >= 236;
  const row = interpolate(frame, [236, 256], [0, 1], {
    ...clamp,
    easing: slow,
  });
  // the sigh: the mic rings slow down and dim between "terus…" and "bayar"
  const sigh = interpolate(frame, [92, 100, 116, 124], [0, 1, 1, 0], clamp);

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
          opacity: interpolate(frame, [172, 186], [0, 1], clamp),
        }}
      >
        <DarkScreen glow={z}>
          <CatatScreen
            transcript={<Transcript />}
            listening={interpolate(
              frame,
              [172, 180, 226, 234],
              [1, 1, 1, 0],
              clamp,
            )}
            frame={frame}
            composer={
              saved ? (
                <VoiceResult
                  style={{ opacity: row, translate: `0px ${(1 - row) * 16}px` }}
                />
              ) : undefined
            }
          />
        </DarkScreen>
      </div>

      {/* text-only beat: mic + the words as they are spoken */}
      <div
        style={{
          position: "absolute",
          left: 912,
          top: 290,
          width: 96,
          height: 96,
          ...veil(frame, 0, 174, 20, 12, 0),
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
                border: `2px solid rgba(52,211,153,${0.6 * (1 - p) * (1 - 0.6 * sigh)})`,
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
            opacity: 1 - 0.35 * sigh,
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
          left: 0,
          right: 0,
          top: 450,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: BIG,
          fontWeight: 500,
          letterSpacing: -BIG * 0.025,
          lineHeight: 1.3,
          color: INK,
          whiteSpace: "pre",
          opacity: interpolate(frame, [176, 186], [1, 0], clamp),
        }}
      >
        <div>
          <Words words={LINE1} frame={frame} />
        </div>
        <div>
          <Words words={LINE2} frame={frame} />
        </div>
      </div>

      <GlowLine
        words={[{ t: "Cukup" }, { t: " ngomong." }]}
        at={246}
        stagger={8}
        size={100}
        style={{ position: "absolute", left: 1050, top: 470 }}
      />
    </AbsoluteFill>
  );
};
