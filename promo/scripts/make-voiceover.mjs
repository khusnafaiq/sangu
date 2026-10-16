// Generates the voice-over with Gemini TTS into public/audio/vo/<id>.wav, one file per line of
// src/night/voiceover.json. The film plays whatever files exist (see src/night/Voiceover.tsx).
//
//   GEMINI_API_KEY=... npm run voiceover            # all lines
//   GEMINI_API_KEY=... npm run voiceover -- vo02 vo07   # only these
//
// Optional: GEMINI_TTS_MODEL, GEMINI_TTS_VOICE (narrator), GEMINI_TTS_USER_VOICE (the person talking to the app).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "audio", "vo");
const { fps, lines } = JSON.parse(readFileSync(join(ROOT, "src", "night", "voiceover.json"), "utf8"));

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Set GEMINI_API_KEY first, e.g. GEMINI_API_KEY=xxxx npm run voiceover");
  process.exit(1);
}
const MODELS = process.env.GEMINI_TTS_MODEL
  ? [process.env.GEMINI_TTS_MODEL]
  : ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"];
const VOICES = {
  narrator: process.env.GEMINI_TTS_VOICE || "Sulafat",
  user: process.env.GEMINI_TTS_USER_VOICE || "Leda",
};
const STYLE = {
  narrator:
    "Bacakan dalam bahasa Indonesia dengan suara hangat, tenang, dan percaya diri, tempo agak pelan, seperti narator iklan aplikasi premium. Jangan tambahkan kata apa pun:",
  user: "Ucapkan dalam bahasa Indonesia dengan santai dan natural, seperti orang yang sedang bicara ke HP untuk mencatat pengeluaran. Jangan tambahkan kata apa pun:",
};

const only = process.argv.slice(2);
const todo = only.length ? lines.filter((l) => only.includes(l.id)) : lines;
mkdirSync(OUT, { recursive: true });

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
      if (res.status === 404 || res.status === 400) break; // try the next model
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

for (const l of todo) {
  const { pcm, rate, model } = await tts(`${STYLE[l.voice]} ${l.text}`, VOICES[l.voice]);
  const clip = trim(pcm, rate);
  writeFileSync(join(OUT, `${l.id}.wav`), wav(clip, rate));
  const secs = clip.length / 2 / rate;
  const next = lines[lines.indexOf(l) + 1];
  const room = next ? (next.from - l.from) / fps : Infinity;
  console.log(
    `${l.id} ${secs.toFixed(2)}s (${model}, ${VOICES[l.voice]})${secs > room ? `  ! longer than the ${room.toFixed(2)}s before the next line` : ""}`,
  );
}
