import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../../theme";
import { CatatScreen, TxRow } from "../../components/AppUI";
import { Cursor } from "../../film/ui";
import {
  AppIcon,
  DarkScreen,
  GlowLine,
  NightBg,
  clamp,
  glide,
  slow,
} from "../kit";

/** Catat after tapping the notification: the payment is already filled in (shared with N5 for a seamless cut). */
export const NotifResult: React.FC<{ style?: React.CSSProperties }> = ({
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
    <div style={{ fontSize: 12.5, color: C.blue }}>
      Dari notifikasi · cek lagi ya
    </div>
    <TxRow
      style={{ margin: "0 -6px" }}
      highlight={1}
      tx={{
        icon: "screenshot",
        title: "Kopi Senja",
        wallet: "BCA",
        cat: "Makan & Minum",
        amount: 45000,
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
      Simpan 1 transaksi · Rp 45.000
    </div>
  </div>
);

export const NotifCatat: React.FC<{ frame: number }> = ({ frame }) => (
  <CatatScreen
    transcript={<span style={{ color: C.muted }}>Kopi 28rb pakai BCA</span>}
    listening={0}
    frame={frame}
    composer={<NotifResult />}
  />
);

/** The "Simpan" button inside DarkScreen (local px) and the phone's centre. */
export const SAVE_PIN = { x: 202.5, y: 426 };
export const PHONE_MID = { x: 208.5, y: 438 };

/** Outer transform that puts DarkScreen point SAVE_PIN at (px, py) at scale s. */
export const pinned = (s: number, px: number, py: number) =>
  `translate(${px - SAVE_PIN.x * s}px, ${py - SAVE_PIN.y * s}px) scale(${s})`;

const Banner: React.FC = () => (
  <div
    style={{
      width: 820,
      padding: "26px 30px",
      borderRadius: 40,
      background: "rgba(40,44,48,0.72)",
      border: "1.5px solid rgba(255,255,255,0.12)",
      backdropFilter: "blur(30px)",
      boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
      display: "flex",
      gap: 24,
      alignItems: "center",
      fontFamily: FONT,
      color: C.text,
    }}
  >
    <AppIcon size={86} />
    <div style={{ flex: 1 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 28,
        }}
      >
        <b>Sangu</b>
        <span style={{ color: "rgba(255,255,255,0.5)" }}>sekarang</span>
      </div>
      <div style={{ fontSize: 30, marginTop: 4 }}>
        Bukti bayar baru · Rp 45.000 · Kopi Senja
      </div>
      <div
        style={{ fontSize: 26, color: "rgba(255,255,255,0.6)", marginTop: 2 }}
      >
        Ketuk untuk cek & simpan
      </div>
    </div>
  </div>
);

// Pay as usual → a notification drops in → tap → Catat opens filled in → close-up on "Simpan" and a tap.
// Ends on the close-up that N5 starts from. 195 frames.
export const N4cNotif: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = interpolate(frame, [40, 64], [0, 1], { ...clamp, easing: slow });
  const tap = interpolate(frame, [76, 88], [0, 1], clamp);
  const morph = interpolate(frame, [88, 112], [0, 1], {
    ...clamp,
    easing: glide,
  });
  const settle = interpolate(frame, [104, 130], [0, 1], {
    ...clamp,
    easing: glide,
  });
  const push = interpolate(frame, [152, 184], [0, 1], {
    ...clamp,
    easing: glide,
  });

  // phone centre while it is whole on screen, then the push-in onto the button
  const midX = interpolate(settle, [0, 1], [960, 700]);
  const s =
    morph < 1
      ? interpolate(morph, [0, 1], [1.25, 1])
      : interpolate(push, [0, 1], [1, 3]);
  const px = interpolate(
    push,
    [0, 1],
    [midX - (PHONE_MID.x - SAVE_PIN.x), 960],
  );
  const py = interpolate(push, [0, 1], [540 - (PHONE_MID.y - SAVE_PIN.y), 600]);

  return (
    <AbsoluteFill>
      <NightBg
        x={interpolate(frame, [104, 130, 152, 184], [50, 36, 36, 50], clamp)}
        light={interpolate(frame, [0, 40], [0.6, 1], clamp)}
      />
      <GlowLine
        words={[{ t: "Bayar" }, { t: " seperti" }, { t: " biasa." }]}
        at={4}
        out={40}
        stagger={6}
        size={96}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />

      {/* the notification drops in, gets tapped, and grows into the app */}
      <div
        style={{
          position: "absolute",
          left: 550,
          top: interpolate(drop, [0, 1], [-200, 380]),
          opacity: drop * (1 - morph),
          scale: String(
            (1 - 0.03 * Math.sin(Math.PI * tap)) * (1 + morph * 0.25),
          ),
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
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: pinned(s, px, py),
          opacity: morph,
          filter: morph < 1 ? `blur(${(1 - morph) * 16}px)` : undefined,
        }}
      >
        <DarkScreen glow={morph * (1 - push)}>
          <NotifCatat frame={frame} />
        </DarkScreen>
      </div>

      <GlowLine
        words={[{ t: "Notif" }, { t: " masuk," }]}
        at={124}
        out={150}
        stagger={7}
        size={100}
        style={{ position: "absolute", left: 1060, top: 410 }}
      />
      <GlowLine
        words={[{ t: "tinggal" }, { t: " simpan." }]}
        at={134}
        out={150}
        stagger={7}
        size={100}
        style={{ position: "absolute", left: 1060, top: 530, color: "#9FE9C8" }}
      />

      <Cursor
        x={interpolate(frame, [168, 182], [1180, 980], {
          ...clamp,
          easing: glide,
        })}
        y={interpolate(frame, [168, 182], [820, 612], {
          ...clamp,
          easing: glide,
        })}
        press={interpolate(frame, [183, 193], [0, 1], clamp)}
        opacity={interpolate(frame, [166, 172], [0, 1], clamp)}
        size={46}
      />
    </AbsoluteFill>
  );
};
