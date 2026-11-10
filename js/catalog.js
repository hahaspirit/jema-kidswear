/* Katalog: ambil produk (Google Sheets / contoh), render kartu, tab kategori, pencarian, galeri */
window.Jema = window.Jema || {};

Jema.catalog = (() => {
  const { escapeHtml, formatRupiah, safeUrl, splitImages, toSheetCsvUrl, parseCsv, debounce } = Jema.utils;

  /* Nama kolom di sheet → field internal. Huruf besar/kecil & spasi diabaikan. */
  const COLUMN_ALIASES = {
    name: ["nama", "nama produk", "produk", "name"],
    price: ["harga", "price"],
    link: ["link shopee", "link", "shopee", "url"],
    photos: ["foto", "foto produk", "gambar", "photo", "photos", "image"],
    category: ["kategori", "category"],
  };

  const ALL = "Semua";
  /* filter.categories = null → semua produk; selain itu daftar kategori yang ditampilkan.
     filter.label = teks tab yang aktif (bisa label gabungan dari kotak promo). */
  const state = { products: [], filter: { label: ALL, categories: null }, query: "", fallbackLink: "" };

  /* "Bayi 1-2 th" = "bayi  1-2 TH" — toleran salah ketik huruf besar/spasi dari sheet */
  const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
  const inCategories = (p, categories) => categories.some((c) => norm(c) === norm(p.category));
  const el = {};

  /* ---------- Data ---------- */

  const normalize = (raw) => ({
    name: String(raw.name || "").trim(),
    price: formatRupiah(raw.price),
    link: safeUrl(raw.link) || state.fallbackLink,
    photos: splitImages(raw.photos),
    category: String(raw.category || "").trim(),
  });

  const rowsToProducts = (rows) => {
    const [header, ...body] = rows;
    const keys = header.map((h) => h.trim().toLowerCase());
    const index = {};
    for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
      index[field] = keys.findIndex((k) => aliases.includes(k));
    }
    if (index.name < 0) throw new Error('Kolom "Nama" tidak ditemukan di sheet');

    const cell = (cells, field) => (index[field] >= 0 ? (cells[index[field]] || "").trim() : "");
    const products = [];
    for (const cells of body) {
      const name = cell(cells, "name");
      if (name) {
        const raw = {};
        for (const field in index) raw[field] = cell(cells, field);
        products.push(raw);
      } else if (products.length) {
        // Baris tanpa Nama = foto tambahan untuk produk di atasnya
        const extra = cell(cells, "photos");
        if (extra) products[products.length - 1].photos += "\n" + extra;
      }
    }
    return products;
  };

  const fromSample = (list) =>
    list.map((p) => ({ name: p.nama, price: p.harga, link: p.link, photos: p.foto, category: p.kategori }));

  async function loadProducts(config) {
    const csvUrl = toSheetCsvUrl(config.sheetUrl);
    if (csvUrl) {
      try {
        // cache-buster supaya perubahan di sheet cepat terlihat
        const url = csvUrl + (csvUrl.includes("?") ? "&" : "?") + "t=" + Date.now();
        const res = await fetch(url);
        if (!res.ok) throw new Error("HTTP " + res.status);
        return rowsToProducts(parseCsv(await res.text()));
      } catch (err) {
        console.warn("[katalog] Gagal memuat Google Sheets, memakai data contoh.", err);
      }
    }
    return fromSample(config.sampleProducts || []);
  }

  /* ---------- Render ---------- */

  const galleryHtml = (p) => {
    const slides = p.photos.length
      ? p.photos.map((src, i) => `
          <a class="gallery__slide" href="${escapeHtml(p.link)}" target="_blank" rel="noopener" tabindex="${i ? -1 : 0}">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(p.name)} — foto ${i + 1}" loading="lazy" referrerpolicy="no-referrer">
          </a>`).join("")
      : `<a class="gallery__slide" href="${escapeHtml(p.link)}" target="_blank" rel="noopener"><div class="placeholder" aria-hidden="true">👕</div></a>`;

    const multi = p.photos.length > 1;
    return `
      <div class="gallery">
        <div class="gallery__track">${slides}</div>
        ${multi ? `
          <span class="gallery__count">${p.photos.length} foto</span>
          <button class="gallery__nav gallery__nav--prev" data-step="-1" aria-label="Foto sebelumnya">‹</button>
          <button class="gallery__nav gallery__nav--next" data-step="1" aria-label="Foto berikutnya">›</button>
          <div class="gallery__dots">${p.photos.map((_, i) => `<span class="${i ? "" : "is-active"}"></span>`).join("")}</div>` : ""}
      </div>`;
  };

  const cardHtml = (p) => `
    <article class="product">
      ${galleryHtml(p)}
      <div class="product__body">
        ${p.category ? `<span class="product__cat">${escapeHtml(p.category)}</span>` : ""}
        <h3 class="product__name">${escapeHtml(p.name)}</h3>
        ${p.price ? `<p class="product__price">${p.price}</p>` : ""}
        <a class="btn btn--shopee btn--sm btn--block" href="${escapeHtml(p.link)}" target="_blank" rel="noopener">Beli di Shopee</a>
      </div>
    </article>`;

  const skeletonHtml = (n) =>
    Array.from({ length: n }, () => `
      <div class="product product--skeleton" aria-hidden="true">
        <div class="gallery"></div>
        <div class="product__body"><div class="sk"></div><div class="sk" style="width:40%"></div></div>
      </div>`).join("");

  const visibleProducts = () => {
    const q = state.query.toLowerCase();
    return state.products.filter((p) =>
      (!state.filter.categories || inCategories(p, state.filter.categories)) &&
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
  };

  function renderGrid() {
    const list = visibleProducts();
    el.grid.innerHTML = list.map(cardHtml).join("");
    el.empty.hidden = list.length > 0;
  }

  const allCategories = () => [...new Set(state.products.map((p) => p.category).filter(Boolean))];

  function renderTabs() {
    const categories = allCategories();
    el.tabs.hidden = categories.length < 2; // tab hanya muncul kalau kolom Kategori dipakai
    const { label } = state.filter;
    // Filter gabungan dari kotak promo (mis. "Newborn & Bayi") tampil sebagai tab sementara
    const tabs = [ALL, ...(categories.includes(label) || label === ALL ? [] : [label]), ...categories];
    el.tabs.innerHTML = tabs
      .map((c) => `<button class="tab" role="tab" aria-selected="${c === label}">${escapeHtml(c)}</button>`)
      .join("");
  }

  /** Jumlah produk dalam daftar kategori (dipakai kotak promo) */
  const countIn = (categories) => state.products.filter((p) => inCategories(p, categories)).length;

  /** Tampilkan produk dari beberapa kategori sekaligus, lalu scroll ke katalog */
  function filterBy(categories, label) {
    state.filter = categories?.length === 1
      ? { label: categories[0], categories }
      : { label: label || ALL, categories: categories?.length ? categories : null };
    renderTabs();
    renderGrid();
    document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Interaksi ---------- */

  function bindGallery() {
    // Tombol prev/next (desktop)
    el.grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__nav");
      if (!btn) return;
      const track = btn.closest(".gallery").querySelector(".gallery__track");
      track.scrollBy({ left: track.clientWidth * Number(btn.dataset.step), behavior: "smooth" });
    });
    // Update titik indikator saat digeser (scroll tidak bubble → pakai capture)
    el.grid.addEventListener("scroll", (e) => {
      const track = e.target;
      if (!track.classList?.contains("gallery__track")) return;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      track.parentElement.querySelectorAll(".gallery__dots span")
        .forEach((d, n) => d.classList.toggle("is-active", n === i));
    }, true);
  }

  function bindFilters() {
    el.tabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      const label = tab.textContent;
      if (label === state.filter.label) return;
      state.filter = label === ALL
        ? { label: ALL, categories: null }
        : { label, categories: [label] };
      renderTabs(); // tab gabungan sementara hilang begitu tab lain dipilih
      renderGrid();
    });

    el.search?.addEventListener("input", debounce((e) => {
      state.query = e.target.value.trim();
      renderGrid();
      if (state.query) document.getElementById("katalog").scrollIntoView({ behavior: "smooth" });
    }, 250));
  }

  /* ---------- Init ---------- */

  async function init(config) {
    el.grid = document.getElementById("product-grid");
    el.tabs = document.getElementById("tabs");
    el.empty = document.getElementById("empty-state");
    el.search = document.getElementById("search");
    state.fallbackLink = config.links.shopee;

    el.grid.innerHTML = skeletonHtml(8);
    bindGallery();
    bindFilters();

    const raw = await loadProducts(config);
    state.products = raw.map(normalize).filter((p) => p.name);
    renderTabs();
    renderGrid();
  }

  return { init, filterBy, countIn };
})();
