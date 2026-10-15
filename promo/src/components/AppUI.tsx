import React from "react";
import { Img, staticFile } from "remotion";
import { C, rupiah } from "../theme";
import { Icon, IconName } from "./Icon";

// Re-creation of Sangu's screens at the app's own CSS-px scale (393-wide viewport).

export const AppHeader: React.FC = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 22px 0 22px", height: 56 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
      <Img src={staticFile("brand/logo-mark-512.png")} style={{ width: 30, height: 30 }} />
      <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: -0.4 }}>Halo, Rani</span>
    </div>
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 13,
        border: `1px solid ${C.border}`,
        background: C.surface1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name="settings" size={19} color={C.text2} strokeWidth={1.8} />
    </div>
  </div>
);

export const TabBar: React.FC<{ active: "home" | "catat" | "wallet" }> = ({ active }) => {
  const item = (key: typeof active, icon: IconName, label: string) => {
    const on = key === active;
    const isCatat = key === "catat";
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 110 }}>
        <div
          style={{
            height: 30,
            width: isCatat ? 46 : 30,
            borderRadius: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: isCatat ? (on ? C.text : C.surface2) : "transparent",
            border: isCatat && !on ? `1px solid ${C.borderHover}` : "none",
          }}
        >
          <Icon name={icon} size={isCatat ? 18 : 21} color={isCatat && on ? C.bg : on ? C.text : C.muted} strokeWidth={1.8} />
        </div>
        <span style={{ fontSize: 11.5, fontWeight: on ? 600 : 500, color: on ? C.text : C.muted }}>{label}</span>
      </div>
    );
  };
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 86,
        paddingTop: 7,
        borderTop: `1px solid ${C.border}`,
        background: "rgba(9,9,11,0.92)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "flex-start",
      }}
    >
      {item("home", "grid", "Ringkasan")}
      {item("catat", "plus", "Catat")}
      {item("wallet", "wallet", "Wallet")}
    </div>
  );
};

export const WalletChip: React.FC<{ name: string }> = ({ name }) => (
  <span
    style={{
      fontSize: 11.5,
      padding: "1px 6px",
      borderRadius: 6,
      border: `1px solid ${C.border}`,
      background: C.surface2,
      color: C.text2,
      fontWeight: 500,
    }}
  >
    {name}
  </span>
);

export type Tx = {
  icon: IconName;
  title: string;
  wallet: string;
  cat: string;
  time?: string;
  amount: number;
};

export const TxRow: React.FC<{ tx: Tx; style?: React.CSSProperties; highlight?: number }> = ({ tx, style, highlight = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      borderRadius: 16,
      background: highlight > 0 ? `rgba(52,211,153,${0.08 * highlight})` : "transparent",
      boxShadow: highlight > 0 ? `inset 0 0 0 1px rgba(52,211,153,${0.35 * highlight})` : "none",
      ...style,
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 11,
        border: `1px solid ${C.border}`,
        background: C.surface1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={tx.icon} size={16} color={C.text2} strokeWidth={1.8} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{tx.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, fontSize: 12, color: C.muted, whiteSpace: "nowrap", overflow: "hidden" }}>
        <WalletChip name={tx.wallet} />
        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{tx.time ? `${tx.cat} · ${tx.time}` : tx.cat}</span>
      </div>
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.2, whiteSpace: "nowrap" }}>-Rp {rupiah(tx.amount)}</div>
  </div>
);

const StatChip: React.FC<{ label: string; value: string; tone?: "blue" }> = ({ label, value, tone }) => (
  <div
    style={{
      height: 30,
      padding: "0 10px",
      borderRadius: 10,
      border: `1px solid ${tone === "blue" ? "rgba(56,189,248,0.45)" : C.border}`,
      background: tone === "blue" ? "rgba(56,189,248,0.06)" : C.surface1,
      display: "flex",
      alignItems: "center",
      gap: 5,
      fontSize: 12.5,
      color: tone === "blue" ? C.blue : C.text2,
    }}
  >
    {label} <b style={{ color: tone === "blue" ? C.blue : C.text, fontWeight: 700 }}>{value}</b>
  </div>
);

