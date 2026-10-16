// Synthesises the ad's music bed and sound effects into public/audio/*.wav.
// Everything is generated from scratch (no samples), so there is nothing to license.
//   node scripts/make-audio.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SR = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
mkdirSync(OUT, { recursive: true });

// ---------- helpers ----------
let seed = 1234567;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};
const noise = () => rnd() * 2 - 1;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const buf = (sec) => [new Float32Array(Math.ceil(sec * SR)), new Float32Array(Math.ceil(sec * SR))];

class Biquad {
  constructor(type, freq, q = 0.707) {
    this.type = type;
    this.q = q;
    this.x1 = this.x2 = this.y1 = this.y2 = 0;
    this.set(freq);
  }
  set(freq) {
    const w = (2 * Math.PI * Math.min(freq, SR * 0.45)) / SR;
    const cos = Math.cos(w);
    const alpha = Math.sin(w) / (2 * this.q);
    let b0, b1, b2;
    if (this.type === "lp") [b0, b1, b2] = [(1 - cos) / 2, 1 - cos, (1 - cos) / 2];
    else if (this.type === "hp") [b0, b1, b2] = [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2];
    else [b0, b1, b2] = [alpha, 0, -alpha]; // band-pass
    const a0 = 1 + alpha;
    this.b0 = b0 / a0;
    this.b1 = b1 / a0;
    this.b2 = b2 / a0;
    this.a1 = (-2 * cos) / a0;
    this.a2 = (1 - alpha) / a0;
  }
  run(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1;
    this.x1 = x;
    this.y2 = this.y1;
    this.y1 = y;
    return y;
  }
}

const add = (b, t0, i, l, r = l) => {
  const n = Math.floor(t0 * SR) + i;
  if (n >= 0 && n < b[0].length) {
    b[0][n] += l;
    b[1][n] += r;
  }
};

// Schroeder reverb on a stereo buffer (returns wet only).
const reverb = (b, size = 1, damp = 0.35) => {
  const out = [new Float32Array(b[0].length), new Float32Array(b[0].length)];
  for (let ch = 0; ch < 2; ch++) {
    const combs = [1557, 1617, 1491, 1422].map((d) => ({ d: Math.floor(d * size) + ch * 23, buf: new Float32Array(4000), i: 0, lp: 0 }));
    const aps = [225, 556].map((d) => ({ d: d + ch * 11, buf: new Float32Array(1000), i: 0 }));
    for (let n = 0; n < b[ch].length; n++) {
      const x = b[ch][n];
      let s = 0;
      for (const c of combs) {
        const y = c.buf[c.i];
        c.lp = y * (1 - damp) + c.lp * damp;
        c.buf[c.i] = x + c.lp * 0.84;
        c.i = (c.i + 1) % c.d;
        s += y;
      }
      s *= 0.25;
      for (const a of aps) {
        const y = a.buf[a.i];
        a.buf[a.i] = s + y * 0.5;
        a.i = (a.i + 1) % a.d;
        s = y - s * 0.5;
      }
      out[ch][n] = s;
    }
  }
  return out;
};

const mix = (dst, src, g = 1) => {
  for (let ch = 0; ch < 2; ch++) for (let n = 0; n < dst[ch].length && n < src[ch].length; n++) dst[ch][n] += src[ch][n] * g;
};

const writeWav = (name, b, peak = 0.89) => {
  let max = 1e-9;
  for (const ch of b) for (const v of ch) max = Math.max(max, Math.abs(v));
  const g = peak / max;
  const n = b[0].length;
  const data = Buffer.alloc(44 + n * 4);
  data.write("RIFF", 0);
  data.writeUInt32LE(36 + n * 4, 4);
  data.write("WAVEfmt ", 8);
  data.writeUInt32LE(16, 16);
  data.writeUInt16LE(1, 20);
  data.writeUInt16LE(2, 22);
  data.writeUInt32LE(SR, 24);
  data.writeUInt32LE(SR * 4, 28);
  data.writeUInt16LE(4, 32);
  data.writeUInt16LE(16, 34);
  data.write("data", 36);
  data.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    for (let ch = 0; ch < 2; ch++) {
      const v = Math.max(-1, Math.min(1, b[ch][i] * g));
      data.writeInt16LE(Math.round(v * 32767), 44 + i * 4 + ch * 2);
    }
  }
  writeFileSync(join(OUT, name), data);
  console.log("wrote", name, (n / SR).toFixed(2) + "s");
};

