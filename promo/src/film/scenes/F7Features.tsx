import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, FONT } from "../../theme";
import { Icon, IconName } from "../../components/Icon";
import { Glass, L, LightBg, TypeText } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Chip: React.FC<{ icon: IconName; label: string }> = ({ icon, label }) => (
  <Glass style={{ display: "flex", alignItems: "center", gap: 14, padding: "20px 28px", borderRadius: 999, fontSize: 32, fontWeight: 600, color: L.ink2 }}>
    <Icon name={icon} size={34} color={L.accent} strokeWidth={2} />
    {label}
  </Glass>
);

type Float = { x: number; y: number; depth: number; at: number; node: React.ReactNode };

const FLOATS: Float[] = [
  {
    x: 110,
    y: 90,
    depth: 1.05,
    at: 4,
    node: (
      <Glass style={{ width: 660, padding: "22px 26px", borderRadius: 34, display: "flex", gap: 18, alignItems: "center", background: "rgba(255,255,255,0.72)" }}>
        <div style={{ width: 70, height: 70, borderRadius: 18, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Img src={staticFile("brand/logo-mark-512.png")} style={{ width: 52, height: 52 }} />
        </div>
        <div>
          <div style={{ fontSize: 26, color: L.ink3 }}>
            <b style={{ color: L.ink }}>Sangu</b> · sekarang
          </div>
          <div style={{ fontSize: 28, color: L.ink, marginTop: 4 }}>Bukti bayar baru. Ketuk untuk catat.</div>
        </div>
      </Glass>
    ),
  },
  { x: 860, y: 190, depth: 1, at: 10, node: <Chip icon="shield" label="Tanpa login" /> },
  {
    x: 1270,
    y: 80,
    depth: 1,
    at: 8,
    node: (
      <Glass style={{ width: 420, padding: "26px 30px", borderRadius: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 30, color: L.ink2 }}>
          <Icon name="receipt" size={36} color={L.accent} strokeWidth={1.8} /> Foto nota
        </div>
        <div style={{ fontSize: 40, fontWeight: 700, marginTop: 10 }}>Rp 187.500</div>
        <div style={{ fontSize: 24, color: L.ink3, marginTop: 4 }}>Total terbaca otomatis</div>
      </Glass>
    ),
  },
  { x: 1520, y: 340, depth: 0.97, at: 14, node: <Chip icon="offline" label="Bisa offline" /> },
  {
    x: 30,
    y: 330,
    depth: 0.9,
    at: 12,
    node: (
      <Glass dark style={{ width: 380, padding: "24px 28px", borderRadius: 32 }}>
        <div style={{ fontSize: 24, color: C.text2 }}>Aman dipakai hari ini</div>
        <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: -1.5, marginTop: 4 }}>Rp 316.350</div>
      </Glass>
    ),
  },
  {
    x: 1420,
    y: 640,
    depth: 1.08,
    at: 16,
    node: (
      <Glass style={{ width: 400, padding: "24px 28px", borderRadius: 32, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: L.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="mic" size={30} color="#fff" strokeWidth={2} />
        </div>
        <div style={{ fontSize: 28, color: L.ink, fontStyle: "italic", whiteSpace: "nowrap" }}>“Kopi 28rb pakai BCA”</div>
      </Glass>
    ),
  },
  {
    x: 90,
    y: 720,
    depth: 1.1,
    at: 18,
    node: (
      <Glass style={{ width: 400, padding: "26px 30px", borderRadius: 34 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 30, color: L.ink2 }}>
          <Icon name="flame" size={34} color={C.orange} strokeWidth={2} /> Disiplin
        </div>
        <div style={{ fontSize: 42, fontWeight: 700, marginTop: 8 }}>7 hari beruntun</div>
      </Glass>
    ),
  },
  {
    x: 590,
    y: 800,
    depth: 0.9,
    at: 20,
    node: (
      <Glass style={{ width: 440, padding: "26px 30px", borderRadius: 34 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ color: L.ink2 }}>Liburan Bali</span>
          <b>20%</b>
        </div>
        <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.8)", marginTop: 18 }}>
          <div style={{ width: "20%", height: "100%", borderRadius: 6, background: L.accent }} />
        </div>
      </Glass>
    ),
  },
  { x: 1100, y: 880, depth: 0.97, at: 22, node: <Chip icon="download" label="Backup sendiri" /> },
  {
    x: 1560,
    y: 860,
    depth: 0.9,
    at: 24,
    node: (
      <Glass style={{ width: 330, padding: "24px 28px", borderRadius: 32, textAlign: "center" }}>
        <div style={{ fontSize: 26, color: L.ink3 }}>Mata uang</div>
        <div style={{ fontSize: 36, fontWeight: 700, marginTop: 6 }}>IDR · USD · SGD</div>
      </Glass>
    ),
  },
];

// 0:20 — "Karena yang penting, kamu tenang." with features floating around (depth of field).
export const F7Features: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <LightBg />
      {FLOATS.map((f, i) => {
        const blur = Math.abs(f.depth - 1) * 22;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: f.x,
              top: f.y,
              scale: String(f.depth),
              filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
              opacity: interpolate(frame, [f.at, f.at + 14], [0, 1], clamp),
              translate: `${(frame - 60) * -0.25 * f.depth}px ${interpolate(frame, [f.at, f.at + 30], [50, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }) + Math.sin((frame + i * 20) / 22) * 6}px`,
            }}
          >
            {f.node}
          </div>
        );
      })}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <TypeText
          segs={[{ text: "Karena yang penting, " }, { text: "kamu tenang.", bold: true }]}
          start={18}
          cps={0.8}
          style={{ fontSize: 66, fontWeight: 500, letterSpacing: -1.5, marginTop: -40 }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
