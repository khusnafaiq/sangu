// Generates the voice-over with Gemini TTS, one file per line of src/night/voiceover.json.
//
//   npm run voiceover                   # all lines
//   npm run voiceover -- vo02 vo07      # only these
//   npm run voiceover -- --finish       # no API call: redo the finishing step from the raw takes
//
// Each take is saved as public/audio/vo/raw/<id>.wav, then finished into public/audio/vo/<id>.wav:
// sped up without changing pitch (narrator 1.08×, or the line's own "speed") and levelled to the
// same loudness, using the ffmpeg that ships with Remotion. The finished length is written back to
// voiceover.json ("dur"), which the film uses for music ducking. Where each line plays is set in
// src/night/timeline.ts, so after regenerating a line check its cue there.
//
// A line may carry its own "style" (delivery notes such as a sigh), used instead of the default.
// Optional: GEMINI_TTS_MODEL, GEMINI_TTS_VOICE (narrator), GEMINI_TTS_USER_VOICE (the person talking to the app).
// Any of these can also live in promo/.env (gitignored); variables already set in the shell win.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio", "vo");
const RAW = join(OUT, "raw");
const SCRIPT = join(ROOT, "src", "night", "voiceover.json");
const script = JSON.parse(readFileSync(SCRIPT, "utf8"));

const ENV = join(ROOT, ".env");
if (existsSync(ENV)) {
  for (const line of readFileSync(ENV, "utf8").split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !line.trimStart().startsWith("#") && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^(["'])(.*)\1$/, "$2");
    }
  }
}

const args = process.argv.slice(2);
const finishOnly = args.includes("--finish");
const only = args.filter((a) => !a.startsWith("--"));
const todo = only.length ? script.lines.filter((l) => only.includes(l.id)) : script.lines;

const KEY = process.env.GEMINI_API_KEY;
if (!KEY && !finishOnly) {
  console.error("Set GEMINI_API_KEY first: put GEMINI_API_KEY=xxxx in promo/.env, or run GEMINI_API_KEY=xxxx npm run voiceover");
  process.exit(1);
}
const MODELS = process.env.GEMINI_TTS_MODEL
  ? [process.env.GEMINI_TTS_MODEL]
  : ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
const VOICES = {
  narrator: process.env.GEMINI_TTS_VOICE || "Laomedeia",
  user: process.env.GEMINI_TTS_USER_VOICE || "Leda",
};
// Short English directives: long ones are sometimes read out loud as part of the line.
const STYLE = {
  narrator: "Say in Indonesian, upbeat and energetic, at a fast, punchy pace like a modern app ad:",
  user: "Say in casual Indonesian at a quick, natural pace, like someone dictating an expense to their phone:",
};
const SPEED = { narrator: 1.08, user: 1 };
const LOUDNESS = "I=-16:TP=-1.5:LRA=11";

// Rough length of a line spoken briskly (~5 syllables a second), used to catch takes where the
// model read the directive aloud or rambled.
const expected = (text) => (text.match(/[aiueo]+/gi) || []).length / 5;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function tts(text, voice) {
  let lastError;
  for (const model of MODELS) {
    for (let attempt = 0; attempt < 4; attempt++) {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } },
          },
        }),
      });
      if (res.ok) {
        const json = await res.json();
        const part = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data);
        if (!part) throw new Error(`${model}: no audio in the response`);
        const rate = Number(/rate=(\d+)/.exec(part.inlineData.mimeType || "")?.[1] || 24000);
        return { pcm: Buffer.from(part.inlineData.data, "base64"), rate, model };
      }
      const body = await res.text();
      lastError = `${model}: HTTP ${res.status} ${body.slice(0, 300)}`;
      if (res.status === 404) break; // try the next model
      if (res.status === 400) {
        if (attempt >= 1) break; // the preview model sometimes refuses a line once; then fall back
        continue;
      }
      if (res.status === 429 || res.status >= 500) {
        await sleep(2000 * 2 ** attempt);
        continue;
      }
      throw new Error(lastError);
    }
  }
  throw new Error(lastError);
}

/** Trim leading/trailing near-silence (keeps ~60 ms) from 16-bit mono PCM. */
function trim(pcm, rate) {
  const n = pcm.length / 2;
  const loud = (i) => Math.abs(pcm.readInt16LE(i * 2)) > 500;
  let a = 0;
  while (a < n && !loud(a)) a++;
  let b = n - 1;
  while (b > a && !loud(b)) b--;
  const pad = Math.round(rate * 0.06);
  return pcm.subarray(Math.max(0, a - pad) * 2, Math.min(n, b + pad) * 2);
}

function wav(pcm, rate) {
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);
  h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVEfmt ", 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(rate, 24);
  h.writeUInt32LE(rate * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

const ffmpeg = (...a) => {
  const r = spawnSync("npx", ["remotion", "ffmpeg", "-hide_banner", "-y", ...a], {
    cwd: ROOT,
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) throw new Error(`ffmpeg failed: ${(r.stderr || "").slice(-500)}`);
  return r.stderr;
};

/** Speed up (pitch kept) and level a raw take with two-pass loudnorm. Returns the length in seconds. */
function finish(l) {
  const src = join(RAW, `${l.id}.wav`);
  const dst = join(OUT, `${l.id}.wav`);
  const speed = l.speed ?? SPEED[l.voice];
  const tempo = speed === 1 ? "" : `atempo=${speed},`;
  const m = JSON.parse(ffmpeg("-i", src, "-af", `${tempo}loudnorm=${LOUDNESS}:print_format=json`, "-f", "null", "-").match(/\{[\s\S]*?\}/g).at(-1));
  const measured = `measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}`;
  ffmpeg("-i", src, "-af", `${tempo}loudnorm=${LOUDNESS}:${measured}:linear=true`, "-ar", "24000", "-ac", "1", "-c:a", "pcm_s16le", dst);
  return (readFileSync(dst).length - 44) / 2 / 24000;
}

mkdirSync(RAW, { recursive: true });
for (const l of todo) {
  let note = "";
  if (!finishOnly) {
    // Up to 3 takes when a take is far longer than the line should be; keep the shortest.
    let best;
    for (let take = 0; take < 3; take++) {
      const { pcm, rate, model } = await tts(`${l.style || STYLE[l.voice]} ${l.text}`, VOICES[l.voice]);
      const clip = trim(pcm, rate);
      const secs = clip.length / 2 / rate;
      if (!best || secs < best.secs) best = { clip, rate, model, secs };
      if (secs <= expected(l.text) * 2 + 1) break;
      console.log(`${l.id} take ${take + 1} is ${secs.toFixed(2)}s, too long for the line; trying again`);
    }
    writeFileSync(join(RAW, `${l.id}.wav`), wav(best.clip, best.rate));
    note = ` (${best.model}, ${VOICES[l.voice]}, raw ${best.secs.toFixed(2)}s)`;
  } else if (!existsSync(join(RAW, `${l.id}.wav`))) {
    console.log(`${l.id} skipped: no raw take yet`);
    continue;
  }
  l.dur = Math.round(finish(l) * 100) / 100;
  console.log(`${l.id} ${l.dur.toFixed(2)}s${note}`);
}
writeFileSync(SCRIPT, JSON.stringify(script, null, 2) + "\n");
