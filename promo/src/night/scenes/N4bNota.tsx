import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../../theme";
import { TxRow } from "../../components/AppUI";
import { Icon } from "../../components/Icon";
import { GLOW, GlowLine, NightBg, clamp, glide, slow } from "../kit";

const ITEMS: [string, string][] = [
  ["INDOMIE GRG x5", "17.500"],
  ["SUSU UHT 1L", "19.900"],
  ["SABUN CAIR", "32.900"],
  ["BERAS 5KG", "74.900"],
  ["TELUR 1KG", "42.300"],
];

const Receipt: React.FC<{ found: number }> = ({ found }) => (
  <div
    style={{
      width: 440,
      padding: "34px 36px 56px",
      background: "linear-gradient(170deg, #F1EFE8 0%, #D9D6CC 100%)",
      color: "#26262B",
      fontFamily: FONT,
      fontVariantNumeric: "tabular-nums",
      fontSize: 22,
      lineHeight: 1.55,
      clipPath:
        "polygon(0 0, 100% 0, 100% 97%, 95% 100%, 90% 97%, 85% 100%, 80% 97%, 75% 100%, 70% 97%, 65% 100%, 60% 97%, 55% 100%, 50% 97%, 45% 100%, 40% 97%, 35% 100%, 30% 97%, 25% 100%, 20% 97%, 15% 100%, 10% 97%, 5% 100%, 0 97%)",
    }}
  >
    <div
      style={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 2,
      }}
    >
      INDOMARET
    </div>
    <div
      style={{
        textAlign: "center",
        fontSize: 18,
        opacity: 0.65,
        marginBottom: 10,
      }}
    >
      14.10.2026 19:30
    </div>
    <div style={{ borderTop: "2px dashed #8f8f8f", margin: "6px 0 10px" }} />
    {ITEMS.map(([n, p]) => (
      <div key={n} style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{n}</span>
        <span>{p}</span>
      </div>
    ))}
    <div style={{ borderTop: "2px dashed #8f8f8f", margin: "10px 0 8px" }} />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontWeight: 700,
        fontSize: 27,
        padding: "4px 10px",
        margin: "0 -10px",
        borderRadius: 8,
        background: `rgba(52,211,153,${0.3 * found})`,
        boxShadow: `0 0 0 3px rgba(16,185,129,${found}), 0 0 30px rgba(52,211,153,${0.5 * found})`,
      }}
    >
      <span>TOTAL</span>
      <span>187.500</span>
    </div>
  </div>
);

// A generic payment-proof screenshot (no real e-wallet branding).
const Proof: React.FC<{ found: number }> = ({ found }) => (
  <div
    style={{
      width: 360,
      height: 640,
      borderRadius: 44,
      background: "linear-gradient(180deg, #16191C 0%, #0E1012 100%)",
      border: "2px solid rgba(255,255,255,0.08)",
      fontFamily: FONT,
      color: C.text,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "70px 30px 0",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 42,
        background: "rgba(52,211,153,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name="check" size={44} color={C.green} strokeWidth={2.6} />
    </div>
    <div style={{ fontSize: 24, color: C.text2, marginTop: 6 }}>
      Pembayaran berhasil
    </div>
    <div
      style={{
        fontSize: 52,
        fontWeight: 800,
        letterSpacing: -1.5,
        padding: "2px 14px",
        borderRadius: 14,
        textShadow:
          found > 0
            ? `0 0 ${24 * found}px rgba(52,211,153,${0.8 * found})`
            : undefined,
        boxShadow: `0 0 0 3px rgba(52,211,153,${found})`,
      }}
    >
      Rp 45.000
    </div>
    <div style={{ fontSize: 24, fontWeight: 600 }}>Kopi Senja</div>
    <div
      style={{
        width: "100%",
        height: 1,
        background: "rgba(255,255,255,0.08)",
        margin: "18px 0 6px",
      }}
    />
    {[
      ["Metode", "QRIS"],
      ["Waktu", "16 Okt 2026 · 08.12"],
      ["Sumber dana", "BCA"],
    ].map(([k, v]) => (
      <div
        key={k}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 19,
          color: C.text2,
        }}
      >
        <span>{k}</span>
        <span style={{ color: C.text }}>{v}</span>
      </div>
    ))}
  </div>
);