// ---------- instruments ----------
const kick = (b, t0, g = 1) => {
  let ph = 0;
  for (let i = 0; i < SR * 0.4; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (44 + 120 * Math.exp(-t * 30))) / SR;
    const v = Math.tanh(1.6 * Math.sin(ph) * Math.exp(-t * 8.5)) * g + (i < 120 ? noise() * 0.25 * g * (1 - i / 120) : 0);
    add(b, t0, i, v);
  }
};
const clap = (b, t0, g = 1) => {
  const bp = new Biquad("bp", 1600, 0.9);
  for (let i = 0; i < SR * 0.22; i++) {
    const t = i / SR;
    const bursts = [0, 0.011, 0.022].reduce((a, o) => a + (t >= o ? Math.exp(-(t - o) * (o === 0.022 ? 22 : 180)) : 0), 0);
    const v = bp.run(noise()) * bursts * g * 1.6;
    add(b, t0, i, v * 0.9, v);
  }
};
const hat = (b, t0, g = 1, open = false, pan = 0) => {
  const hp = new Biquad("hp", 7500, 0.8);
  const dec = open ? 14 : 60;
  for (let i = 0; i < SR * (open ? 0.3 : 0.08); i++) {
    const v = hp.run(noise()) * Math.exp((-i / SR) * dec) * g;
    add(b, t0, i, v * (1 - pan), v * (1 + pan));
  }
};
const bassNote = (b, t0, dur, m, g = 1) => {
  const f = mtof(m);
  const lp = new Biquad("lp", 420, 1.1);
  let ph = 0;
  for (let i = 0; i < SR * (dur + 0.08); i++) {
    const t = i / SR;
    ph += f / SR;
    const saw = 2 * (ph % 1) - 1;
    const env = Math.min(1, t / 0.006) * (t > dur ? Math.exp(-(t - dur) * 40) : 1);
    const v = (Math.sin(2 * Math.PI * ph) * 0.8 + lp.run(saw) * 0.5) * env * g;
    add(b, t0, i, v);
  }
};
const padChord = (b, t0, dur, notes, g = 1, cutoff = 2200) => {
  for (const [k, m] of notes.entries()) {
    for (const det of [-0.11, 0, 0.11]) {
      const f = mtof(m + det);
      const lp = new Biquad("lp", cutoff, 0.6);
      let ph = rnd();
      const pan = det * 6 + (k % 2 ? 0.15 : -0.15);
      for (let i = 0; i < SR * (dur + 0.8); i++) {
        const t = i / SR;
        ph += f / SR;
        const env = Math.min(1, t / 0.35) * (t > dur ? Math.exp(-(t - dur) * 5) : 1);
        const v = lp.run(2 * (ph % 1) - 1) * env * g * 0.09;
        add(b, t0, i, v * (1 - pan), v * (1 + pan));
      }
    }
  }
};
const pluck = (b, t0, m, g = 1, pan = 0) => {
  const f = mtof(m);
  const lp = new Biquad("lp", 3000, 1.4);
  let ph = 0;
  for (let i = 0; i < SR * 0.5; i++) {
    const t = i / SR;
    ph += f / SR;
    lp.set(700 + 3800 * Math.exp(-t * 18));
    const sq = (ph % 1 < 0.5 ? 1 : -1) * 0.6 + (2 * (ph % 1) - 1) * 0.4;
    const v = lp.run(sq) * Math.exp(-t * 9) * Math.min(1, t / 0.002) * g * 0.35;
    add(b, t0, i, v * (1 - pan), v * (1 + pan));
  }
};
const riser = (b, t0, dur, g = 1) => {
  const bp = new Biquad("bp", 400, 2.2);
  for (let i = 0; i < SR * dur; i++) {
    const p = i / (SR * dur);
    bp.set(300 * Math.pow(30, p));
    const v = bp.run(noise()) * Math.pow(p, 2.2) * g * 1.5;
    add(b, t0, i, v * (1 - 0.3 * Math.sin(p * 20)), v * (1 + 0.3 * Math.sin(p * 20)));
  }
};
const impact = (b, t0, g = 1) => {
  let ph = 0;
  const lp = new Biquad("lp", 2500, 0.7);
  for (let i = 0; i < SR * 1.8; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (38 + 60 * Math.exp(-t * 10))) / SR;
    const v = (Math.sin(ph) * Math.exp(-t * 2.2) * 0.9 + lp.run(noise()) * Math.exp(-t * 5) * 0.45) * g;
    add(b, t0, i, v);
  }
};
const tick = (b, t0, g = 1, f = 2200, pan = 0) => {
  for (let i = 0; i < SR * 0.03; i++) {
    const t = i / SR;
    const v = (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.5 * t)) * Math.exp(-t * 260) * g;
    add(b, t0, i, v * (1 - pan), v * (1 + pan));
  }
};
const bell = (b, t0, f, g = 1, dec = 4, pan = 0) => {
  for (let i = 0; i < SR * 1.6; i++) {
    const t = i / SR;
    const v =
      (Math.sin(2 * Math.PI * f * t) * Math.exp(-t * dec) +
        0.35 * Math.sin(2 * Math.PI * f * 2.76 * t) * Math.exp(-t * dec * 2.2) +
        0.12 * Math.sin(2 * Math.PI * f * 5.4 * t) * Math.exp(-t * dec * 4)) *
      Math.min(1, t / 0.002) *
      g;
    add(b, t0, i, v * (1 - pan), v * (1 + pan));
  }
};
const pop = (b, t0, g = 1, f0 = 480, f1 = 1050) => {
  let ph = 0;
  for (let i = 0; i < SR * 0.12; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (f0 + (f1 - f0) * (1 - Math.exp(-t * 60)))) / SR;
    add(b, t0, i, Math.sin(ph) * Math.exp(-t * 38) * Math.min(1, t / 0.002) * g);
  }
};
const click = (b, t0, g = 1, f = 1800) => {
  const hp = new Biquad("hp", 2500, 0.7);
  for (let i = 0; i < SR * 0.035; i++) {
    const t = i / SR;
    add(b, t0, i, (hp.run(noise()) * Math.exp(-t * 400) + Math.sin(2 * Math.PI * f * t) * Math.exp(-t * 150) * 0.6) * g);
  }
};
const whoosh = (b, t0, dur = 0.6, g = 1, f0 = 350, f1 = 4200) => {
  const bpL = new Biquad("bp", f0, 1.3);
  const bpR = new Biquad("bp", f0, 1.3);
  for (let i = 0; i < SR * dur; i++) {
    const p = i / (SR * dur);
    const f = f0 * Math.pow(f1 / f0, Math.sin(p * Math.PI * 0.5));
    bpL.set(f);
    bpR.set(f * 1.07);
    const env = Math.pow(Math.sin(Math.PI * Math.min(1, p * 1.25)), 1.6) * (p > 0.8 ? 1 - (p - 0.8) * 5 * 0.9 : 1);
    add(b, t0, i, bpL.run(noise()) * env * g * (1.2 - p), bpR.run(noise()) * env * g * (0.4 + p));
  }
};

