/* =====================================================================
   KONFIGURASI TOKO
   Semua teks, link, dan sumber data ada di sini.
   Produk TIDAK diedit di file ini — produk diambil dari Google Sheets
   (lihat PANDUAN.md). sampleProducts hanya dipakai kalau sheet belum diisi.
   ===================================================================== */
window.STORE_CONFIG = {
  storeName: "Jema Kidswear",
  pageTitle: "Jema Kidswear — Factory Outlet Baju & Sepatu Anak Branded",
  tagline: "Little Outfit for a Brighter Tomorrow",
  about: "Jema Kidswear adalah factory outlet baju dan sepatu anak branded di Sukabumi. Kami menghadirkan koleksi brand favorit keluarga untuk si kecil sejak newborn hingga usia 16 tahun — dengan kualitas yang Bunda percaya dan harga khas outlet.",

  /* Warna logo (lihat juga css/tokens.css) */
  logoColors: { main: "#E09A2D", sub: "#6B4A35", onDark: "#FFFFFF" },

  links: {
    shopee: "https://shopee.co.id/jemakidswear",
    whatsapp: "6285775066136",                       // format 62…, tanpa + / 0 di depan
    whatsappMessage: "Halo Jema Kidswear, saya mau tanya produk 🙏",
    instagram: "https://www.instagram.com/jemakidswear/",
    tiktok: "https://www.tiktok.com/@jema.kidswear",
    maps: "https://maps.app.goo.gl/MM2GPk5J3fRpBFAh8",
  },

  /* Daftar sosial media (bagian "Selalu update!" dan footer).
     key menentukan ikon & warna: instagram | tiktok | shopee | whatsapp | maps */
  socials: [
    { key: "instagram", label: "Instagram",   handle: "@jemakidswear" },
    { key: "whatsapp",  label: "WhatsApp",    handle: "0857-7506-6136" },
    { key: "shopee",    label: "Shopee",      handle: "Jemakidswear" },
    { key: "tiktok",    label: "TikTok",      handle: "@jema.kidswear" },
    { key: "maps",      label: "Google Maps", handle: "Jema Kidswear Factory Outlet" },
  ],

  location: {
    script: "Mampir ke outlet kami",
    name: "Jema Kidswear Factory Outlet",
    address: "Kanahaya City 4 Blok A35, Limusnunggal, Kota Sukabumi",
    note: "Mau lihat dan pegang langsung bahannya? Datang ke outlet kami. Supaya tidak menunggu, chat WhatsApp dulu untuk cek stok dan ukuran.",
    /* Teks pencarian untuk peta yang ditampilkan di halaman */
    mapQuery: "Jema Kidswear Factory Outlet, Kanahaya City 4, Limusnunggal, Sukabumi",
  },

  /* Link Google Sheets katalog. Cukup tempel link share biasa
     (akses: "Siapa saja yang memiliki link" → Viewer).
     Kosongkan ("") untuk memakai sampleProducts. */
  sheetUrl: "https://docs.google.com/spreadsheets/d/1n9Id9NKC9wP_Z4wZQBu6dy_pjpb6lmBjPGf6q4y1XqY/edit?usp=sharing",

  /* Bagian katalog. Produk dibagi berdasarkan kolom "Tipe Produk" di sheet.
     types: nilai Tipe Produk yang masuk ke bagian ini.
     catchAll: true → juga menampung produk yang Tipe Produk-nya kosong/tidak dikenal.
     Bagian tanpa produk otomatis disembunyikan. Tambah bagian baru (mis. Aksesoris) cukup di sini. */
  catalogs: [
    { id: "katalog", types: ["Baju"], catchAll: true,
      script: "Newborn sampai 16 tahun", title: "Koleksi Baju",
      subtitle: "Klik produk untuk langsung checkout di Shopee",
      cta: "Lihat Semua Baju di Shopee →" },
    { id: "sepatu", types: ["Sepatu"], tone: "soft",
      script: "Langkah kecil, gaya besar", title: "Koleksi Sepatu",
      subtitle: "Sepatu branded untuk si kecil. Kategori menunjukkan rentang ukuran.",
      cta: "Lihat Semua Sepatu di Shopee →" },
  ],

  images: {
    hero: "",     // contoh: "images/hero.png" (PNG transparan paling bagus)
    banner: "",
  },

  hero: {
    eyebrow: "Factory Outlet Sukabumi",
    title: "Baju &amp; sepatu anak <mark>branded</mark>, harga <mark>outlet</mark>",
    lead: "<strong>Cool Kids, Carter's, OshKosh B'gosh, Carhartt, H&amp;M, LC Waikiki</strong> dan brand favorit lainnya ada di sini, untuk si kecil dari newborn sampai 16 tahun. Kualitas brand yang Bunda percaya, dengan harga khas outlet.",
  },

  /* Deretan brand di bawah kotak kategori. Kosongkan [] untuk menyembunyikan. */
  brandsLabel: "Brand pilihan di outlet kami",
  brands: ["Cool Kids", "Carter's", "OshKosh B'gosh", "Carhartt", "H&M", "LC Waikiki", "Lee Cooper", "Rodeo Jr", "Pitodito"],

  /* Kotak kategori di bawah hero.
     size: "tall" (2 baris) atau "small". color: sky | sage | blush | honey | cocoa
     art: ilustrasi bawaan — baby | boy | girl | teen | shoe | priceTag (js/illustrations.js)
     image: path foto/PNG sendiri (mengalahkan art)
     catalog: id bagian katalog yang dituju (default "katalog")
     categories: nilai kolom Kategori di sheet. Kosong → tampilkan seluruh bagian katalog itu.
     Tanpa catalog & categories → klik kotak membuka `link` (default: toko Shopee). */
  tiles: [
    { size: "tall",  color: "sky",   script: "Langkah pertama",    title: "Newborn & Baby", pill: "Newborn – 24 bulan", art: "baby",
      categories: ["Newborn", "Baby 3-24 m"] },
    { size: "small", color: "sage",  script: "Main seharian",      title: "Kids",           pill: "2 – 8 tahun",        art: "boy",
      categories: ["Kids 2-8 y"] },
    { size: "tall",  color: "blush", script: "Makin percaya diri", title: "Junior",         pill: "8 – 16 tahun",       art: "teen",
      categories: ["Junior 8-16 y"] },
    { size: "small", color: "honey", script: "Langkah kecil",      title: "Sepatu Anak",    pill: "Ukuran 22 – 36",     art: "shoe",
      catalog: "sepatu" },
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
    text: "Ikuti Jema Kidswear untuk info restock, koleksi baru, dan promo spesial.",
  },

  /* Isi dengan ulasan ASLI pembeli. Kalau kosong, bagian testimoni disembunyikan.
     Contoh: { name: "Bunda Rina", text: "Bahannya adem…", photo: "" } */
  testimonials: [],

  features: [
    { art: "tag", title: "Brand terpercaya", text: "Koleksi brand favorit keluarga" },
    { art: "coins", title: "Harga outlet", text: "Lebih hemat dari harga butik" },
    { art: "growth", title: "Newborn – 16 tahun", text: "Baju & sepatu untuk setiap usia" },
    { art: "ruler", title: "Bantu pilih ukuran", text: "Konsultasi size via WhatsApp" },
  ],

  /* Data contoh untuk tampilan awal (dipakai kalau sheetUrl kosong / gagal dimuat).
     Formatnya sama dengan kolom di Google Sheets. */
  sampleProducts: [
    { nama: "Kaos Lengan Pendek", tipe: "Baju",   kategori: "Newborn",       harga: "79000",  link: "", foto: "" },
    { nama: "Jumpsuit",           tipe: "Baju",   kategori: "Baby 3-24 m",   harga: "79000",  link: "", foto: "" },
    { nama: "Dress Pendek",       tipe: "Baju",   kategori: "Kids 2-8 y",    harga: "79000",  link: "", foto: "" },
    { nama: "Kemeja",             tipe: "Baju",   kategori: "Junior 8-16 y", harga: "79000",  link: "", foto: "" },
    { nama: "Sepatu Casual",      tipe: "Sepatu", kategori: "Kids 22-28",    harga: "108000", link: "", foto: "" },
    { nama: "Sepatu Sneakers",    tipe: "Sepatu", kategori: "Junior 29-36",  harga: "108000", link: "", foto: "" },
  ],
};
