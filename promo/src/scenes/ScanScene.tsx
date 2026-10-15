import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT, MONO } from "../theme";
import { Icon, IconName } from "../components/Icon";

const ITEMS: [string, string][] = [
  ["AQUA 600ML", "4.000"],
  ["INDOMIE GRG x5", "17.500"],
  ["SUSU UHT 1L", "19.900"],
  ["ROTI TAWAR", "16.500"],
  ["SABUN CAIR", "32.900"],
  ["BERAS 5KG", "74.900"],
  ["TELUR 1KG", "21.800"],
];

const METHODS: [IconName, string][] = [
  ["mic", "Suara"],
  ["pen", "Ketik"],
  ["receipt", "Foto nota"],
  ["screenshot", "Screenshot"],
];

const CORNERS: React.CSSProperties[] = [
  { top: 0, left: 0, borderTopWidth: 8, borderLeftWidth: 8, borderTopLeftRadius: 40 },
  { top: 0, right: 0, borderTopWidth: 8, borderRightWidth: 8, borderTopRightRadius: 40 },
  { bottom: 0, left: 0, borderBottomWidth: 8, borderLeftWidth: 8, borderBottomLeftRadius: 40 },
  { bottom: 0, right: 0, borderBottomWidth: 8, borderRightWidth: 8, borderBottomRightRadius: 40 },
];