// ---------- music: 120 BPM, D major, drop at 3.5 s (frame 105 = brand reveal) ----------
const BEAT = 0.5;
const DROP = 3.5;
const LEN = 31.5;
const drums = buf(LEN);
const bass = buf(LEN);
const pads = buf(LEN);
const plucks = buf(LEN);
const fx = buf(LEN);

// Dmaj7 – Bm7 – Gmaj7 – A6, one chord per bar.
const PROG = [
  { root: 38, pad: [62, 66, 69, 73], arp: [74, 78, 81, 85] },
  { root: 35, pad: [62, 66, 69, 71], arp: [71, 74, 78, 81] },
  { root: 31, pad: [62, 66, 67, 71], arp: [74, 79, 83, 86] },
  { root: 33, pad: [61, 64, 66, 69], arp: [73, 76, 78, 81] },
];

// Intro (0 – 3.5 s): clock ticks, muffled pad, riser into the drop.
for (let t = 0; t < DROP - 0.01; t += BEAT) {
  tick(fx, t, 0.5, 2600, -0.3);
  tick(fx, t + BEAT / 2, 0.22, 1900, 0.3);
}
padChord(pads, 0, DROP - 0.2, [59, 62, 66, 69], 0.7, 520);
bassNote(bass, 0, DROP - 0.1, 35, 0.18);
riser(fx, 1.6, DROP - 1.6, 0.6);
impact(fx, DROP, 0.9);
hat(fx, DROP, 0.5, true);

