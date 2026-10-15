import React from "react";
import { AbsoluteFill, Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { C, FONT, rupiah } from "../../theme";
import { Cursor, Glass, L, LightBg, TypeText } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0:13 — zoomed-in "Aman dipakai hari ini", a tap shows how it is worked out.
export const F5Daily: React.FC = () => {
  const frame = useCurrentFrame();
  const amount = interpolate(frame, [12, 50], [0, 316350], { ...clamp, easing: Easing.out(Easing.cubic) });
  const cx = interpolate(frame, [44, 66, 78, 96], [900, 510, 510, 760], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const cy = interpolate(frame, [44, 66, 78, 96], [980, 580, 580, 700], { ...clamp, easing: Easing.bezier(0.45, 0, 0.2, 1) });
  const press = interpolate(frame, [66, 76], [0, 1], clamp);
  const sisaOn = frame >= 70 ? 1 : 0;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <LightBg peach={0.7} />
      <TypeText
        segs={[{ text: "Tahu jatah aman kamu, " }, { text: "tiap hari.", bold: true }]}
        start={4}
        cps={1}
        style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", fontSize: 64, fontWeight: 500, letterSpacing: -1.4 }}
      />

      <Interactive.Div
        name="Daily card"
        style={{
          position: "absolute",
          left: 330,
          top: 270,
          width: 1260,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          translate: interpolate(frame, [0, 26], ["0px 60px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <Glass dark style={{ padding: "48px 60px 54px", borderRadius: 52, background: "rgba(12,12,14,0.92)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 32, color: C.text2 }}>
            <span>Aman dipakai hari ini</span>
            <span style={{ color: C.muted }}>25 Sep – 24 Okt · sisa 10 hari</span>
          </div>
          <div style={{ fontSize: 150, fontWeight: 800, letterSpacing: -6, lineHeight: 1.08, marginTop: 6, fontVariantNumeric: "tabular-nums" }}>Rp {rupiah(amount)}</div>
          <div style={{ display: "flex", gap: 16, marginTop: 18 }}>
            {[
              ["Sisa", "3,16 jt"],
              ["Keluar", "1,34 jt"],
            ].map(([l, v], i) => (
              <div
                key={l}
                style={{
                  padding: "14px 24px",
                  borderRadius: 20,
                  fontSize: 32,
                  color: C.text2,
                  border: `2px solid ${i === 0 && sisaOn ? "rgba(52,211,153,0.7)" : C.border}`,
                  background: i === 0 && sisaOn ? "rgba(52,211,153,0.12)" : C.surface1,
                }}
              >
                {l} <b style={{ color: C.text }}>{v}</b>
              </div>
            ))}
          </div>
        </Glass>
      </Interactive.Div>

      <Interactive.Div
        name="Formula"
        style={{
          position: "absolute",
          left: 330,
          top: 760,
          width: 1260,
          opacity: interpolate(frame, [74, 86], [0, 1], clamp),
          translate: interpolate(frame, [74, 96], ["0px -40px", "0px 0px"], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
        }}
      >
        <Glass style={{ padding: "34px 56px", borderRadius: 40, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 40 }}>
          <span>
            <b>Rp 3.163.500</b> <span style={{ color: L.ink2, fontSize: 30 }}>sisa budget</span>
          </span>
          <span style={{ color: L.ink3 }}>÷</span>
          <span>
            <b>10 hari</b> <span style={{ color: L.ink2, fontSize: 30 }}>ke gajian</span>
          </span>
          <span style={{ color: L.ink3 }}>=</span>
          <b style={{ color: L.accent }}>Rp 316.350</b>
        </Glass>
      </Interactive.Div>

      <Cursor x={cx} y={cy} press={press} opacity={interpolate(frame, [42, 50, 100, 110], [0, 1, 1, 0], clamp)} size={38} />
    </AbsoluteFill>
  );
};
