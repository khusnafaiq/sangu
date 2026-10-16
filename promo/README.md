# Iklan motion Sangu

Video iklan Sangu, dibuat dengan [Remotion](https://www.remotion.dev).
UI di video dibangun ulang dari tampilan asli Sangu (warna, font Plus Jakarta Sans, logo di `brand/`).

| Komposisi | Format | Isi |
| --- | --- | --- |
| `SanguNight` | 16:9, 1920×1080, ±47 dtk | Versi utama: gelap, minimal, upbeat (musik 120 BPM, potongan di ketukan), match cut, voice-over |
| `SanguAd` | 9:16, 1080×1920, 30 dtk | Versi pertama untuk Reels/TikTok ([`export/sangu-ad-9x16.mp4`](export/sangu-ad-9x16.mp4)) |
| `SanguFilm` | 16:9 | Draf gaya terang (storyboard v2), tidak dipakai |

## Mulai

```console
cd promo
npm i
npm run dev            # buka Remotion Studio untuk preview & edit
```

## Render

```console
npm run render:film    # SanguNight → out/sangu-film-16x9.mp4
npm run render         # SanguAd   → out/sangu-ad-9x16.mp4
```

Voice-over sudah ada di repo (`public/audio/vo/`), jadi render tidak butuh API key.
Musik dan efek suara disintesis dari nol oleh `scripts/make-audio.mjs` (tanpa sampel, bebas lisensi), dijalankan otomatis
oleh `dev` dan `render`.

## Timing

`src/night/timeline.ts` adalah sumber waktu SanguNight: durasi dan kecepatan tiap scene, kapan tiap kalimat
voice-over diputar (termasuk kalimat yang dipotong di jedanya), dan efek suara. Musik di `make-audio.mjs` mengikuti
potongan-potongan itu.

## Voice-over (Gemini TTS)

Naskahnya ada di `src/night/voiceover.json`. Untuk membuat ulang suaranya, simpan API key Gemini kamu di
`promo/.env` (sudah di-ignore Git):

```console
GEMINI_API_KEY=xxxx
```

Lalu:

```console
npm run voiceover               # semua kalimat
npm run voiceover -- vo02 vo07  # hanya kalimat tertentu
npm run voiceover -- --finish   # tanpa API: proses ulang dari rekaman mentah
```

Rekaman mentah disimpan di `public/audio/vo/raw/`, lalu diproses ke `public/audio/vo/`: narator dipercepat 1,08×
tanpa mengubah nada, dan semua kalimat disamakan kerasnya. Durasi hasilnya ditulis ke `voiceover.json`.
Rekaman baru punya jeda dan durasi yang berbeda, jadi setelah membuat ulang sebuah kalimat, cek posisinya di
`timeline.ts`.

Ganti suara dengan `GEMINI_TTS_VOICE` (narator, default `Laomedeia`) dan `GEMINI_TTS_USER_VOICE` (suara pengguna,
default `Leda`); ganti model dengan `GEMINI_TTS_MODEL`. Jangan commit API key.

## Struktur

- `src/night/` — versi utama: `SanguNight.tsx` (urutan scene), `timeline.ts`, `scenes/`, `kit.tsx` (latar glow,
  teks, lockup, HP), `Voiceover.tsx`, `NightSound.tsx`
- `src/components/` — mockup iPhone, layar app (Ringkasan, Catat), ikon
- `src/film/` — draf gaya terang dan layar tambahan (Wallet, Rekapan, Selamat datang)
- `src/scenes/`, `src/SanguAd.tsx` — versi 9:16 pertama
- `src/theme.ts` — token warna & font yang sama dengan `index.html`
