import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../../theme";
import { CatatScreen, TxRow } from "../../components/AppUI";
import { AppIcon, DarkScreen, GlowLine, NightBg, clamp, glide, slow } from "../kit";

/** Catat after tapping the notification: the payment is already filled in (shared with N5 for a seamless cut). */
export const NotifResult: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10, ...style }}>
    <div style={{ fontSize: 12.5, color: C.blue }}>Dari notifikasi · cek lagi ya</div>
    <TxRow style={{ margin: "0 -6px" }} highlight={1} tx={{ icon: "screenshot", title: "Kopi Senja", wallet: "BCA", cat: "Makan & Minum", amount: 45000 }} />
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
      Simpan 1 transaksi · Rp 45.000
    </div>
  </div>
);

const Banner: React.FC = () => (
  <div
    style={{
      width: 820,
      padding: "26px 30px",
      borderRadius: 40,
      background: "rgba(40,44,48,0.72)",
      border: "1.5px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(30px)",
      boxShadow: "0 30px 90px rgba(0,0,0,0.6), 0 0 80px rgba(52,211,153,0.12)",
      display: "flex",
      gap: 24,
      alignItems: "center",
      fontFamily: FONT,
      color: C.text,
    }}
  >
    <AppIcon size={86} style={{ boxShadow: "none" }} />
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
        <b>Sangu</b>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>sekarang</span>
      </div>
      <div style={{ fontSize: 30, marginTop: 4 }}>Bukti bayar baru · Rp 45.000 · Kopi Senja</div>
      <div style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>Ketuk untuk cek & simpan</div>
    </div>
  </div>
);

// 0:26 — pay as usual, a notification arrives, tap: Catat opens with the payment filled in.
export const N4cNotif: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [40, 64], [0, 1], { ...clamp, easing: slow });
  const tap = interpolate(frame, [76, 88], [0, 1], clamp);
  const morph = interpolate(frame, [88, 112], [0, 1], { ...clamp, easing: glide });
  const settle = interpolate(frame, [104, 140], [0, 1], { ...clamp, easing: glide });

  return (
    <AbsoluteFill>
      <NightBg />
      <GlowLine words={[{ t: "Bayar" }, { t: " seperti" }, { t: " biasa." }]} at={4} out={40} stagger={6} size={96} style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center" }} />

      {/* the notification drops in, gets tapped, and grows into the app */}
      <div
        style={{
          position: "absolute",
          left: 550,
          top: interpolate(drop, [0, 1], [-200, 380]),
          opacity: drop * (1 - morph),
          scale: String((1 - 0.03 * Math.sin(Math.PI * tap)) * (1 + morph * 0.25)),
          filter: morph > 0 ? `blur(${morph * 18}px)` : undefined,
        }}
      >
        <Banner />
        <div
          style={{
            position: "absolute",
            left: 410 - 40 * (1 + tap),
            top: 80 - 40 * (1 + tap),
            width: 80 * (1 + tap),
            height: 80 * (1 + tap),
            borderRadius: "50%",
            border: `3px solid rgba(255,255,255,${0.7 * (1 - tap)})`,
            opacity: tap > 0 && tap < 1 ? 1 : 0,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: interpolate(settle, [0, 1], [960, 700]),
          top: 546,
          transform: `translate(-50%, -50%) scale(${interpolate(morph, [0, 1], [1.25, 1])})`,
          opacity: morph,
          filter: morph < 1 ? `blur(${(1 - morph) * 16}px)` : undefined,
        }}
      >
        <DarkScreen glow={morph}>
          <CatatScreen transcript={<span style={{ color: C.muted }}>Kopi 28rb pakai BCA</span>} listening={0} frame={frame} composer={<NotifResult />} />
        </DarkScreen>
      </div>

      <GlowLine words={[{ t: "Notif" }, { t: " masuk," }]} at={124} stagger={7} size={100} style={{ position: "absolute", left: 1060, top: 410 }} />
      <GlowLine words={[{ t: "tinggal" }, { t: " simpan." }]} at={134} stagger={7} size={100} style={{ position: "absolute", left: 1060, top: 530, color: "#9FE9C8" }} />
    </AbsoluteFill>
  );
};
