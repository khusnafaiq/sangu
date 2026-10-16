import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FONT } from "../../theme";
import { GLOW, GlowLine, INK, NightBg, clamp, glide, veil } from "../kit";

// Alternative hooks (same length as N1Hook: 210 frames), all text-only on the dark stage.

const base = (size: number): React.CSSProperties => ({
  fontFamily: FONT,
  fontSize: size,
  fontWeight: 500,
  letterSpacing: -size * 0.03,
  color: INK,
  lineHeight: 1,
  whiteSpace: "pre",
});
const GREEN_TXT = "#B9F5DC";
const RED_TXT = "#FF9BAE";

/**
 * B — "Tanggal 25. Gajian." → the day counts down in place → "Baru tanggal 15, udah tanggal tua."
 * The day number is the match-cut slot.
 */
export const N1HookB: React.FC = () => {
  const frame = useCurrentFrame();
  const day = Math.round(interpolate(frame, [62, 100], [25, 15], clamp));
  const hot = interpolate(frame, [62, 100], [0, 1], clamp);
  const b = base(104);
  return (
    <AbsoluteFill>
      <NightBg light={0.7} />
      <AbsoluteFill
        style={{
          scale: String(interpolate(frame, [0, 210], [1, 1.035], clamp)),
        }}
      >
        <div
          style={{
            position: "absolute",
            left: interpolate(frame, [62, 104], [962, 1268], {
              ...clamp,
              easing: glide,
            }),
            top: 430,
            translate: "-50% 0px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              ...b,
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              color: hot < 0.5 ? GREEN_TXT : RED_TXT,
              textShadow: hot < 0.5 ? GLOW.green : GLOW.red,
              ...veil(frame, 4, 1e9, 26, 16, 0),
            }}
          >
            {day}
          </span>
          <span
            style={{
              position: "absolute",
              right: "100%",
              top: 0,
              ...b,
              textShadow: GLOW.white,
              ...veil(frame, 4, 104, 26, 16, 6),
            }}
          >
            Tanggal{" "}
          </span>
          <span
            style={{
              position: "absolute",
              right: "100%",
              top: 0,
              ...b,
              textShadow: GLOW.white,
              ...veil(frame, 110, 1e9, 24, 16, 6),
            }}
          >
            Baru tanggal{" "}
          </span>
          <span
            style={{
              position: "absolute",
              left: "100%",
              top: 0,
              ...b,
              color: GREEN_TXT,
              textShadow: GLOW.green,
              ...veil(frame, 20, 60, 24, 16, 6),
            }}
          >
            . Gajian.
          </span>
          <span
            style={{
              position: "absolute",
              left: "100%",
              top: 0,
              ...b,
              textShadow: GLOW.white,
              ...veil(frame, 110, 1e9, 24, 16, 6),
            }}
          >
            ,
          </span>
        </div>
        <GlowLine
          words={[
            { t: "udah" },
            { t: " tanggal tua.", color: RED_TXT, glow: GLOW.red, bold: true },
          ]}
          at={124}
          stagger={8}
          size={104}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 560,
            textAlign: "center",
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const LEAKS = [
  { t: "Kopi −28rb", x: -520, y: -250 },
  { t: "Ojol −22rb", x: 470, y: -280 },
  { t: "Checkout −189rb", x: -640, y: 40 },
  { t: "Langganan −54rb", x: 600, y: 10 },
  { t: "Jajan −35rb", x: -430, y: 270 },
  { t: "Nongkrong −120rb", x: 420, y: 290 },
  { t: "Token −150rb", x: -40, y: -330 },
  { t: "Kondangan −200rb", x: 20, y: 340 },
];

/** C — "Rp 4.500.000" bursts into small spends and drains → "Gajimu ke mana aja?" */
export const N1HookC: React.FC = () => {
  const frame = useCurrentFrame();
  const drain = interpolate(frame, [56, 120], [0, 1], {
    ...clamp,
    easing: (t) => 1 - Math.pow(1 - t, 2),
  });
  const money = Math.round(4500000 - drain * (4500000 - 87000));
  const b = base(104);
  return (
    <AbsoluteFill>
      <NightBg light={0.7} />
      <div
        style={{
          position: "absolute",
          left: 960,
          top: 480,
          translate: "-50% 0px",
        }}
      >
        <div
          style={{
            ...b,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: drain < 0.6 ? GREEN_TXT : RED_TXT,
            textShadow: drain < 0.6 ? GLOW.green : GLOW.red,
            ...veil(frame, 4, 130, 26, 16, 0),
          }}
        >
          Rp {money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
        </div>
      </div>
      {LEAKS.map((l, i) => {
        const at = 52 + i * 5;
        const p = interpolate(frame, [at, at + 40], [0, 1], clamp);
        return (
          <div
            key={l.t}
            style={{
              position: "absolute",
              left: 960,
              top: 520,
              translate: `calc(-50% + ${l.x * (0.35 + 0.65 * p)}px) ${l.y * (0.35 + 0.65 * p)}px`,
              ...base(44),
              color: RED_TXT,
              textShadow: GLOW.red,
              opacity: interpolate(
                frame,
                [at, at + 10, 118, 132],
                [0, 0.9, 0.9, 0],
                clamp,
              ),
              filter: `blur(${interpolate(frame, [at, at + 12, 118, 132], [10, 0, 0, 10], clamp)}px)`,
            }}
          >
            {l.t}
          </div>
        );
      })}
      <GlowLine
        words={[{ t: "Gajimu" }, { t: " ke" }, { t: " mana" }, { t: " aja?" }]}
        at={142}
        stagger={7}
        size={104}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />
    </AbsoluteFill>
  );
};

/** D — a reframe: "Bukan gajinya yang kurang." → "Kamu cuma belum tahu jatahnya." */
export const N1HookD: React.FC = () => {
  return (
    <AbsoluteFill>
      <NightBg light={0.7} />
      <GlowLine
        words={[
          { t: "Bukan" },
          { t: " gajinya" },
          { t: " yang" },
          { t: " kurang." },
        ]}
        at={6}
        out={84}
        stagger={8}
        size={100}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />
      <GlowLine
        words={[
          { t: "Kamu" },
          { t: " cuma" },
          { t: " belum" },
          { t: " tahu" },
          { t: " jatahnya.", color: GREEN_TXT, glow: GLOW.green, bold: true },
        ]}
        at={104}
        out={194}
        stagger={8}
        size={100}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * E (chosen) — B + D.
 * "Tanggal 25 gajian!" shrinks while the day counts down in place, then the words around the number
 * swap: "Tapi tanggal 15 kok udah abis?" (the number is the match-cut slot). Then the reframe:
 * "Bukan gajinya yang kurang." → "Kamu cuma belum tahu jatahnya."
 * 300 frames.
 */
export const N1HookE: React.FC = () => {
  const frame = useCurrentFrame();
  const b = base(104);
  const day = Math.round(interpolate(frame, [46, 94], [25, 15], clamp));
  const hot = interpolate(frame, [46, 94], [0, 1], clamp);
  const shrink = interpolate(frame, [40, 96, 102, 132], [1, 0.62, 0.62, 1], {
    ...clamp,
    easing: glide,
  });
  const x = interpolate(frame, [100, 132], [972, 902], {
    ...clamp,
    easing: glide,
  });
  const side: React.CSSProperties = { position: "absolute", top: 0, ...b };
  const lineOut = veil(frame, -30, 150, 1, 16, 0);

  return (
    <AbsoluteFill>
      <NightBg
        light={interpolate(
          frame,
          [0, 60, 100, 160],
          [0.55, 0.7, 0.35, 0.5],
          clamp,
        )}
      />
      <div
        style={{
          position: "absolute",
          left: x,
          top: 480,
          scale: String(shrink),
          ...lineOut,
          opacity:
            (lineOut.opacity as number) *
            interpolate(frame, [40, 96, 132], [1, 0.82, 1], clamp),
          translate: "-50% 0px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            ...b,
            fontWeight: 700,
            fontVariantNumeric: "tabular-nums",
            color: hot < 0.5 ? GREEN_TXT : RED_TXT,
            ...veil(frame, 4, 1e9, 24, 16, 0),
          }}
        >
          {day}
        </span>
        <span
          style={{ ...side, right: "100%", ...veil(frame, 8, 100, 22, 14, 6) }}
        >
          Tanggal{" "}
        </span>
        <span
          style={{ ...side, left: "100%", ...veil(frame, 14, 100, 22, 14, 6) }}
        >
          {" "}
          gajian!
        </span>
        <span
          style={{
            ...side,
            right: "100%",
            ...veil(frame, 106, 1e9, 24, 16, 6),
          }}
        >
          Tapi tanggal{" "}
        </span>
        <span
          style={{ ...side, left: "100%", ...veil(frame, 112, 1e9, 24, 16, 6) }}
        >
          {" "}
          kok udah abis?
        </span>
      </div>

      <GlowLine
        words={[
          { t: "Bukan" },
          { t: " gajinya" },
          { t: " yang" },
          { t: " kurang." },
        ]}
        at={168}
        out={226}
        stagger={7}
        size={100}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />
      <GlowLine
        words={[
          { t: "Kamu" },
          { t: " cuma" },
          { t: " belum" },
          { t: " tahu" },
          { t: " jatahnya.", color: GREEN_TXT, bold: true },
        ]}
        at={236}
        out={290}
        stagger={7}
        size={100}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 480,
          textAlign: "center",
        }}
      />
    </AbsoluteFill>
  );
};