const WalletCard: React.FC<{ name: string; value: string; color: string }> = ({ name, value, color }) => (
  <div
    style={{
      width: 108,
      height: 60,
      borderRadius: 15,
      border: `1px solid ${C.border}`,
      background: C.surface1,
      padding: "9px 12px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, color: C.text2 }}>
      {name}
      <span style={{ width: 6, height: 6, borderRadius: 3, background: color }} />
    </div>
    <div style={{ fontSize: 15.5, fontWeight: 700, letterSpacing: -0.3 }}>{value}</div>
  </div>
);

export const HOME_TX: Tx[] = [
  { icon: "pen", title: "Nasi padang", wallet: "Cash", cat: "Makan & Minum", time: "12:20", amount: 35000 },
  { icon: "mic", title: "Kopi susu", wallet: "GoPay", cat: "Makan & Minum", time: "08:10", amount: 28000 },
  { icon: "screenshot", title: "Gojek ke kantor", wallet: "GoPay", cat: "Transportasi", time: "07:40", amount: 22000 },
];

export const HomeScreen: React.FC<{ safeToday: number; ring: number }> = ({ safeToday, ring }) => (
  <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>
    <AppHeader />
    <div style={{ padding: "0 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontSize: 12.5, color: C.text2 }}>
        <span>Aman dipakai hari ini</span>
        <span style={{ color: C.muted }}>25 Sep – 24 Okt · sisa 10 hari</span>
      </div>
      <div style={{ position: "relative", display: "inline-block", marginTop: 2 }}>
        <div
          style={{
            position: "absolute",
            inset: "-4px -12px",
            borderRadius: 16,
            boxShadow: `0 0 0 2px rgba(52,211,153,${ring}), 0 0 ${40 * ring}px rgba(52,211,153,${0.45 * ring})`,
            background: `rgba(52,211,153,${0.08 * ring})`,
          }}
        />
        <div style={{ position: "relative", fontSize: 42, fontWeight: 800, letterSpacing: -1.8, fontVariantNumeric: "tabular-nums" }}>
          Rp {rupiah(safeToday)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
        <StatChip label="Sisa" value="3,16 jt" />
        <StatChip label="Keluar" value="1,34 jt" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26, fontSize: 12.5, color: C.text2 }}>
        <span>Sumber dana</span>
        <span>+ Wallet</span>
      </div>
      <div style={{ display: "flex", gap: 9, marginTop: 10 }}>
        <WalletCard name="BCA" value="2,48 jt" color={C.blue} />
        <WalletCard name="GoPay" value="412 rb" color={C.green} />
        <WalletCard name="Cash" value="270 rb" color={C.yellow} />
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 20, paddingBottom: 10, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ padding: "8px 12px", borderRadius: 12, background: C.surface2, border: `1px solid ${C.border}`, fontSize: 13.5, fontWeight: 700 }}>
          Aktivitas
        </div>
        <div style={{ padding: "8px 6px", fontSize: 13.5, fontWeight: 600, color: C.text2, display: "flex", alignItems: "center", gap: 7 }}>
          Rekapan & Streak
          <span style={{ fontSize: 11.5, color: C.green, background: "rgba(52,211,153,0.14)", padding: "1px 6px", borderRadius: 6 }}>7h</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "14px 2px 4px", fontSize: 12.5, color: C.text2 }}>
        <span>Hari ini</span>
        <span>-Rp 85.000</span>
      </div>
      <div style={{ margin: "0 -12px" }}>
        {HOME_TX.map((tx) => (
          <TxRow key={tx.title} tx={tx} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "12px 2px 4px", fontSize: 12.5, color: C.text2 }}>
        <span>Kemarin</span>
        <span>-Rp 187.500</span>
      </div>
      <div style={{ margin: "0 -12px" }}>
        <TxRow tx={{ icon: "receipt", title: "Indomaret", wallet: "BCA", cat: "Kebutuhan Harian", time: "19:30", amount: 187500 }} />
      </div>
    </div>
    <TabBar active="home" />
  </div>
);

