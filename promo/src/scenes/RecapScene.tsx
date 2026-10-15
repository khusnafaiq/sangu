import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { C, FONT } from "../theme";
import { Icon } from "../components/Icon";

// Spending this period (sums to Rp 1.336.500 = "Keluar 1,34 jt" on the home screen).
const CATS = [
  { name: "Makan & Minum", value: "452 rb", pct: 34, color: C.green },
  { name: "Kebutuhan Harian", value: "321 rb", pct: 24, color: C.yellow },
  { name: "Transportasi", value: "214 rb", pct: 16, color: C.blue },
  { name: "Tagihan", value: "187 rb", pct: 14, color: C.pink },
  { name: "Hiburan", value: "163 rb", pct: 12, color: C.orange },
];

// Last 28 days: 0 = kosong, 1 = tercatat, 2 = hemat. Ends on a 7-day "hemat" streak.
const DAYS = [0, 1, 1, 0, 2, 1, 0, 1, 2, 2, 1, 0, 1, 1, 2, 1, 0, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2];
const STREAK_FROM = 21;

export const RecapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [12, 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const lit = interpolate(frame, [62, 108], [0, DAYS.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const streak = Math.max(0, Math.min(7, Math.floor(lit) - STREAK_FROM));

  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text }}>
      <Audio name="Whoosh" src={staticFile("audio/sfx-whoosh.wav")} volume={0.44} />
      <Audio name="Rows" src={staticFile("audio/sfx-pops.wav")} from={22} volume={0.32} />
      <Audio name="Streak ticks" src={staticFile("audio/sfx-streak.wav")} from={62} volume={0.36} />
      <Audio name="Streak ding" src={staticFile("audio/sfx-ding.wav")} from={108} volume={0.48} />

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
        Lihat ke mana
        <br />
        uangmu <span style={{ color: C.green }}>pergi.</span>
      </Interactive.Div>

      <Interactive.Div
        name="Recap card"
        style={{
          position: "absolute",
          top: 450,
          left: 70,
          right: 70,
          padding: "44px 48px 30px",
          borderRadius: 48,
          background: "rgba(18,18,21,0.88)",
          border: "2px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          opacity: interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [4, 26], ["0px 120px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 38, color: C.text2, fontWeight: 600 }}>Rekapan pengeluaran</span>
          <span style={{ fontSize: 32, color: C.muted }}>25 Sep – 24 Okt</span>
        </div>
        <div style={{ fontSize: 34, color: C.text2, marginTop: 14 }}>
          Keluar <b style={{ color: C.text }}>Rp 1.336.500</b> dari Rp 4.500.000
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 28, height: 26, width: `${bar * 100}%` }}>
          {CATS.map((c) => (
            <div key={c.name} style={{ flex: c.pct, background: c.color, borderRadius: 13 }} />
          ))}
        </div>
        <div style={{ marginTop: 18 }}>
          {CATS.map((c, i) => (
            <div
              key={c.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "20px 0",
                borderBottom: i < CATS.length - 1 ? `2px solid ${C.border}` : "none",
                fontSize: 38,
                opacity: interpolate(frame, [20 + i * 5, 28 + i * 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                translate: `${interpolate(frame, [20 + i * 5, 36 + i * 5], [40, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) })}px 0px`,
              }}
            >
              <span style={{ width: 16, height: 16, borderRadius: 8, background: c.color }} />
              <span style={{ flex: 1, color: C.text2 }}>{c.name}</span>
              <span style={{ fontWeight: 700 }}>{c.value}</span>
              <span style={{ width: 96, textAlign: "right", color: C.muted }}>{c.pct}%</span>
            </div>
          ))}
        </div>
      </Interactive.Div>

      <Interactive.Div
        name="Streak card"
        style={{
          position: "absolute",
          top: 1330,
          left: 70,
          right: 70,
          padding: "40px 48px 40px",
          borderRadius: 48,
          background: "rgba(18,18,21,0.88)",
          border: "2px solid rgba(255,255,255,0.08)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          opacity: interpolate(frame, [50, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          translate: interpolate(frame, [50, 70], ["0px 120px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 38, color: C.text2, fontWeight: 600 }}>Disiplin 28 hari</span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 38,
              fontWeight: 700,
              color: C.green,
              opacity: interpolate(lit, [STREAK_FROM, STREAK_FROM + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            }}
          >
            <Icon name="flame" size={40} color={C.orange} strokeWidth={2.2} />
            {streak} hari beruntun
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 10, marginTop: 30 }}>
          {DAYS.map((d, i) => {
            const on = interpolate(lit, [i, i + 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            const isStreak = i >= STREAK_FROM;
            const fill = d === 2 ? C.green : d === 1 ? "#1f5c47" : C.surface1;
            return (
              <div
                key={i}
                style={{
                  aspectRatio: "1",
                  borderRadius: 12,
                  border: `2px solid ${d === 0 ? C.surface3 : "rgba(52,211,153,0.35)"}`,
                  background: on > 0.5 ? fill : C.surface1,
                  opacity: d === 2 && !isStreak ? 0.8 : 1,
                  scale: String(1 + 0.25 * Math.sin(on * Math.PI)),
                  boxShadow: isStreak && on > 0.5 ? "0 0 22px rgba(52,211,153,0.55)" : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 34, marginTop: 26, fontSize: 30, color: C.text2 }}>
          {[
            ["Kosong", C.surface1, C.surface3],
            ["Tercatat", "#1f5c47", "rgba(52,211,153,0.35)"],
            ["Hemat", C.green, C.green],
          ].map(([label, bg, bd]) => (
            <span key={label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 26, height: 26, borderRadius: 8, background: bg, border: `2px solid ${bd}` }} />
              {label}
            </span>
          ))}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
