// Where everything sits in SanguNight. 30 fps; the music runs at 120 BPM (1 beat = 15 frames,
// bars start at frame 30), so every cut lands on a beat and the logo and the ending on a bar.
//
// Each scene runs on its own timeline. Scenes first cut at a slower pace keep their frame numbers
// and play faster through `rate` (see Paced in kit.tsx): rate 1.5 over 150 frames shows the scene's
// first 225 frames. The `t` of every cue below is a frame on that scene's own timeline, so cues
// stay on their picture if a scene's pace changes.
//
// scripts/make-audio.mjs builds the music to these cuts (seconds = global frame / 30).

export const FPS = 30;

export const SCENES = [
  { id: "hook", name: "Hook", dur: 270, rate: 1 },
  { id: "logo", name: "Logo", dur: 75, rate: 1 },
  { id: "jatah", name: "Jatah harian", dur: 120, rate: 165 / 120 },
  { id: "catat", name: "Catat suara", dur: 285, rate: 1 },
  { id: "nota", name: "Nota & screenshot", dur: 105, rate: 150 / 105 },
  { id: "notif", name: "Notifikasi", dur: 150, rate: 195 / 150 },
  { id: "neon", name: "Rapi, otomatis", dur: 150, rate: 225 / 150 },
  { id: "privasi", name: "Privasi", dur: 135, rate: 1 },
  { id: "end", name: "Penutup", dur: 120, rate: 1 },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

export const TOTAL = SCENES.reduce((sum, s) => sum + s.dur, 0);

const START = Object.fromEntries(
  SCENES.map((s, i) => [
    s.id,
    SCENES.slice(0, i).reduce((sum, p) => sum + p.dur, 0),
  ]),
) as Record<SceneId, number>;

/** Global frame of frame `t` on a scene's own timeline. */
export const at = (scene: SceneId, t: number) => {
  const s = SCENES.find((x) => x.id === scene)!;
  return Math.round(START[scene] + t / s.rate);
};

/**
 * Voice-over lines from voiceover.json. A line split at a pause plays as several cues;
 * `from` / `to` are seconds in the finished file.
 */
export const VO_CUES: {
  line: string;
  scene: SceneId;
  t: number;
  from?: number;
  to?: number;
}[] = [
  { line: "vo01", scene: "hook", t: 4 }, // Tanggal dua lima. Gajian!
  { line: "vo02", scene: "hook", t: 72 }, // Tapi tanggal lima belas, kok udah abis?
  { line: "vo03", scene: "hook", t: 150 },
  { line: "vo04", scene: "hook", t: 208 },
  { line: "vo05", scene: "logo", t: 4 }, // Kenalin, Sangu.
  { line: "vo06", scene: "jatah", t: 11 },
  { line: "vo07", scene: "catat", t: 6, to: 0.45 }, // Ehem…
  { line: "vo07", scene: "catat", t: 27, from: 1.2 }, // beli kopi susu … pakai cash.
  { line: "vo08", scene: "catat", t: 254 }, // Cukup ngomong.
  { line: "vo09", scene: "nota", t: 6 },
  { line: "vo10", scene: "notif", t: 4 }, // Bayar seperti biasa.
  { line: "vo11", scene: "notif", t: 118, to: 0.95 }, // Notif masuk,
  { line: "vo11", scene: "notif", t: 151, from: 1.0 }, // tinggal simpan. ("simpan" on the tap)
  { line: "vo12", scene: "neon", t: 84 }, // Semua rapi, otomatis.
  { line: "vo13", scene: "privasi", t: 4, to: 0.95 }, // Tanpa login.
  { line: "vo13", scene: "privasi", t: 32, from: 1.3 }, // Tanpa akun.
  { line: "vo14", scene: "privasi", t: 66 }, // Datamu cuma di HP kamu.
  { line: "vo15", scene: "end", t: 4, from: 0.85 }, // Tenang sampai gajian.
  { line: "vo15", scene: "end", t: 54, to: 0.8 }, // Sangu. (as the wordmark appears)
];

/** Sound effects on cuts and UI moments. */
export const SFX_CUES: {
  file: string;
  scene: SceneId;
  t: number;
  vol: number;
}[] = [
  // soft swishes into the blur cuts
  ...(["jatah", "catat", "nota", "notif", "privasi", "end"] as const).map(
    (scene) => ({ file: "sfx-swish.wav", scene, t: -4, vol: 0.22 }),
  ),
  { file: "sfx-drain.wav", scene: "hook", t: 76, vol: 0.35 }, // 25 → 15
  { file: "sfx-shimmer.wav", scene: "logo", t: 2, vol: 0.3 },
  { file: "sfx-pop.wav", scene: "jatah", t: 116, vol: 0.25 }, // the daily ring fills
  { file: "sfx-pop.wav", scene: "catat", t: 248, vol: 0.3 }, // two transactions appear
  { file: "sfx-pop.wav", scene: "catat", t: 254, vol: 0.3 },
  { file: "sfx-ding.wav", scene: "catat", t: 260, vol: 0.28 },
  { file: "sfx-scan.wav", scene: "nota", t: 18, vol: 0.2 },
  { file: "sfx-ding.wav", scene: "nota", t: 56, vol: 0.25 },
  { file: "sfx-pop.wav", scene: "nota", t: 88, vol: 0.3 },
  { file: "sfx-pop.wav", scene: "nota", t: 94, vol: 0.3 },
  { file: "sfx-notif.wav", scene: "notif", t: 52, vol: 0.4 }, // notification drops in
  { file: "sfx-tap.wav", scene: "notif", t: 87, vol: 0.45 }, // tap it
  { file: "sfx-tap.wav", scene: "notif", t: 189, vol: 0.45 }, // tap Simpan
  { file: "sfx-ding.wav", scene: "notif", t: 194, vol: 0.4 },
  { file: "sfx-swish.wav", scene: "neon", t: 156, vol: 0.28 }, // swipe to Rekapan
  { file: "sfx-pulse.wav", scene: "privasi", t: 110, vol: 0.7 }, // heartbeat, thumps at 112 and 124
  { file: "sfx-shimmer.wav", scene: "end", t: 45, vol: 0.3 }, // final logo
];