const WalletPill: React.FC<{ name: string; value: string; color: string; on?: boolean }> = ({ name, value, color, on }) => (
  <div
    style={{
      height: 40,
      padding: "0 14px",
      borderRadius: 20,
      display: "flex",
      alignItems: "center",
      gap: 8,
      whiteSpace: "nowrap",
      fontSize: 14,
      background: on ? C.text : C.surface2,
      color: on ? C.bg : C.text2,
      border: on ? "none" : `1px solid ${C.border}`,
      fontWeight: 600,
    }}
  >
    <span style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
    {name}
    <span style={{ fontWeight: 500, opacity: 0.8 }}>{value}</span>
  </div>
);

export const CatatScreen: React.FC<{
  transcript: React.ReactNode;
  listening: number; // 0..1 mic active
  frame: number;
  composer?: React.ReactNode; // replaces the mic area once parsed
}> = ({ transcript, listening, frame, composer }) => {
  const bars = (side: number) =>
    [0, 1, 2, 3, 4].map((i) => {
      const h = 6 + listening * (8 + 12 * Math.abs(Math.sin(frame * 0.42 + i * 1.3 + side * 2)));
      return <span key={i} style={{ width: 4, height: h, borderRadius: 2, background: listening > 0.1 ? C.green : C.surface3 }} />;
    });
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>
      <AppHeader />
      <div style={{ padding: "0 22px" }}>
        <div
          style={{
            marginTop: 10,
            height: 548,
            borderRadius: 26,
            border: `1px solid ${C.border}`,
            background: "linear-gradient(180deg, #141417 0%, #101013 100%)",
            padding: "16px 16px 0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <WalletPill name="GoPay" value="412 rb" color={C.green} on />
            <WalletPill name="BCA" value="2,48 jt" color={C.blue} />
            <WalletPill name="Cash" value="270 rb" color={C.yellow} />
          </div>
          <div
            style={{
              marginTop: 22,
              minHeight: 64,
              paddingBottom: 14,
              borderBottom: `1.5px dashed ${C.surface3}`,
              fontSize: 19,
              lineHeight: 1.45,
              fontWeight: 500,
              color: C.text,
              textAlign: "center",
              letterSpacing: -0.2,
            }}
          >
            {transcript}
          </div>
          {composer}
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 0,
              height: 210,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: composer ? 0 : 1,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, height: 130 }}>
              <div style={{ display: "flex", gap: 4, alignItems: "center", width: 36, justifyContent: "flex-end" }}>{bars(0)}</div>
              <div style={{ position: "relative", width: 84, height: 84 }}>
                {[0, 1, 2].map((i) => {
                  const p = ((frame * 0.035 + i / 3) % 1) * listening;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 42,
                        border: `2px solid rgba(52,211,153,${(1 - p) * 0.7 * listening})`,
                        scale: String(1 + p * 0.9),
                      }}
                    />
                  );
                })}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 42,
                    background: C.surface2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 66,
                      height: 66,
                      borderRadius: 33,
                      background: listening > 0.5 ? C.green : C.text,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 0 ${50 * listening}px rgba(52,211,153,${0.6 * listening})`,
                    }}
                  >
                    <Icon name="mic" size={26} color={C.bg} strokeWidth={2} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, alignItems: "center", width: 36 }}>{bars(1)}</div>
            </div>
            <div style={{ width: "100%", borderTop: `1px solid ${C.border}`, paddingTop: 14, textAlign: "center", fontSize: 12.5, lineHeight: 1.45, color: C.text2 }}>
              Pisahkan dengan kata “<b style={{ color: C.text }}>dan</b>”
              <br />
              untuk beberapa transaksi
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 12,
            height: 60,
            borderRadius: 18,
            border: "1px solid rgba(52,211,153,0.28)",
            background: "rgba(52,211,153,0.05)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px 0 12px",
            gap: 11,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "rgba(52,211,153,0.14)",
              border: "1px solid rgba(52,211,153,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="screenshot" size={16} color={C.green} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Dari screenshot</div>
            <div style={{ fontSize: 11.5, color: C.text2 }}>Bukti QRIS, transfer, top up</div>
          </div>
          <div
            style={{
              height: 40,
              padding: "0 14px",
              borderRadius: 12,
              border: `1px solid ${C.borderHover}`,
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Icon name="clipboard" size={15} color={C.text} strokeWidth={1.8} />
            Tempel
          </div>
        </div>
      </div>
      <TabBar active="catat" />
    </div>
  );
};
