import React from "react";
import { Img, staticFile } from "remotion";
import { C } from "../theme";
import { AppHeader, TabBar } from "../components/AppUI";
import { Icon } from "../components/Icon";

// Extra Sangu screens for the film (Home and Catat live in components/AppUI).

const Row: React.FC<{ dot: string; name: string; value: string; badge?: boolean }> = ({ dot, name, value, badge }) => (
  <div
    style={{
      height: 50,
      borderRadius: 14,
      border: `1px solid ${C.border}`,
      background: C.surface2,
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      gap: 10,
      fontSize: 15,
    }}
  >
    <span style={{ width: 8, height: 8, borderRadius: 4, background: dot }} />
    <span style={{ fontWeight: 600 }}>{name}</span>
    {badge ? <span style={{ fontSize: 11.5, color: C.green, background: "rgba(52,211,153,0.14)", padding: "1px 7px", borderRadius: 6 }}>Default</span> : null}
    <span style={{ marginLeft: "auto", fontWeight: 700 }}>{value}</span>
  </div>
);

export const WalletScreen: React.FC = () => (
  <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>
    <AppHeader />
    <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
      <div style={{ borderRadius: 24, border: `1px solid ${C.border}`, background: C.surface1, padding: 18 }}>
        <div style={{ fontSize: 13, color: C.text2 }}>Total saldo semua wallet</div>
        <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1.4, marginTop: 4 }}>Rp 3.162.000</div>
        <div style={{ fontSize: 12.5, color: C.text2, marginTop: 6 }}>
          Di target tabungan: <b style={{ color: C.blue }}>Rp 1.000.000</b>
        </div>
        <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
          {["+ Tambah Wallet", "Transfer"].map((l, i) => (
            <div
              key={l}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 13,
                border: `1px solid ${C.borderHover}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 600,
                color: i === 0 ? C.green : C.text,
              }}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderRadius: 24, border: `1px solid ${C.border}`, background: C.surface1, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.text2, marginBottom: 2 }}>
          <span>Sumber dana kamu</span>
          <span style={{ color: C.muted }}>Ketuk untuk atur</span>
        </div>
        <Row dot={C.blue} name="BCA" value="Rp 2.480.000" badge />
        <Row dot={C.green} name="GoPay" value="Rp 412.000" />
        <Row dot={C.yellow} name="Cash" value="Rp 270.000" />
      </div>
      <div style={{ borderRadius: 24, border: `1px solid ${C.border}`, background: C.surface1, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: C.text2 }}>
          <span>Target tabungan</span>
          <span style={{ color: C.green }}>+ Target</span>
        </div>
        <div style={{ marginTop: 12, borderRadius: 14, border: `1px solid ${C.border}`, background: C.surface2, padding: 13 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <b>Liburan Bali</b>
            <span style={{ color: C.text2 }}>1 jt / 5 jt (20%)</span>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: C.surface3, marginTop: 10 }}>
            <div style={{ width: "20%", height: "100%", borderRadius: 3, background: C.green }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: C.muted, marginTop: 8 }}>
            <span>perlu Rp 2.000.000/bulan</span>
            <span>Tenggat 20 Des 2026</span>
          </div>
        </div>
      </div>
    </div>
    <TabBar active="wallet" />
  </div>
);

const CATS = [
  { name: "Makan & Minum", value: "452 rb", pct: 34, color: C.green },
  { name: "Kebutuhan Harian", value: "321 rb", pct: 24, color: C.yellow },
  { name: "Transportasi", value: "214 rb", pct: 16, color: C.blue },
  { name: "Tagihan", value: "187 rb", pct: 14, color: C.pink },
  { name: "Hiburan", value: "163 rb", pct: 12, color: C.orange },
];
export const STREAK_DAYS = [0, 1, 1, 0, 2, 1, 0, 1, 2, 2, 1, 0, 1, 1, 2, 1, 0, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2];

export const RecapScreen: React.FC<{ bar?: number; lit?: number }> = ({ bar = 1, lit = 28 }) => (
  <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>
    <AppHeader />
    <div style={{ padding: "0 22px", display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
      <div style={{ borderRadius: 22, border: `1px solid ${C.border}`, background: C.surface1, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: C.text2 }}>Rekapan pengeluaran</span>
          <b>Makan & Minum · 34%</b>
        </div>
        <div style={{ fontSize: 12.5, color: C.text2, marginTop: 8 }}>
          Keluar <b style={{ color: C.text }}>Rp 1.336.500</b> dari Rp 4.500.000
        </div>
        <div style={{ display: "flex", gap: 3, height: 8, marginTop: 12, width: `${bar * 100}%` }}>
          {CATS.map((c) => (
            <div key={c.name} style={{ flex: c.pct, background: c.color, borderRadius: 4 }} />
          ))}
        </div>
        {CATS.map((c, i) => (
          <div
            key={c.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 13.5,
              padding: "9px 0",
              borderBottom: i < CATS.length - 1 ? `1px solid ${C.border}` : "none",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 4, background: c.color }} />
            <span style={{ flex: 1, color: C.text2 }}>{c.name}</span>
            <b>{c.value}</b>
            <span style={{ width: 38, textAlign: "right", color: C.muted }}>{c.pct}%</span>
          </div>
        ))}
      </div>
      <div style={{ borderRadius: 22, border: `1px solid ${C.border}`, background: C.surface1, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: C.text2 }}>Disiplin 28 hari</span>
          <span style={{ color: C.green, display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="flame" size={14} color={C.orange} strokeWidth={2.2} />7 hari beruntun
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(14, 1fr)", gap: 4, marginTop: 12 }}>
          {STREAK_DAYS.map((d, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1",
                borderRadius: 5,
                border: `1px solid ${d === 0 || i >= lit ? C.surface3 : "rgba(52,211,153,0.35)"}`,
                background: i >= lit ? C.surface1 : d === 2 ? C.green : d === 1 ? "#1f5c47" : C.surface1,
                boxShadow: i >= 21 && i < lit ? "0 0 10px rgba(52,211,153,0.6)" : "none",
              }}
            />
          ))}
        </div>
      </div>
    </div>
    <TabBar active="home" />
  </div>
);

export const OnboardingScreen: React.FC<{ name?: string; caret?: boolean }> = ({ name = "", caret }) => (
  <div style={{ position: "absolute", inset: 0, paddingTop: 54, background: `radial-gradient(120% 60% at 0% 0%, rgba(52,211,153,0.10), ${C.bg} 60%)` }}>
    <div style={{ padding: "18px 22px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 34, height: 4, borderRadius: 2, background: C.text }} />
          <span style={{ width: 22, height: 4, borderRadius: 2, background: C.surface3 }} />
          <span style={{ width: 22, height: 4, borderRadius: 2, background: C.surface3 }} />
        </div>
        <span style={{ fontSize: 13.5, color: C.text2 }}>Lewati</span>
      </div>
      <Img src={staticFile("brand/logo-mark-512.png")} style={{ width: 64, height: 64, marginTop: 26 }} />
      <div style={{ color: C.green, fontSize: 13.5, fontWeight: 600, marginTop: 12 }}>Sangu hari ini, tenang sampai gajian.</div>
      <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.9, marginTop: 14 }}>Selamat datang di Sangu</div>
      <div style={{ fontSize: 13.5, color: C.text2, marginTop: 6, lineHeight: 1.4 }}>Tanpa login. Semua data tersimpan di perangkat ini saja.</div>
      <div style={{ fontSize: 13, color: C.text2, marginTop: 22 }}>Nama panggilan</div>
      <div
        style={{
          marginTop: 8,
          height: 46,
          borderRadius: 14,
          border: `1px solid ${caret ? "rgba(52,211,153,0.6)" : C.border}`,
          background: C.surface1,
          display: "flex",
          alignItems: "center",
          padding: "0 15px",
          fontSize: 16,
          color: name ? C.text : C.muted,
        }}
      >
        {name || "Ketik nama kamu…"}
        {caret ? <span style={{ color: C.green, marginLeft: 1 }}>|</span> : null}
      </div>
      <div style={{ fontSize: 13, color: C.text2, marginTop: 18 }}>Bahasa / Language</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {["Bahasa Indonesia", "English"].map((l, i) => (
          <div
            key={l}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 600,
              background: i === 0 ? C.text : C.surface1,
              color: i === 0 ? C.bg : C.text2,
              border: i === 0 ? "none" : `1px solid ${C.border}`,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{ fontSize: 13, color: C.text2, marginTop: 18 }}>Mata uang utama</div>
      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
        {["IDR (Rp)", "USD ($)", "SGD (S$)"].map((l, i) => (
          <div
            key={l}
            style={{
              flex: 1,
              height: 42,
              borderRadius: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 600,
              background: i === 0 ? C.text : C.surface1,
              color: i === 0 ? C.bg : C.text2,
              border: i === 0 ? "none" : `1px solid ${C.border}`,
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div style={{ color: C.green, fontSize: 14, fontWeight: 600, marginTop: 22 }}>Sudah punya backup? Pulihkan</div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        bottom: 34,
        height: 50,
        borderRadius: 16,
        background: C.text,
        color: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: 16,
      }}
    >
      Lanjut
    </div>
  </div>
);