// Receipt OCR (on-device) + the other ways to log.
export const ScanScene: React.FC = () => {
  const frame = useCurrentFrame();
  const scanY = interpolate(frame, [14, 50], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) });
  const found = interpolate(frame, [48, 56], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <Audio name="Whoosh" src={staticFile("audio/sfx-whoosh.wav")} volume={0.44} />
      <Audio name="Shutter" src={staticFile("audio/sfx-shutter.wav")} from={10} volume={0.56} />
      <Audio name="Scan" src={staticFile("audio/sfx-scan.wav")} from={14} volume={0.32} />
      <Audio name="Found" src={staticFile("audio/sfx-ding.wav")} from={52} volume={0.4} />
      <Audio name="Pop card" src={staticFile("audio/sfx-pop.wav")} from={60} volume={0.48} />
      <Audio name="Pills" src={staticFile("audio/sfx-pops.wav")} from={78} volume={0.4} />

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
        Foto nota?
        <br />
        <span style={{ color: C.green }}>Langsung kebaca.</span>
      </Interactive.Div>

      <Interactive.Div
        name="Receipt"
        style={{
          position: "absolute",
          top: 440,
          left: 250,
          width: 580,
          rotate: interpolate(frame, [0, 24], ["-9deg", "-3deg"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          translate: interpolate(frame, [0, 24], ["0px 160px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
          scale: interpolate(frame, [56, 72], [1, 0.94], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
          opacity: interpolate(frame, [0, 8, 58, 72], [0, 1, 1, 0.45], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            background: "#F3F2EC",
            color: "#26262B",
            fontFamily: MONO,
            fontSize: 27,
            lineHeight: 1.5,
            padding: "40px 44px 70px",
            clipPath:
              "polygon(0 0, 100% 0, 100% 97%, 95% 100%, 90% 97%, 85% 100%, 80% 97%, 75% 100%, 70% 97%, 65% 100%, 60% 97%, 55% 100%, 50% 97%, 45% 100%, 40% 97%, 35% 100%, 30% 97%, 25% 100%, 20% 97%, 15% 100%, 10% 97%, 5% 100%, 0 97%)",
            boxShadow: "0 40px 90px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ textAlign: "center", fontWeight: 700, fontSize: 36, letterSpacing: 2 }}>INDOMARET</div>
          <div style={{ textAlign: "center", fontSize: 22, opacity: 0.7 }}>JL. KALIURANG KM 5</div>
          <div style={{ textAlign: "center", fontSize: 22, opacity: 0.7, marginBottom: 14 }}>14.10.2026 19:30</div>
          <div style={{ borderTop: "2px dashed #9a9a9a", margin: "6px 0 12px" }} />
          {ITEMS.map(([name, price]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between" }}>
              <span>{name}</span>
              <span>{price}</span>
            </div>
          ))}
          <div style={{ borderTop: "2px dashed #9a9a9a", margin: "12px 0 10px" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 32,
              padding: "6px 12px",
              margin: "0 -12px",
              borderRadius: 10,
              background: `rgba(52,211,153,${0.28 * found})`,
              boxShadow: `0 0 0 3px rgba(16,185,129,${found})`,
            }}
          >
            <span>TOTAL</span>
            <span>187.500</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 22, opacity: 0.7, marginTop: 18 }}>TERIMA KASIH</div>
        </div>

        {/* scan line */}
        <div
          style={{
            position: "absolute",
            left: -30,
            right: -30,
            top: `${scanY * 100}%`,
            height: 6,
            borderRadius: 3,
            background: C.green,
            boxShadow: "0 0 30px 8px rgba(52,211,153,0.55)",
            opacity: interpolate(frame, [12, 16, 50, 56], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        />
      </Interactive.Div>

      {/* viewfinder corners */}
      <Interactive.Div
        name="Viewfinder"
        style={{
          position: "absolute",
          top: 400,
          left: 190,
          width: 700,
          height: 760,
          opacity: interpolate(frame, [6, 12, 54, 62], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          scale: interpolate(frame, [6, 18], [1.12, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1), output: "perceptual-scale" }),
        }}
      >
        {CORNERS.map((c, i) => (
          <div
            key={i}
            style={{ position: "absolute", width: 110, height: 110, borderColor: C.green, borderStyle: "solid", borderWidth: 0, ...c }}
          />
        ))}
      </Interactive.Div>

      <Interactive.Div
        name="Result card"
        style={{
          position: "absolute",
          top: 1190,
          left: 80,
          right: 80,
          padding: "34px 40px",
          borderRadius: 44,
          background: "rgba(18,18,21,0.92)",
          backdropFilter: "blur(20px)",
          border: "2px solid rgba(52,211,153,0.4)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(52,211,153,0.14)",
          opacity: interpolate(frame, [58, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [58, 76], ["0px 100px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: 28,
              background: "rgba(52,211,153,0.12)",
              border: "2px solid rgba(52,211,153,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="receipt" size={46} color={C.green} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 50, fontWeight: 700, letterSpacing: -1.5 }}>Indomaret</div>
            <div style={{ fontSize: 30, color: C.text2, marginTop: 4, whiteSpace: "nowrap" }}>BCA · Kebutuhan Harian</div>
          </div>
          <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1.8 }}>-Rp 187.500</div>
        </div>
        <div style={{ marginTop: 26, paddingTop: 22, borderTop: `2px solid ${C.border}`, fontSize: 32, color: C.text2, display: "flex", alignItems: "center", gap: 14 }}>
          <Icon name="shield" size={36} color={C.green} strokeWidth={2} />
          Dibaca langsung di HP kamu. Foto tidak disimpan.
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Methods"
        style={{
          position: "absolute",
          top: 1610,
          left: 80,
          right: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 26,
          opacity: interpolate(frame, [74, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 600, color: C.text2 }}>4 cara catat, pilih yang paling cepat:</div>
        <div style={{ display: "flex", gap: 12 }}>
          {METHODS.map(([icon, label], i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "16px 22px",
                borderRadius: 999,
                background: C.surface2,
                border: `2px solid ${i === 2 ? "rgba(52,211,153,0.5)" : C.borderHover}`,
                fontSize: 30,
                fontWeight: 600,
                whiteSpace: "nowrap",
                opacity: interpolate(frame, [78 + i * 4, 86 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                translate: `0px ${interpolate(frame, [78 + i * 4, 94 + i * 4], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px`,
              }}
            >
              <Icon name={icon} size={30} color={i === 2 ? C.green : C.text} strokeWidth={2} />
              {label}
            </div>
          ))}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
