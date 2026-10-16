import React from "react";
import { getStaticFiles, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import script from "./voiceover.json";
import { FPS, SFX_CUES, VO_CUES, at } from "./timeline";

// Sound for SanguNight on the global timeline: the music bed, ducked under the voice-over cues
// that have a file, plus small effects on cuts and UI moments (see timeline.ts).

const MUSIC = 0.53;
const SFX = 0.9;

export const NightSound: React.FC<{ total: number }> = ({ total }) => {
  const have = new Set(getStaticFiles().map((f) => f.name));
  const dur = Object.fromEntries(
    script.lines.map((l) => [l.id, (l as { dur?: number }).dur ?? 2]),
  );
  // speech windows of the cues that play
  const windows = VO_CUES.filter((c) => have.has(`audio/vo/${c.line}.wav`)).map(
    (c) => {
      const a = at(c.scene, c.t);
      const len = (c.to ?? dur[c.line]) - (c.from ?? 0);
      return [a, a + Math.round(len * FPS)];
    },
  );
  const duck = (f: number) =>
    windows.reduce(
      (g, [a, b]) =>
        Math.min(
          g,
          interpolate(f, [a - 5, a, b, b + 8], [1, 0.45, 0.45, 1], {
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
          interpolate(f, [0, 2, total - 20, total], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
      {SFX_CUES.map((s, i) => (
        <Audio
          key={i}
          name={s.file.replace(".wav", "")}
          src={staticFile(`audio/${s.file}`)}
          from={at(s.scene, s.t)}
          volume={s.vol * SFX}
        />
      ))}
    </>
  );
};
