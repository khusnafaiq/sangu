import React from "react";
import { C, FONT } from "../theme";

// Logical iPhone screen (CSS px), same viewport the app was designed for.
export const SCREEN_W = 393;
export const SCREEN_H = 852;
const BEZEL = 12;
export const PHONE_W = SCREEN_W + BEZEL * 2;
export const PHONE_H = SCREEN_H + BEZEL * 2;

const StatusBar: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 34px 0 46px",
      color: C.text,
      fontFamily: FONT,
      fontSize: 16,
      fontWeight: 700,
      zIndex: 5,
    }}
  >
    <span>9:41</span>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <svg width="18" height="12" viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 5} y={9 - i * 3} width="3.4" height={3 + i * 3} rx="1" fill={C.text} />
        ))}
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke={C.text} strokeWidth="2" strokeLinecap="round">
        <path d="M1.5 4.2a9.5 9.5 0 0 1 13 0" />
        <path d="M4.3 7a5.5 5.5 0 0 1 7.4 0" />
        <circle cx="8" cy="10" r="1" fill={C.text} stroke="none" />
      </svg>
      <div
        style={{
          width: 26,
          height: 13,
          borderRadius: 4,
          border: "1.5px solid rgba(255,255,255,0.45)",
          padding: 1.5,
          display: "flex",
        }}
      >
        <div style={{ width: "78%", background: C.text, borderRadius: 2 }} />
      </div>
    </div>
  </div>
);

export const Phone: React.FC<{ children: React.ReactNode; glow?: number }> = ({ children, glow = 1 }) => (
  <div
    style={{
      width: PHONE_W,
      height: PHONE_H,
      borderRadius: 66,
      padding: BEZEL,
      background: "linear-gradient(160deg, #2a2a30 0%, #141417 40%, #0d0d10 100%)",
      boxShadow: `0 0 0 1.5px rgba(255,255,255,0.10), 0 40px 120px rgba(0,0,0,0.65), 0 0 ${160 * glow}px rgba(52,211,153,${0.16 * glow})`,
      position: "relative",
    }}
  >
    <div
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        borderRadius: 54,
        overflow: "hidden",
        position: "relative",
        background: C.bg,
        fontFamily: FONT,
        color: C.text,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(120% 50% at 0% 0%, rgba(52,211,153,0.07), rgba(52,211,153,0) 60%)",
        }}
      />
      <StatusBar />
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 11,
          left: "50%",
          marginLeft: -62,
          width: 124,
          height: 36,
          borderRadius: 18,
          background: "#000",
          zIndex: 6,
        }}
      />
      <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>{children}</div>
      {/* Home indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: "50%",
          marginLeft: -68,
          width: 136,
          height: 5,
          borderRadius: 3,
          background: "rgba(255,255,255,0.55)",
          zIndex: 6,
        }}
      />
    </div>
  </div>
);
