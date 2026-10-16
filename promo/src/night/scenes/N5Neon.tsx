import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../../theme";
import { AppHeader, TabBar, Tx, TxRow } from "../../components/AppUI";
import { Cursor } from "../../film/ui";
import { RecapBody } from "../../film/screens";
import { NotifCatat, PHONE_MID, SAVE_PIN, pinned } from "./N4cNotif";
import { DarkScreen, GlowLine, NightBg, clamp, glide } from "../kit";

// The activity list after saving: the new Kopi Senja on top, then older days.
const DAYS: { label: string; total: string; txs: Tx[] }[] = [
  {
    label: "Hari ini",
    total: "-Rp 76.000",
    txs: [
      {
        icon: "screenshot",
        title: "Kopi Senja",
        wallet: "BCA",
        cat: "Makan & Minum",
        time: "08:12",
        amount: 45000,
      },
      {
        icon: "mic",
        title: "Parkir",
        wallet: "Cash",
        cat: "Transportasi",
        time: "08:10",
        amount: 3000,
      },
      {
        icon: "mic",
        title: "Kopi susu",
        wallet: "GoPay",
        cat: "Makan & Minum",
        time: "08:10",
        amount: 28000,
      },
    ],
  },
  {
    label: "Kemarin",
    total: "-Rp 289.500",
    txs: [
      {
        icon: "receipt",
        title: "Indomaret",
        wallet: "BCA",
        cat: "Kebutuhan Harian",
        time: "19:30",
        amount: 187500,
      },
      {
        icon: "pen",
        title: "Pulsa",
        wallet: "BCA",
        cat: "Tagihan",
        time: "15:05",
        amount: 45000,
      },
      {
        icon: "pen",
        title: "Nasi padang",
        wallet: "Cash",
        cat: "Makan & Minum",
        time: "12:20",
        amount: 35000,
      },
      {
        icon: "screenshot",
        title: "Gojek ke kantor",
        wallet: "GoPay",
        cat: "Transportasi",
        time: "07:40",
        amount: 22000,
      },
    ],
  },
  {
    label: "Sel, 13 Okt",
    total: "-Rp 239.000",
    txs: [
      {
        icon: "pen",
        title: "Token listrik",
        wallet: "BCA",
        cat: "Tagihan",
        time: "20:00",
        amount: 150000,
      },
      {
        icon: "receipt",
        title: "Shopee",
        wallet: "BCA",
        cat: "Belanja",
        time: "11:10",
        amount: 89000,
      },
    ],
  },
  {
    label: "Min, 11 Okt",
    total: "-Rp 95.000",
    txs: [
      {
        icon: "pen",
        title: "Nonton XXI",
        wallet: "Cash",
        cat: "Hiburan",
        time: "18:00",
        amount: 60000,
      },
      {
        icon: "mic",
        title: "Martabak",
        wallet: "GoPay",
        cat: "Makan & Minum",
        time: "21:30",
        amount: 35000,
      },
    ],
  },
];

