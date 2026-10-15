import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { Icon, IconName } from "../../components/Icon";
import { Glass, L, LightBg, TypeText } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const Label: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = L.ink2 }) => (
  <div style={{ fontSize: 30, fontWeight: 500, color }}>{children}</div>
);
const Value: React.FC<{ children: React.ReactNode; color?: string; size?: number }> = ({ children, color = L.ink, size = 40 }) => (
  <div style={{ fontSize: size, fontWeight: 600, color, letterSpacing: -0.8 }}>{children}</div>
);
const IconTile: React.FC<{ name: IconName }> = ({ name }) => (
  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <Icon name={name} size={54} color={L.ink2} strokeWidth={1.5} />
  </div>
);

type Tile = { x: number; y: number; w: number; h: number; depth: number; body: React.ReactNode };

// Sangu's UI, exploded into frosted tiles ("money apps all look the same").
const TILES: Tile[] = [
  { x: -70, y: 50, w: 420, h: 160, depth: 0.6, body: (<><Label>Aman dipakai hari ini</Label><Value>Rp 316.350</Value></>) },
  { x: -70, y: 240, w: 420, h: 160, depth: 0.9, body: (<><Label>Sisa 10 hari</Label><Value size={34}>25 Sep – 24 Okt</Value></>) },
  {
    x: 390,
    y: 50,
    w: 520,
    h: 350,
    depth: 1,
    body: (
      <>
        <Label>Sumber dana</Label>
        {[
          ["BCA", "Rp 2.480.000", C.blue],
          ["GoPay", "Rp 412.000", C.green],
          ["Cash", "Rp 270.000", C.yellow],
        ].map(([n, v, c]) => (
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 26, fontSize: 32 }}>
            <span style={{ width: 12, height: 12, borderRadius: 6, background: c }} />
            <span style={{ color: L.ink2 }}>{n}</span>
            <span style={{ marginLeft: "auto", fontWeight: 600, color: L.ink }}>{v}</span>
          </div>
        ))}
      </>
    ),
  },
  { x: 950, y: 50, w: 160, h: 160, depth: 0.8, body: <IconTile name="receipt" /> },
  { x: 950, y: 240, w: 160, h: 160, depth: 0.8, body: <IconTile name="wallet" /> },
  {
    x: 1150,
    y: 50,
    w: 380,
    h: 350,
    depth: 1.1,
    body: (
      <>
        <Label>Rekapan</Label>
        <div style={{ display: "flex", gap: 6, height: 14, marginTop: 22 }}>
          {[[34, C.green], [24, C.yellow], [16, C.blue], [14, C.pink], [12, C.orange]].map(([f, c], i) => (
            <div key={i} style={{ flex: f as number, background: c as string, borderRadius: 7, opacity: 0.75 }} />
          ))}
        </div>
        {["Makan & Minum  34%", "Kebutuhan Harian  24%", "Transportasi  16%"].map((t) => (
          <div key={t} style={{ fontSize: 28, color: L.ink2, marginTop: 22 }}>{t}</div>
        ))}
      </>
    ),
  },
  { x: 1570, y: 50, w: 430, h: 160, depth: 0.7, body: (<><Label>Nasi padang</Label><Value>−Rp 35.000</Value></>) },
  { x: 1570, y: 240, w: 430, h: 160, depth: 0.9, body: (<><Label>Gojek ke kantor</Label><Value color={C.blue}>−Rp 22.000</Value></>) },
  {
    x: -40,
    y: 670,
    w: 520,
    h: 350,
    depth: 1.1,
    body: (
      <>
        <Label>Disiplin 28 hari</Label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginTop: 24 }}>
          {[0, 1, 1, 0, 2, 1, 0, 1, 2, 2, 1, 0, 1, 1, 2, 2, 2, 2, 2, 2, 2].map((d, i) => (
            <div key={i} style={{ aspectRatio: "1", borderRadius: 10, background: d === 2 ? "rgba(16,185,129,0.55)" : d === 1 ? "rgba(16,185,129,0.22)" : "rgba(255,255,255,0.5)", border: "1.5px solid rgba(255,255,255,0.8)" }} />
          ))}
        </div>
      </>
    ),
  },
  {
    x: 520,
    y: 670,
    w: 480,
    h: 160,
    depth: 0.8,
    body: (
      <>
        <Label>Liburan Bali</Label>
        <div style={{ height: 12, borderRadius: 6, background: "rgba(255,255,255,0.7)", marginTop: 22 }}>
          <div style={{ width: "20%", height: "100%", borderRadius: 6, background: L.accent }} />
        </div>
      </>
    ),
  },
  { x: 520, y: 860, w: 480, h: 160, depth: 0.9, body: (<><Label>Dari screenshot</Label><Value size={32}>QRIS · transfer · top up</Value></>) },
  {
    x: 1040,
    y: 670,
    w: 340,
    h: 350,
    depth: 1,
    body: (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, padding: "18px 10px" }}>
        {(["mic", "pen", "receipt", "screenshot"] as IconName[]).map((n) => (
          <div key={n} style={{ display: "flex", justifyContent: "center" }}>
            <Icon name={n} size={52} color={L.ink2} strokeWidth={1.5} />
          </div>
        ))}
        <div style={{ gridColumn: "1 / 3", textAlign: "center", fontSize: 28, color: L.ink2 }}>Cara catat</div>
      </div>
    ),
  },
  { x: 1420, y: 670, w: 160, h: 160, depth: 0.8, body: <IconTile name="mic" /> },
  { x: 1420, y: 860, w: 160, h: 160, depth: 0.8, body: <IconTile name="shield" /> },
  { x: 1620, y: 670, w: 420, h: 350, depth: 1.1, body: (<><Label>Kopi susu</Label><Value>−Rp 28.000</Value><div style={{ fontSize: 28, color: L.ink3, marginTop: 14 }}>GoPay · Makan & Minum</div></>) },
];

export const TilesLayer: React.FC<{ blur?: number; push?: number }> = ({ blur = 0, push = 0 }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ scale: String(1 + push), filter: blur ? `blur(${blur}px)` : undefined }}>
      {TILES.map((t, i) => (
        <Glass
          key={i}
          style={{
            position: "absolute",
            left: t.x - frame * 0.35 * t.depth,
            top: t.y,
            width: t.w,
            height: t.h,
            padding: "30px 34px",
            borderRadius: 34,
            filter: t.depth < 0.75 || t.depth > 1.05 ? "blur(2.5px)" : undefined,
          }}
        >
          {t.body}
        </Glass>
      ))}
    </AbsoluteFill>
  );
};

// 0:00 — "Akhir bulan selalu terasa lebih panjang."
export const F1Opening: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      <LightBg />
      <TilesLayer
        push={interpolate(frame, [0, 132], [0, 0.06], clamp)}
        blur={interpolate(frame, [96, 132], [0, 16], { ...clamp, easing: Easing.in(Easing.quad) })}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <TypeText
          segs={[{ text: "Akhir bulan selalu terasa lebih panjang." }]}
          start={14}
          cps={0.9}
          style={{ fontSize: 62, fontWeight: 500, letterSpacing: -1.2, marginTop: -20, opacity: interpolate(frame, [104, 126], [1, 0], clamp) }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
