import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT } from "../theme";
import { Phone } from "../components/Phone";
import { CatatScreen, TxRow } from "../components/AppUI";
import { Icon } from "../components/Icon";

const SPOKEN = "Kopi susu 28rb pakai GoPay dan parkir 5rb";
const DAN_AT = SPOKEN.indexOf(" dan ") + 1;

// Voice capture: one sentence, split on "dan" into two transactions.
export const VoiceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const listening = interpolate(frame, [12, 18, 70, 76], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const typed = Math.floor(interpolate(frame, [18, 68], [0, SPOKEN.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const shown = SPOKEN.slice(0, typed);
  const caret = frame < 76 && Math.floor(frame / 8) % 2 === 0;

  const transcript =
    typed === 0 ? (
      <span style={{ color: C.muted }}>Kopi 28rb pakai BCA</span>
    ) : (
      <>
        {shown.slice(0, Math.min(typed, DAN_AT))}
        {typed > DAN_AT ? <span style={{ color: C.green, fontWeight: 700 }}>{shown.slice(DAN_AT, Math.min(typed, DAN_AT + 3))}</span> : null}
        {typed > DAN_AT + 3 ? shown.slice(DAN_AT + 3) : null}
        {caret ? <span style={{ color: C.green }}>|</span> : null}
      </>
    );

  const row = (start: number) => ({
    opacity: interpolate(frame, [start, start + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    translate: `0px ${interpolate(frame, [start, start + 16], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
  });

  const composer =
    frame >= 78 ? (
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontSize: 12.5, color: C.text2, ...row(78) }}>2 transaksi terbaca · cek lalu simpan</div>
        <TxRow
          style={{ ...row(80), margin: "0 -6px" }}
          highlight={1}
          tx={{ icon: "mic", title: "Kopi susu", wallet: "GoPay", cat: "Makan & Minum", amount: 28000 }}
        />
        <TxRow
          style={{ ...row(88), margin: "0 -6px" }}
          highlight={1}
          tx={{ icon: "mic", title: "Parkir", wallet: "GoPay", cat: "Transportasi", amount: 5000 }}
        />
        <div
          style={{
            marginTop: 10,
            height: 50,
            borderRadius: 16,
            background: C.text,
            color: C.bg,
            fontSize: 16,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...row(96),
            scale: String(interpolate(frame, [106, 109, 113], [1, 0.94, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })),
          }}
        >
          Simpan 2 transaksi · Rp 33.000
        </div>
      </div>
    ) : undefined;

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <Audio name="Whoosh" src={staticFile("audio/sfx-whoosh.wav")} volume={0.44} />
      <Audio name="Mic on" src={staticFile("audio/sfx-tap.wav")} from={11} volume={0.64} />
      <Audio name="Typing" src={staticFile("audio/sfx-typing.wav")} from={18} volume={0.32} />
      <Audio name="Pop 1" src={staticFile("audio/sfx-pop.wav")} from={80} volume={0.48} />
      <Audio name="Pop 2" src={staticFile("audio/sfx-pop.wav")} from={88} volume={0.48} />
      <Audio name="Tap save" src={staticFile("audio/sfx-tap.wav")} from={107} volume={0.64} />
      <Audio name="Ding" src={staticFile("audio/sfx-ding.wav")} from={112} volume={0.48} />

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
        Catat secepat
        <br />
        <span style={{ color: C.green }}>ngomong.</span>
      </Interactive.Div>

      <Interactive.Div
        name="Phone"
        style={{
          position: "absolute",
          top: 430,
          left: 331,
          transformOrigin: "50% 0%",
          scale: "1.72",
          translate: interpolate(frame, [0, 22], ["0px 140px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <Phone>
          <CatatScreen transcript={transcript} listening={listening} frame={frame} composer={composer} />
        </Phone>
      </Interactive.Div>

      <Interactive.Div
        name="Saved toast"
        style={{
          position: "absolute",
          top: 1560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [112, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [112, 128], ["0px 60px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "26px 44px 26px 28px",
            borderRadius: 999,
            background: "rgba(18,18,21,0.9)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(52,211,153,0.4)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: -1,
          }}
        >
          <div style={{ width: 72, height: 72, borderRadius: 36, background: C.green, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={40} color={C.bg} strokeWidth={3} />
          </div>
          Tersimpan. Beres.
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