const BREAK_FROM = DROP + 20 * 1; // 23.5 s: Privacy scene, drums drop out for a bar
const BREAK_TO = BREAK_FROM + 2;
const END = DROP + 26; // 29.5 s: final hit
const kicks = [];
for (let bar = 0; DROP + bar * 2 < END; bar++) {
  const t0 = DROP + bar * 2;
  const chord = PROG[bar % 4];
  const inBreak = t0 >= BREAK_FROM && t0 < BREAK_TO;
  padChord(pads, t0, 1.95, chord.pad, 1, inBreak ? 900 : 2400);
  for (let s = 0; s < 16; s++) {
    const t = t0 + s * (BEAT / 4);
    if (s % 2 === 0 || s % 4 === 3) pluck(plucks, t, chord.arp[(s * 3 + bar) % 4] + (s >= 8 && bar % 2 ? 12 : 0), s % 4 === 0 ? 1 : 0.6, s % 4 < 2 ? -0.45 : 0.45);
  }
  if (inBreak) continue;
  for (let beat = 0; beat < 4; beat++) {
    const t = t0 + beat * BEAT;
    kick(drums, t, 0.95);
    kicks.push(t);
    if (beat % 2 === 1) clap(drums, t, 0.55);
    hat(drums, t + BEAT / 2, 0.32, beat === 3, 0.25);
    hat(drums, t + BEAT * 0.75, 0.14, false, -0.25);
    // Off-beat house bass, with an octave pickup on beats 2 and 4.
    bassNote(bass, t + BEAT / 2, BEAT * 0.4, chord.root, 0.9);
    if (beat % 2 === 1) bassNote(bass, t + BEAT * 0.75, BEAT * 0.2, chord.root + 12, 0.5);
  }
}
riser(fx, BREAK_TO - 1.5, 1.5, 0.5);
impact(fx, BREAK_TO, 0.55);
// Final hit: tonic chord rings out under the CTA.
kick(drums, END, 1);
impact(fx, END, 0.7);
padChord(pads, END, 1.4, [62, 66, 69, 73, 78], 1.1, 2600);
for (const [k, m] of [74, 78, 81, 86].entries()) bell(plucks, END + k * 0.09, mtof(m), 0.18, 2.4, k % 2 ? 0.4 : -0.4);

// Sidechain pads & bass to the kick.
const duck = (b) => {
  for (let n = 0; n < b[0].length; n++) {
    const t = n / SR;
    let g = 1;
    for (let k = kicks.length - 1; k >= 0; k--) {
      if (kicks[k] <= t) {
        g = 1 - 0.55 * Math.exp(-(t - kicks[k]) * 9);
        break;
      }
    }
    b[0][n] *= g;
    b[1][n] *= g;
  }
};
duck(pads);
duck(bass);