// 0:21 — a receipt and a payment screenshot are scanned; their totals land as two transactions.
export const N4bNota: React.FC = () => {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [16, 62], [0, 1], {
    ...clamp,
    easing: glide,
  });
  const found = interpolate(frame, [52, 62], [0, 1], clamp);
  const gone = interpolate(frame, [76, 96], [0, 1], { ...clamp, easing: slow });
  const land = interpolate(frame, [84, 122], [0, 1], {
    ...clamp,
    easing: glide,
  });
  const docIn = (at: number) =>
    interpolate(frame, [at, at + 24], [0, 1], { ...clamp, easing: slow });

  return (
    <AbsoluteFill>
      <NightBg />
      <GlowLine
        words={[
          { t: "Nota" },
          { t: " atau" },
          { t: " screenshot," },
          { t: " kebaca sendiri.", color: "#9FE9C8", glow: GLOW.green },
        ]}
        at={6}
        stagger={6}
        size={76}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          textAlign: "center",
        }}
      />

      {/* the two documents */}
      <div
        style={{
          position: "absolute",
          left: 430,
          top: 290,
          rotate: "-5deg",
          opacity: docIn(0) * (1 - gone),
          filter:
            gone > 0 || docIn(0) < 1
              ? `blur(${gone * 16 + (1 - docIn(0)) * 16}px) brightness(0.92)`
              : "brightness(0.92)",
          translate: `0px ${(1 - docIn(0)) * 40}px`,
        }}
      >
        <Receipt found={found} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 1110,
          top: 270,
          rotate: "5deg",
          opacity: docIn(8) * (1 - gone),
          filter:
            gone > 0 || docIn(8) < 1
              ? `blur(${gone * 16 + (1 - docIn(8)) * 16}px)`
              : undefined,
          translate: `0px ${(1 - docIn(8)) * 40}px`,
        }}
      >
        <Proof found={found} />
      </div>

      {/* one scan line across both */}
      <div
        style={{
          position: "absolute",
          left: 330,
          right: 330,
          top: 280 + scan * 640,
          height: 4,
          borderRadius: 2,
          background: C.green,
          boxShadow: "0 0 28px 8px rgba(52,211,153,0.5)",
          opacity: interpolate(frame, [14, 20, 58, 66], [0, 1, 1, 0], clamp),
        }}
      />

      {/* the totals land in the app's list */}
      <div
        style={{
          position: "absolute",
          left: 560,
          top: 470,
          width: 800,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {[
          {
            tx: {
              icon: "receipt" as const,
              title: "Indomaret",
              wallet: "BCA",
              cat: "Kebutuhan Harian",
              amount: 187500,
            },
            from: [-230, 300],
          },
          {
            tx: {
              icon: "screenshot" as const,
              title: "Kopi Senja",
              wallet: "BCA",
              cat: "Makan & Minum",
              amount: 45000,
            },
            from: [390, -90],
          },
        ].map((r, i) => {
          const p = interpolate(frame, [84 + i * 6, 122 + i * 6], [0, 1], {
            ...clamp,
            easing: glide,
          });
          return (
            <div
              key={r.tx.title}
              style={{
                transformOrigin: "50% 50%",
                transform: `translate(${(1 - p) * r.from[0]}px, ${(1 - p) * r.from[1]}px) scale(${2 * (0.5 + 0.5 * p)})`,
                opacity: interpolate(
                  frame,
                  [80 + i * 6, 92 + i * 6],
                  [0, 1],
                  clamp,
                ),
                filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
                width: 400,
                marginLeft: 200,
                borderRadius: 16,
                background: "rgba(18,18,21,0.92)",
                border: "1px solid rgba(52,211,153,0.35)",
                boxShadow: `0 0 ${40 * land}px rgba(52,211,153,0.18)`,
                fontFamily: FONT,
                color: C.text,
                marginBottom: 44,
              }}
            >
              <TxRow tx={r.tx} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
