# Iklan motion Sangu

Video iklan vertikal 9:16 (1080×1920, 30 fps, 30 detik) untuk Reels / TikTok / Shorts / Story,
dibuat dengan [Remotion](https://www.remotion.dev). UI di video dibangun ulang dari tampilan asli
Sangu (warna, font Plus Jakarta Sans, logo dari `brand/`), jadi tetap tajam di resolusi penuh.

Hasil render: [`export/sangu-ad-9x16.mp4`](export/sangu-ad-9x16.mp4)

## Alur iklan

| Detik | Scene | Isi |
| --- | --- | --- |
| 0–4 | Hook | "Baru tanggal 15," saldo Rp 4,5 jt meleleh jadi Rp 87.000, gajian masih 10 hari lagi |
| 3,5–6,5 | Brand | Logo Sangu + "Sangu hari ini, tenang sampai gajian." (musik drop di sini) |
| 6–11 | Jatah harian | "Aman dipakai hari ini" Rp 316.350 = sisa budget ÷ hari ke gajian |
| 10,5–15,5 | Catat suara | "Kopi susu 28rb pakai GoPay **dan** parkir 5rb" jadi 2 transaksi |
| 15–19 | Foto nota | Nota Indomaret dipindai, total terbaca; 4 cara catat |
| 18,5–23,5 | Rekapan | Rekapan per kategori + streak disiplin 28 hari |
| 23–26,5 | Privasi | Tanpa login, tanpa akun, data di HP sendiri |
| 26–30 | CTA | Mulai catat sekarang · khusnafaiq.github.io/sangu |

## Perintah

```console
npm i
npm run dev      # buka Remotion Studio untuk preview & edit
npm run render   # render ke out/sangu-ad-9x16.mp4
```

Musik dan efek suara disintesis dari nol oleh `scripts/make-audio.mjs` (tanpa sampel, bebas lisensi).
`npm run dev` dan `npm run render` menjalankannya otomatis; hasilnya di `public/audio/` (tidak di-commit).

## Struktur

- `src/SanguAd.tsx` — urutan scene, transisi, musik
- `src/scenes/` — satu file per scene (masing-masing juga bisa dibuka sendiri di Studio, folder *SanguAd-Scenes*)
- `src/components/` — mockup iPhone, layar app (Ringkasan & Catat), ikon, background
- `src/theme.ts` — token warna & font yang sama dengan `index.html`