const music = buf(LEN);
mix(music, drums, 0.9);
mix(music, bass, 0.55);
mix(music, pads, 0.5);
mix(music, plucks, 0.42);
mix(music, fx, 0.6);
const send = buf(LEN);
mix(send, pads, 0.5);
mix(send, plucks, 0.6);
mix(send, drums, 0.12);
mix(music, reverb(send, 1.1, 0.4), 0.55);
for (const ch of music) for (let n = 0; n < ch.length; n++) ch[n] = Math.tanh(ch[n] * 1.15);
writeWav("music.wav", music, 0.9);

// ---------- sound effects ----------
const sfx = (name, sec, fn, verb = 0) => {
  const b = buf(sec);
  fn(b);
  if (verb > 0) mix(b, reverb(b, 0.7, 0.3), verb);
  writeWav(name, b, 0.89);
};

sfx("sfx-whoosh.wav", 0.75, (b) => whoosh(b, 0, 0.7, 1));
sfx("sfx-pop.wav", 0.2, (b) => pop(b, 0, 1));
sfx("sfx-pops.wav", 1.0, (b) => [0, 1, 2, 3, 4].forEach((k) => pop(b, k * 0.15, 0.9, 420 + k * 70, 900 + k * 140)));
sfx("sfx-tap.wav", 0.08, (b) => click(b, 0, 1));
sfx("sfx-ding.wav", 1.6, (b) => {
  bell(b, 0, 1760, 0.8, 4.5, -0.15);
  bell(b, 0.085, 2637, 0.6, 4.5, 0.15);
}, 0.25);
sfx("sfx-shimmer.wav", 2.2, (b) => {
  [74, 78, 81, 86, 90].forEach((m, k) => bell(b, k * 0.06, mtof(m), 0.4, 3, k % 2 ? 0.5 : -0.5));
  whoosh(b, 0, 0.9, 0.25, 2000, 9000);
}, 0.6);
sfx("sfx-typing.wav", 1.8, (b) => {
  let t = 0;
  while (t < 1.65) {
    click(b, t, 0.5 + rnd() * 0.4, 1400 + rnd() * 900);
    t += 0.05 + rnd() * 0.06;
  }
});
// Balance draining: falling ticks that bunch up in the middle (matches the counter easing).
sfx("sfx-ticks.wav", 1.6, (b) => {
  for (let k = 0; k <= 26; k++) {
    const p = k / 26;
    const t = 1.47 * (p < 0.5 ? Math.pow(p * 2, 0.6) / 2 : 0.5 + Math.pow((p - 0.5) * 2, 1.8) / 2);
    tick(b, t, 0.8, 1700 - 1100 * p, k % 2 ? 0.2 : -0.2);
  }
});
sfx("sfx-thud.wav", 1.0, (b) => {
  let ph = 0;
  for (let i = 0; i < SR * 0.9; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (60 - 25 * Math.min(1, t * 3))) / SR;
    add(b, 0, i, Math.sin(ph) * Math.exp(-t * 4));
  }
  bell(b, 0, 220, 0.25, 6);
});
// Count-up: rising ticks slowing down (ease-out).
sfx("sfx-count.wav", 1.4, (b) => {
  for (let k = 0; k <= 18; k++) {
    const p = k / 18;
    tick(b, 1.27 * Math.pow(p, 2.2), 0.7, 900 + 900 * p);
  }
});
sfx("sfx-shutter.wav", 0.25, (b) => {
  click(b, 0, 1, 1200);
  click(b, 0.06, 0.8, 900);
});
sfx("sfx-scan.wav", 1.3, (b) => {
  let ph = 0;
  for (let i = 0; i < SR * 1.2; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * (300 + 500 * (t / 1.2))) / SR;
    const env = Math.sin((Math.PI * t) / 1.2);
    const v = Math.sin(ph) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 18 * t)) * env * 0.5;
    add(b, 0, i, v, v);
  }
}, 0.3);
sfx("sfx-streak.wav", 1.8, (b) => {
  for (let k = 0; k < 28; k++) {
    const hot = k >= 21;
    tick(b, (k / 28) * 1.53, hot ? 0.9 : 0.45, 800 + k * 45, k % 2 ? 0.25 : -0.25);
  }
});
sfx("sfx-lock.wav", 0.6, (b) => {
  click(b, 0, 0.8, 1500);
  click(b, 0.07, 1, 900);
  let ph = 0;
  for (let i = 0; i < SR * 0.4; i++) {
    const t = i / SR;
    ph += (2 * Math.PI * 110) / SR;
    add(b, 0.07, i, Math.sin(ph) * Math.exp(-t * 14) * 0.7);
  }
}, 0.2);
// Heartbeat under "Datamu cuma di HP kamu.": two soft sub thumps ("dug-dug").
sfx("sfx-pulse.wav", 1.4, (b) => {
  for (const [at, g] of [
    [0.06, 1],
    [0.46, 0.7],
  ]) {
    let ph = 0;
    for (let i = 0; i < SR * 0.5; i++) {
      const t = i / SR;
      ph += (2 * Math.PI * (48 + 40 * Math.exp(-t * 18))) / SR;
      add(b, at, i, Math.sin(ph) * Math.exp(-t * 9) * Math.min(1, t / 0.004) * g);
    }
  }
}, 0.15);