/** Ringkasan with its two tabs: the activity list (scrollable) and, one swipe to the right, the recap. */
const ActivityAndRecap: React.FC<{
  scroll: number;
  swipe: number;
  fresh: number;
  bar: number;
  lit: number;
}> = ({ scroll, swipe, fresh, bar, lit }) => {
  const tab = (label: string, on: number, badge?: boolean) => (
    <div
      style={{
        position: "relative",
        padding: "8px 12px",
        fontSize: 13.5,
        fontWeight: 700,
        display: "flex",
        alignItems: "center",
        gap: 7,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          background: C.surface2,
          border: `1px solid ${C.border}`,
          opacity: on,
        }}
      />
      <span
        style={{ position: "relative", color: on > 0.5 ? C.text : C.text2 }}
      >
        {label}
      </span>
      {badge ? (
        <span
          style={{
            position: "relative",
            fontSize: 11.5,
            color: C.green,
            background: "rgba(52,211,153,0.14)",
            padding: "1px 6px",
            borderRadius: 6,
          }}
        >
          7h
        </span>
      ) : null}
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, paddingTop: 54 }}>
      <AppHeader />
      <div
        style={{
          display: "flex",
          gap: 6,
          margin: "10px 22px 0",
          paddingBottom: 10,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        {tab("Aktivitas", 1 - swipe)}
        {tab("Rekapan & Streak", swipe, true)}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 172,
          bottom: 86,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 786,
            translate: `${-393 * swipe}px 0px`,
          }}
        >
          <div
            style={{
              width: 393,
              padding: "0 22px",
              translate: `0px ${-scroll}px`,
            }}
          >
            {DAYS.map((d, di) => (
              <div key={d.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "14px 2px 4px",
                    fontSize: 12.5,
                    color: C.text2,
                  }}
                >
                  <span>{d.label}</span>
                  <span>{d.total}</span>
                </div>
                <div style={{ margin: "0 -12px" }}>
                  {d.txs.map((tx, ti) => (
                    <TxRow
                      key={tx.title}
                      tx={tx}
                      highlight={di === 0 && ti === 0 ? fresh : 0}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ width: 393, paddingTop: 6 }}>
            <RecapBody bar={bar} lit={lit} />
          </div>
        </div>
      </div>
      <TabBar active="home" />
    </div>
  );
};

// Starts on the "Simpan" close-up where N4c ends, pulls back and lays the phone into a tilted hero shot.
// The saved payment lands on top of a long activity list that scrolls, then a swipe opens the recap.
// 225 frames.
export const N5Neon: React.FC = () => {
  const frame = useCurrentFrame();
  const back = interpolate(frame, [0, 40], [0, 1], { ...clamp, easing: glide });
  const t = interpolate(frame, [36, 86], [0, 1], { ...clamp, easing: glide });
  const catat = interpolate(frame, [50, 60], [1, 0], clamp);
  const home = interpolate(frame, [56, 68], [0, 1], clamp);
  const scroll = interpolate(frame, [96, 150], [0, 250], {
    ...clamp,
    easing: glide,
  });
  const swipe = interpolate(frame, [158, 184], [0, 1], {
    ...clamp,
    easing: glide,
  });
  const out = interpolate(frame, [208, 225], [1, 0], clamp);

  const s = interpolate(back, [0, 1], [3, 1]);
  // pin = where the Simpan button sits; at s = 1 the phone centre is pin + (PHONE_MID - SAVE_PIN)
  const dx = PHONE_MID.x - SAVE_PIN.x;
  const dy = PHONE_MID.y - SAVE_PIN.y;
  const px =
    t > 0
      ? interpolate(t, [0, 1], [700 - dx, 1260 - dx])
      : interpolate(back, [0, 1], [960, 700 - dx]);
  const py =
    t > 0
      ? interpolate(t, [0, 1], [540 - dy, 530 - dy])
      : interpolate(back, [0, 1], [600, 540 - dy]);

  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: out }}>
        <NightBg
          light={interpolate(t, [0, 1], [1, 1.3])}
          x={interpolate(frame, [0, 40, 86], [50, 36, 66], clamp)}
        />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          transformOrigin: "0 0",
          transform: pinned(s, px, py),
          perspective: 2200,
          opacity: out,
          filter: out < 1 ? `blur(${(1 - out) * 14}px)` : undefined,
        }}
      >
        <div
          style={{
            transformOrigin: `${PHONE_MID.x}px ${PHONE_MID.y}px`,
            transform: `rotateX(${28 * t}deg) rotateY(${6 * t}deg) rotateZ(${interpolate(frame, [36, 86, 225], [0, -18, -15], clamp)}deg) scale(${interpolate(t, [0, 1], [1, 1.25])})`,
          }}
        >
          <DarkScreen glow={back}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: catat,
                filter: catat < 1 ? `blur(${(1 - catat) * 6}px)` : undefined,
              }}
            >
              <NotifCatat frame={frame} />
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: home,
                filter: home < 1 ? `blur(${(1 - home) * 6}px)` : undefined,
              }}
            >
              <ActivityAndRecap
                scroll={scroll}
                swipe={swipe}
                fresh={interpolate(
                  frame,
                  [60, 72, 110, 130],
                  [0, 1, 1, 0],
                  clamp,
                )}
                bar={interpolate(frame, [178, 206], [0, 1], {
                  ...clamp,
                  easing: glide,
                })}
                lit={Math.round(interpolate(frame, [182, 214], [0, 28], clamp))}
              />
              <Cursor
                x={interpolate(frame, [150, 158, 184], [330, 320, 90], {
                  ...clamp,
                  easing: glide,
                })}
                y={interpolate(frame, [150, 158, 184], [560, 560, 548], clamp)}
                press={interpolate(
                  frame,
                  [158, 162, 182, 186],
                  [0, 0.5, 0.5, 0],
                  clamp,
                )}
                opacity={interpolate(
                  frame,
                  [148, 154, 184, 192],
                  [0, 1, 1, 0],
                  clamp,
                )}
                size={26}
              />
            </div>
          </DarkScreen>
        </div>
      </div>
      <GlowLine
        words={[{ t: "Rapi," }, { t: " otomatis." }]}
        at={96}
        out={204}
        stagger={8}
        size={96}
        style={{ position: "absolute", left: 150, top: 150 }}
      />
    </AbsoluteFill>
  );
};
