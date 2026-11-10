# Panduan Website Jema Kidswear

## Untuk pemilik toko: cara update katalog

Semua produk di website diambil dari **Google Sheets**. Cukup edit sheet, website ikut berubah (tunggu ±5 menit).

### Kolom di sheet

| Kolom | Wajib? | Isi |
|---|---|---|
| **Nama** | ✅ | Nama produk |
| **Harga** | ✅ | Angka saja, contoh `69000` |
| **Link Shopee** | ✅ | Link produk di Shopee |
| **Foto** | ✅ | Link foto. **Boleh lebih dari satu** (lihat cara di bawah) |
| Kategori | opsional | Pakai nama yang sudah ada: `Newborn`, `Bayi 1-2 th`, `Bayi 3-5 th`, `Anak 6-8 th`, `Anak 8-12 th`, `Remaja 12-16 th`. Muncul sebagai tombol filter dan dihitung di kotak warna-warni |

> Kategori baru (nama lain) tetap muncul sebagai tombol filter, tapi supaya masuk ke kotak warna-warni di atas, minta developer menambahkannya di `tiles` pada `js/config.js`.

- **Tambah produk** → tambah baris baru.
- **Hapus produk** → hapus barisnya.
- **Urutan** di website = urutan baris. Produk andalan taruh paling atas.

### Ambil link produk Shopee
Buka produk di aplikasi Shopee → tombol **Bagikan** → **Salin Link** → tempel di kolom *Link Shopee*.

### Menambahkan foto (bisa banyak)
1. Upload foto ke **Google Drive**.
2. Klik kanan foto → **Bagikan** → ubah akses jadi **"Siapa saja yang memiliki link"** → **Salin link**.
3. Tempel di kolom *Foto*.

Untuk foto kedua dan seterusnya, pilih salah satu cara:
- **Baris di bawahnya** — biarkan Nama, Harga, Link kosong, isi kolom Foto saja. Otomatis jadi foto tambahan produk di atasnya.
- **Kotak yang sama** — tekan **Alt + Enter** (Mac: **Option + Enter**) untuk pindah baris, lalu tempel link berikutnya.

| Nama | Harga | Link Shopee | Foto |
|---|---|---|---|
| Kaos Lengan Pendek | 79000 | (link) | foto-depan |
| | | | foto-belakang |
| | | | foto-detail |

Foto pertama jadi foto utama. Di website, foto lainnya bisa digeser.

> Tips: pakai foto persegi (1:1) supaya rapi.

---

## Untuk developer

### Setup Google Sheets (sekali saja)
1. Buat Google Sheet baru → **File → Impor** → upload `template-katalog.csv`.
2. **Bagikan** → akses umum **"Siapa saja yang memiliki link" → Viewer**.
3. Tempel link share-nya ke `sheetUrl` di `js/config.js` (link biasa, dikonversi otomatis ke CSV lewat endpoint `gviz`). Link "Publikasikan ke web → CSV" juga diterima.
4. Untuk sheet dengan beberapa tab, pakai link yang mengandung `gid=` dari tab katalog.
5. Beri akses **Editor** ke pemilik toko lewat email (bukan lewat link umum).

> Jangan set link umum ke "Editor" — siapa pun yang tahu link bisa mengubah katalog.

Nama kolom tidak peka huruf besar/kecil, dan ada alias (`Produk`, `Gambar`, `Link`, dll.) — lihat `COLUMN_ALIASES` di `js/catalog.js`.
Kalau sheet gagal dimuat, website memakai `sampleProducts` dari config dan menulis peringatan di console.

### Struktur file
```
index.html          markup semua section
css/tokens.css      warna, font, radius (ubah tema di sini)
css/base.css        reset & utilitas
css/components.css  tombol, kartu produk, galeri, tab
css/sections.css    header, hero, tiles, banner, footer + responsive
js/config.js        teks, link, tiles, fitur, testimoni, sumber data
js/utils.js         escape HTML, format rupiah, parser CSV, konversi link Drive
js/catalog.js       ambil & render produk, filter, pencarian, galeri
js/sections.js      render section statis dari config
js/main.js          entry point
```

Tanpa build step dan tanpa framework — cukup upload semua file ke hosting statis (GitHub Pages, Netlify, Vercel, Cloudflare Pages).

### Menambah section baru
1. Tambah markup di `index.html`, gaya di `css/sections.css`.
2. Kalau isinya dari config: tambah data di `js/config.js` dan fungsi `renderXxx()` di `js/sections.js`, panggil dari `init()`.
3. Teks sederhana cukup pakai atribut `data-bind="path.di.config"` tanpa JS tambahan.