// ---------- music for SanguNight (16:9, ±58 s), 96 BPM, follows the cut ----------
// 0–3.3 hopeful plucks ("Tanggal 25 gajian!") → 3.3–5.3 everything sags and goes quiet
// ("Tapi tanggal 15 kok udah abis?") → dark pad for the reframe → 10 s logo opens the music →
// soft pulse under the features → lift at 40 s (hero shot) → strip back for privacy, silence
// just before the heartbeat (≈52 s) → final chord under the logo, tail to 58.2 s.
{
  const NLEN = 60;
  const BAR = 2.5; // 4 beats at 96 BPM
  const NB = BAR / 4;
  const nPad = buf(NLEN);
  const nBass = buf(NLEN);
  const nPluck = buf(NLEN);
  const nDrums = buf(NLEN);
  const nFx = buf(NLEN);
  const nKicks = [];

  const CH = [
    { root: 41, pad: [57, 60, 64, 67] }, // Fmaj9
    { root: 36, pad: [55, 60, 64, 69] }, // C6
    { root: 45, pad: [59, 60, 64, 67] }, // Am9
    { root: 43, pad: [57, 62, 64, 67] }, // G6sus
  ];

  // intro: hopeful plucks over a soft Fmaj9
  padChord(nPad, 0, 3.1, CH[0].pad, 0.8, 1300);
  [65, 69, 72, 76, 77, 76, 72, 69, 72, 76].forEach((m, k) => pluck(nPluck, 0.25 + k * (NB / 2), m, 0.55, k % 2 ? 0.35 : -0.35));
  bell(nPluck, 0.2, mtof(84), 0.12, 2.6);

  // the sag: a detuned pad bending down and closing, then silence
  for (const m of CH[0].pad) {
    const lp = new Biquad("lp", 1300, 0.7);
    let ph = rnd();
    for (let i = 0; i < SR * 2.1; i++) {
      const t = i / SR;
      const bend = Math.pow(2, (-1.2 * Math.min(1, t / 1.7)) / 12);
      ph += (mtof(m) * bend) / SR;
      lp.set(1300 - 1050 * Math.min(1, t / 1.6));
      const env = Math.min(1, t / 0.08) * Math.max(0, 1 - t / 2.0);
      const v = lp.run(2 * (ph % 1) - 1) * env * 0.09;
      add(nPad, 3.2, i, v);
    }
  }

  // the reframe: dark Am9 swell with a low drone
  padChord(nPad, 5.8, 4.0, CH[2].pad.map((m) => m - 12), 0.9, 650);
  bassNote(nBass, 5.8, 4.1, 33, 0.12);

  // 10 s: the logo opens it up
  impact(nFx, 10.0, 0.45);
  const LIFT = 40.0;
  const STRIP = 47.5;
  for (let bar = 0; 10 + bar * BAR < STRIP; bar++) {
    const t0 = 10 + bar * BAR;
    const ch = CH[bar % 4];
    const lifted = t0 >= LIFT;
    padChord(nPad, t0, BAR - 0.05, ch.pad, lifted ? 1.05 : 0.85, lifted ? 2600 : 1500);
    for (let beat = 0; beat < 4; beat++) {
      const t = t0 + beat * NB;
      if (t0 >= 13 && (lifted || beat % 2 === 0)) {
        kick(nDrums, t, lifted ? 0.8 : 0.55);
        nKicks.push(t);
      }
      if (lifted) hat(nDrums, t + NB / 2, 0.22, false, 0.2);
      bassNote(nBass, t, NB * 0.8, ch.root, beat === 0 ? 0.7 : 0.45);
      for (const h of [0, 0.5]) pluck(nPluck, t + h * NB, ch.pad[(beat * 2 + (h ? 1 : 0) + bar) % 4] + 12, lifted ? 0.5 : 0.32, h ? 0.4 : -0.4);
    }
  }
  riser(nFx, LIFT - 1.5, 1.5, 0.35);

  // privacy: pad only, then silence just before the heartbeat
  padChord(nPad, STRIP, 51.6 - STRIP, CH[0].pad, 0.8, 900);
  padChord(nPad, 52.6, 53.8 - 52.6, CH[0].pad, 0.7, 900);

  // the end: final Fmaj9 under the logo, bell arpeggio, long tail
  padChord(nPad, 53.8, 3.0, [...CH[0].pad, 72], 1.1, 2200);
  bassNote(nBass, 53.8, 3.2, 41, 0.32);
  [72, 76, 79, 84].forEach((m, k) => bell(nPluck, 55.9 + k * 0.12, mtof(m), 0.16, 2.2, k % 2 ? 0.4 : -0.4));

  // sidechain pads & bass to the kicks
  for (const b of [nPad, nBass]) {
    for (let n = 0; n < b[0].length; n++) {
      const t = n / SR;
      let g = 1;
      for (let k = nKicks.length - 1; k >= 0; k--) {
        if (nKicks[k] <= t) {
          g = 1 - 0.4 * Math.exp(-(t - nKicks[k]) * 8);
          break;
        }
      }
      b[0][n] *= g;
      b[1][n] *= g;
    }
  }

  const night = buf(NLEN);
  mix(night, nPad, 0.55);
  mix(night, nBass, 0.45);
  mix(night, nPluck, 0.4);
  mix(night, nDrums, 0.7);
  mix(night, nFx, 0.5);
  const nSend = buf(NLEN);
  mix(nSend, nPad, 0.5);
  mix(nSend, nPluck, 0.7);
  mix(night, reverb(nSend, 1.2, 0.45), 0.6);
  for (const ch of night) for (let n = 0; n < ch.length; n++) ch[n] = Math.tanh(ch[n] * 1.1);
  writeWav("music-night.wav", night, 0.9);
}

// Soft, airy swish for blur cuts in SanguNight.
sfx("sfx-swish.wav", 0.9, (b) => whoosh(b, 0, 0.85, 0.6, 900, 5200), 0.3);
// Notification chime: two soft bell notes.
sfx("sfx-notif.wav", 1.4, (b) => {
  bell(b, 0, mtof(88), 0.6, 5, -0.2);
  bell(b, 0.11, mtof(93), 0.5, 5, 0.2);
}, 0.3);
