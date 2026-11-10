/* =====================================================================
   KONFIGURASI TOKO
   Semua teks, link, dan sumber data ada di sini.
   Produk TIDAK diedit di file ini — produk diambil dari Google Sheets
   (lihat PANDUAN.md). sampleProducts hanya dipakai kalau sheet belum diisi.
   ===================================================================== */
window.STORE_CONFIG = {
  storeName: "Jema Kidswear",
  pageTitle: "Jema Kidswear — Factory Outlet Baju Anak Branded",
  logo: "images/logo.jpg",   // kosongkan ("") untuk menyembunyikan logo
  about: "Jema Kidswear adalah factory outlet baju anak di Sukabumi. Kami menghadirkan koleksi brand favorit keluarga untuk si kecil sejak newborn hingga usia 16 tahun — dengan kualitas yang Bunda percaya dan harga khas outlet.",

  links: {
    shopee: "https://shopee.co.id/jemakidswear",
    whatsapp: "6281234567890",                       // format 62…, tanpa + / 0 di depan
    whatsappMessage: "Halo Jema Kidswear, saya mau tanya produk 🙏",
    instagram: "https://www.instagram.com/jemakidswear/",
  },

  /* Link Google Sheets katalog. Cukup tempel link share biasa
     (akses: "Siapa saja yang memiliki link" → Viewer).
     Kosongkan ("") untuk memakai sampleProducts. */
  sheetUrl: "https://docs.google.com/spreadsheets/d/1n9Id9NKC9wP_Z4wZQBu6dy_pjpb6lmBjPGf6q4y1XqY/edit?usp=sharing",

  images: {
    hero: "",     // contoh: "images/hero.png" (PNG transparan paling bagus)
    banner: "",
  },

  hero: {
    eyebrow: "Factory Outlet Sukabumi",
    title: "Baju anak <mark>branded</mark>, harga <mark>outlet</mark>",
    lead: "<strong>Cool Kid, Lee Cooper, Pitodito, OshKosh, Carter's</strong>, hingga <strong>H&amp;M</strong> — semua ada di sini untuk si kecil, dari newborn sampai 16 tahun. Kualitas brand yang Bunda percaya, dengan harga khas outlet.",
  },

  /* Deretan brand di bawah kotak promo. Kosongkan [] untuk menyembunyikan. */
  brandsLabel: "Brand pilihan di outlet kami",
  brands: ["Cool Kid", "Lee Cooper", "Pitodito", "OshKosh", "Carter's", "H&M"],

  /* Kotak promo di bawah hero.
     size: "tall" (2 baris) atau "small". color: blue | pink | yellow | teal | purple
     art: ilustrasi bawaan — baby | boy | girl | teen | priceTag (lihat js/illustrations.js)
     image: path foto/PNG sendiri (mengalahkan art)
     categories: daftar nilai kolom Kategori di sheet (harus sama persis).
       Kalau diisi → klik kotak menyaring katalog + tampil jumlah produk.
       Kalau tidak ada → klik kotak membuka `link` (default: toko Shopee). */
  tiles: [
    { size: "tall",  color: "blue",   script: "Langkah pertama",    title: "Newborn & Bayi", pill: "Newborn – 2 tahun", art: "baby",
      categories: ["Newborn", "Bayi 1-2 th"] },
    { size: "small", color: "purple", script: "Main seharian",      title: "Balita & Anak",  pill: "3 – 8 tahun",       art: "boy",
      categories: ["Bayi 3-5 th", "Anak 6-8 th"] },
    { size: "tall",  color: "pink",   script: "Makin percaya diri", title: "Kids & Teen",    pill: "8 – 16 tahun",      art: "teen",
      categories: ["Anak 8-12 th", "Remaja 12-16 th"] },
    { size: "small", color: "yellow", script: "Belanja hemat",      title: "Harga Outlet",   pill: "Branded tanpa harga butik", art: "priceTag" },
  ],

  banner: {
    script: "Stok baru tiap minggu",
    title: "Cepat habis, jangan sampai kelewatan",
    text: "Barang outlet datang dalam jumlah terbatas di setiap ukuran. Cek koleksi terbaru dan voucher toko di Shopee sebelum ukuran favorit si kecil habis.",
    cta: "Cek Stok di Shopee →",
    link: "",     // kosong = ke toko Shopee
  },

  follow: {
    script: "Selalu update!",
    text: "Ikuti Jema Kidswear di Shopee & Instagram untuk info restock, koleksi baru, dan promo spesial.",
  },

  /* Isi dengan ulasan ASLI pembeli. Kalau kosong, bagian testimoni disembunyikan.
     Contoh: { name: "Bunda Rina", text: "Bahannya adem…", photo: "" } */
  testimonials: [],

  features: [
    { art: "tag", title: "Brand terpercaya", text: "Koleksi brand favorit keluarga" },
    { art: "coins", title: "Harga outlet", text: "Lebih hemat dari harga butik" },
    { art: "growth", title: "Newborn – 16 tahun", text: "Lengkap untuk setiap tahap usia" },
    { art: "ruler", title: "Bantu pilih ukuran", text: "Konsultasi size via WhatsApp" },
  ],

  /* Data contoh untuk tampilan awal (dipakai kalau sheetUrl kosong / gagal dimuat).
     Formatnya sama dengan kolom di Google Sheets. */
  sampleProducts: [
    { nama: "Setelan Kaos Anak Motif", harga: "69000",  kategori: "Setelan", link: "", foto: "" },
    { nama: "Piyama Anak Katun",       harga: "75000",  kategori: "Piyama",  link: "", foto: "" },
    { nama: "Dress Anak Perempuan",    harga: "85000",  kategori: "Dress",   link: "", foto: "" },
    { nama: "Kaos Anak Basic",         harga: "39000",  kategori: "Atasan",  link: "", foto: "" },
    { nama: "Celana Jogger Anak",      harga: "55000",  kategori: "Bawahan", link: "", foto: "" },
    { nama: "Jumper Bayi",             harga: "59000",  kategori: "Bayi",    link: "", foto: "" },
    { nama: "Kemeja Anak Laki-laki",   harga: "79000",  kategori: "Atasan",  link: "", foto: "" },
    { nama: "Setelan Lebaran Anak",    harga: "129000", kategori: "Setelan", link: "", foto: "" },
  ],
};
