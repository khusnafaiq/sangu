import React from "react";
import { getStaticFiles, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import script from "./voiceover.json";

// Sound for SanguNight on its own timeline (global frames): the music bed, ducked under the
// voice-over lines that exist, plus small effects on cuts and UI moments.

const SFX: { file: string; at: number; vol: number }[] = [
  // soft swishes on the blur cuts
  ...[300, 390, 555, 855, 1005, 1425, 1615].map((at) => ({
    file: "sfx-swish.wav",
    at,
    vol: 0.22,
  })),
  { file: "sfx-shimmer.wav", at: 304, vol: 0.3 }, // logo
  { file: "sfx-pop.wav", at: 506, vol: 0.25 }, // the daily number is highlighted
  { file: "sfx-pop.wav", at: 793, vol: 0.3 }, // two transactions appear
  { file: "sfx-pop.wav", at: 799, vol: 0.3 },
  { file: "sfx-ding.wav", at: 806, vol: 0.28 },
  { file: "sfx-scan.wav", at: 869, vol: 0.2 }, // receipt + screenshot scan
  { file: "sfx-ding.wav", at: 909, vol: 0.25 },
  { file: "sfx-pop.wav", at: 943, vol: 0.3 },
  { file: "sfx-pop.wav", at: 949, vol: 0.3 },
  { file: "sfx-notif.wav", at: 1047, vol: 0.4 }, // notification drops in
  { file: "sfx-tap.wav", at: 1082, vol: 0.45 }, // tap the notification
  { file: "sfx-tap.wav", at: 1188, vol: 0.45 }, // tap Simpan
  { file: "sfx-ding.wav", at: 1193, vol: 0.4 },
  { file: "sfx-swish.wav", at: 1356, vol: 0.28 }, // swipe to Rekapan
  { file: "sfx-shimmer.wav", at: 1676, vol: 0.3 }, // final logo
];

const FPS = script.fps;
const MUSIC = 0.6;

export const NightSound: React.FC<{ total: number }> = ({ total }) => {
  const have = new Set(getStaticFiles().map((f) => f.name));
  // speech windows of the generated lines (length estimated from the text)
  const windows = script.lines
    .filter((l) => have.has(`audio/vo/${l.id}.wav`))
    .map((l) => [
      l.from - 4,
      l.from + Math.round((l.text.length / 13) * FPS) + 8,
    ]);
  const duck = (f: number) =>
    windows.reduce(
      (g, [a, b]) =>
        Math.min(
          g,
          interpolate(f, [a - 6, a, b, b + 10], [1, 0.42, 0.42, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        ),
      1,
    );

  return (
    <>
      <Audio
        name="Music"
        src={staticFile("audio/music-night.wav")}
        volume={(f) =>
          MUSIC *
          duck(f) *
          interpolate(f, [0, 4, total - 30, total], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {SFX.map((s, i) => (
        <Audio
          key={i}
          name={s.file.replace(".wav", "")}
          src={staticFile(`audio/${s.file}`)}
          from={s.at}
          volume={s.vol}
        />
      ))}
    </>
  );
};
