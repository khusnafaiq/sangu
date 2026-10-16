import React from "react";
import { getStaticFiles, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import script from "./voiceover.json";

// Plays the Gemini TTS lines made by `npm run voiceover` (public/audio/vo/<id>.wav) at their frames
// on the SanguNight timeline. Lines that have not been generated yet are skipped, so the film
// still renders without a voice-over.
export const Voiceover: React.FC = () => {
  const have = new Set(getStaticFiles().map((f) => f.name));
  return (
    <>
      {script.lines.map((l) =>
        have.has(`audio/vo/${l.id}.wav`) ? (
          <Audio
            key={l.id}
            name={`VO ${l.id}`}
            src={staticFile(`audio/vo/${l.id}.wav`)}
            from={l.from}
            volume={1}
          />
        ) : null,
      )}
    </>
  );
};
