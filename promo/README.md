# Iklan motion Sangu

Video iklan Sangu, dibuat dengan [Remotion](https://www.remotion.dev).
UI di video dibangun ulang dari tampilan asli Sangu (warna, font Plus Jakarta Sans, logo di `brand/`).

| Komposisi | Format | Isi |
| --- | --- | --- |
| `SanguNight` | 16:9, 1920×1080, ±50 dtk | Versi utama: gelap, minimal, match cut, glow latar, voice-over |
| `SanguAd` | 9:16, 1080×1920, 30 dtk | Versi pertama untuk Reels/TikTok ([`export/sangu-ad-9x16.mp4`](export/sangu-ad-9x16.mp4)) |
| `SanguFilm` | 16:9 | Draf gaya terang (storyboard v2), tidak dipakai |

## Mulai

```console
cd promo
npm i
npm run dev            # buka Remotion Studio untuk preview & edit
```

## Voice-over (Gemini TTS)

Naskah dan waktunya ada di `src/night/voiceover.json`. Buat file suaranya dengan API key Gemini kamu:

```console
GEMINI_API_KEY=xxxx npm run voiceover               # semua kalimat
GEMINI_API_KEY=xxxx npm run voiceover -- vo02 vo07  # hanya kalimat tertentu
```

Hasilnya masuk ke `public/audio/vo/` dan otomatis diputar di detik yang tepat (kalimat yang belum dibuat dilewati).
Script mencetak durasi tiap kalimat dan memberi tanda `!` kalau lebih panjang dari jarak ke kalimat berikutnya.
Ganti suara dengan `GEMINI_TTS_VOICE` (narator, default `Sulafat`) dan `GEMINI_TTS_USER_VOICE` (suara pengguna, default `Leda`);
ganti model dengan `GEMINI_TTS_MODEL`. Jangan commit API key.

## Render

```console
npm run render:film    # SanguNight → out/sangu-film-16x9.mp4
npm run render         # SanguAd   → out/sangu-ad-9x16.mp4
```

Musik dan efek suara disintesis dari nol oleh `scripts/make-audio.mjs` (tanpa sampel, bebas lisensi), dijalankan otomatis
oleh `dev` dan `render`.

## Struktur

- `src/night/` — versi utama: `SanguNight.tsx` (urutan scene), `scenes/`, `kit.tsx` (latar glow, teks, lockup, HP), `Voiceover.tsx`
- `src/components/` — mockup iPhone, layar app (Ringkasan, Catat), ikon
- `src/film/` — draf gaya terang dan layar tambahan (Wallet, Rekapan, Selamat datang)
- `src/scenes/`, `src/SanguAd.tsx` — versi 9:16 pertama
- `src/theme.ts` — token warna & font yang sama dengan `index.html`
