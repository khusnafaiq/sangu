import React from "react";
import { getStaticFiles, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, VO_CUES, at } from "./timeline";

// Plays the voice-over made by `npm run voiceover` (public/audio/vo/<id>.wav) at the cues in
// timeline.ts. Lines that have not been generated are skipped, so the film still renders without them.
export const Voiceover: React.FC = () => {
  const have = new Set(getStaticFiles().map((f) => f.name));
  return (
    <>
      {VO_CUES.map((c, i) =>
        have.has(`audio/vo/${c.line}.wav`) ? (
          <Audio
            key={i}
            name={`VO ${c.line}`}
            src={staticFile(`audio/vo/${c.line}.wav`)}
            from={at(c.scene, c.t)}
            trimBefore={c.from ? Math.round(c.from * FPS) : undefined}
            trimAfter={c.to ? Math.round(c.to * FPS) : undefined}
            volume={0.9}
          />
        ) : null,
      )}
    </>
  );
};
