/* Katalog: ambil produk sekali (Google Sheets / contoh), lalu bagi ke beberapa bagian
   katalog berdasarkan kolom "Tipe Produk" (mis. Baju, Sepatu). Bagian-bagiannya diatur
   di config.catalogs — menambah bagian baru (mis. Aksesoris) cukup lewat config. */
window.Jema = window.Jema || {};

Jema.catalog = (() => {
  const { escapeHtml, formatRupiah, safeUrl, splitImages, toSheetCsvUrl, parseCsv, debounce } = Jema.utils;

  /* Nama kolom di sheet → field internal. Huruf besar/kecil & spasi diabaikan. */
  const COLUMN_ALIASES = {
    name: ["nama", "nama produk", "produk", "name"],
    type: ["tipe produk", "tipe", "jenis", "jenis produk", "type"],
    price: ["harga", "price"],
    link: ["link shopee", "link", "shopee", "url"],
    photos: ["foto", "foto produk", "gambar", "photo", "photos", "image"],
    category: ["kategori", "category"],
  };

  const ALL = "Semua";
  /* "Baby 3-24 m" = "baby  3-24 M" — toleran salah ketik huruf besar/spasi dari sheet */
  const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
  const inCategories = (p, categories) => categories.some((c) => norm(c) === norm(p.category));

  let products = [];
  let query = "";
  let fallbackLink = "";
  const sections = new Map(); // id → { cfg, products, filter, el }

  /* ---------- Data ---------- */

  const normalize = (raw) => ({
    name: String(raw.name || "").trim(),
    type: String(raw.type || "").trim(),
    price: formatRupiah(raw.price),
    link: safeUrl(raw.link) || fallbackLink,
    photos: splitImages(raw.photos),
    category: String(raw.category || "").trim(),
  });

  const rowsToProducts = (rows) => {
    const [header, ...body] = rows;
    const keys = header.map((h) => norm(h));
    const index = {};
    for (const [field, aliases] of Object.entries(COLUMN_ALIASES)) {
      index[field] = keys.findIndex((k) => aliases.includes(k));
    }
    if (index.name < 0) throw new Error('Kolom "Nama" tidak ditemukan di sheet');

    const cell = (cells, field) => (index[field] >= 0 ? (cells[index[field]] || "").trim() : "");
    const list = [];
    for (const cells of body) {
      const name = cell(cells, "name");
      if (name) {
        const raw = {};
        for (const field in index) raw[field] = cell(cells, field);
        list.push(raw);
      } else if (list.length) {
        // Baris tanpa Nama = foto tambahan untuk produk di atasnya
        const extra = cell(cells, "photos");
        if (extra) list[list.length - 1].photos += "\n" + extra;
      }
    }
    return list;
  };

  const fromSample = (list) =>
    list.map((p) => ({ name: p.nama, type: p.tipe, price: p.harga, link: p.link, photos: p.foto, category: p.kategori }));

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

  /* Bagi produk ke bagian katalog. Bagian dengan catchAll menampung tipe yang tidak dikenal / kosong. */
  function distribute(catalogs) {
    const known = catalogs.flatMap((c) => (c.types || []).map(norm));
    for (const c of catalogs) {
      const types = (c.types || []).map(norm);
      sections.get(c.id).products = products.filter((p) =>
        types.includes(norm(p.type)) || (c.catchAll && !known.includes(norm(p.type))));
    }
  }

  /* ---------- Render ---------- */

  const placeholder = (p) => {
    const art = norm(p.type) === "sepatu" ? Jema.art?.shoePlaceholder : Jema.art?.tee;
    return art ? art() : "👕";
  };

  const galleryHtml = (p) => {
    const slides = p.photos.length
      ? p.photos.map((src, i) => `
          <a class="gallery__slide" href="${escapeHtml(p.link)}" target="_blank" rel="noopener" tabindex="${i ? -1 : 0}">
            <img src="${escapeHtml(src)}" alt="${escapeHtml(p.name)} — foto ${i + 1}" loading="lazy" referrerpolicy="no-referrer">
          </a>`).join("")
      : `<a class="gallery__slide" href="${escapeHtml(p.link)}" target="_blank" rel="noopener"><div class="placeholder" aria-hidden="true">${placeholder(p)}</div></a>`;

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

  const sectionHtml = (c) => `
    <section class="section catalog ${c.tone ? `catalog--${escapeHtml(c.tone)}` : ""}" id="${escapeHtml(c.id)}">
      <div class="container">
        <div class="card-panel">
          <header class="section-title">
            ${c.script ? `<p class="script">${escapeHtml(c.script)}</p>` : ""}
            <h2>${escapeHtml(c.title)}</h2>
            ${c.subtitle ? `<p>${escapeHtml(c.subtitle)}</p>` : ""}
          </header>
          <div class="tabs" role="tablist" hidden></div>
          <div class="product-grid" aria-live="polite">${skeletonHtml(4)}</div>
          <p class="empty-state" hidden>Produk tidak ditemukan. Coba kata kunci lain, ya.</p>
          <div class="center">
            <a class="btn btn--shopee" href="${escapeHtml(fallbackLink)}" target="_blank" rel="noopener">${escapeHtml(c.cta || "Lihat Semua Produk di Shopee →")}</a>
          </div>
        </div>
      </div>
    </section>`;

  const visible = (s) => {
    const q = query.toLowerCase();
    return s.products.filter((p) =>
      (!s.filter.categories || inCategories(p, s.filter.categories)) &&
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)));
  };

  function renderGrid(s) {
    const list = visible(s);
    s.el.grid.innerHTML = list.map(cardHtml).join("");
    s.el.empty.hidden = list.length > 0;
    // Bagian tanpa produk sama sekali (mis. belum ada sepatu) disembunyikan
    s.el.root.hidden = s.products.length === 0;
    return list.length;
  }

  function renderTabs(s) {
    const categories = [...new Set(s.products.map((p) => p.category).filter(Boolean))];
    s.el.tabs.hidden = categories.length < 2; // tab hanya muncul kalau ada ≥2 kategori
    const { label } = s.filter;
    // Filter gabungan dari kotak promo (mis. "Newborn & Bayi") tampil sebagai tab sementara
    const tabs = [ALL, ...(categories.includes(label) || label === ALL ? [] : [label]), ...categories];
    s.el.tabs.innerHTML = tabs
      .map((c) => `<button class="tab" role="tab" aria-selected="${c === label}">${escapeHtml(c)}</button>`)
      .join("");
  }

  /* ---------- API untuk modul lain (kotak promo) ---------- */

  /** Jumlah produk pada satu bagian katalog (opsional: hanya kategori tertentu) */
  const countIn = (id, categories) => {
    const s = sections.get(id);
    if (!s) return 0;
    return categories?.length ? s.products.filter((p) => inCategories(p, categories)).length : s.products.length;
  };

  /** Tampilkan produk dari beberapa kategori sekaligus pada satu bagian, lalu scroll ke sana */
  function filterBy(id, categories, label) {
    const s = sections.get(id);
    if (!s) return;
    s.filter = categories?.length === 1
      ? { label: categories[0], categories }
      : { label: label || ALL, categories: categories?.length ? categories : null };
    renderTabs(s);
    renderGrid(s);
    s.el.root.scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Interaksi ---------- */

  function bind(root, search) {
    // Galeri: tombol prev/next (desktop)
    root.addEventListener("click", (e) => {
      const btn = e.target.closest(".gallery__nav");
      if (!btn) return;
      const track = btn.closest(".gallery").querySelector(".gallery__track");
      track.scrollBy({ left: track.clientWidth * Number(btn.dataset.step), behavior: "smooth" });
    });
    // Galeri: titik indikator saat digeser (scroll tidak bubble → pakai capture)
    root.addEventListener("scroll", (e) => {
      const track = e.target;
      if (!track.classList?.contains("gallery__track")) return;
      const i = Math.round(track.scrollLeft / track.clientWidth);
      track.parentElement.querySelectorAll(".gallery__dots span")
        .forEach((d, n) => d.classList.toggle("is-active", n === i));
    }, true);

    // Tab kategori per bagian
    root.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      const s = sections.get(tab.closest(".catalog").id);
      const label = tab.textContent;
      if (label === s.filter.label) return;
      s.filter = label === ALL ? { label: ALL, categories: null } : { label, categories: [label] };
      renderTabs(s); // tab gabungan sementara hilang begitu tab lain dipilih
      renderGrid(s);
    });

    // Pencarian global: menyaring semua bagian, lalu scroll ke bagian pertama yang ada hasilnya
    search?.addEventListener("input", debounce((e) => {
      query = e.target.value.trim();
      let first = null;
      for (const s of sections.values()) if (renderGrid(s) && !first) first = s;
      if (query) (first || sections.values().next().value)?.el.root.scrollIntoView({ behavior: "smooth" });
    }, 250));
  }

  /* ---------- Init ---------- */

  async function init(config) {
    fallbackLink = config.links.shopee;
    const catalogs = config.catalogs || [{ id: "katalog", title: "Koleksi Terbaru", catchAll: true }];
    const root = document.getElementById("catalogs");
    root.innerHTML = catalogs.map(sectionHtml).join("");

    for (const c of catalogs) {
      const el = document.getElementById(c.id);
      sections.set(c.id, {
        cfg: c, products: [], filter: { label: ALL, categories: null },
        el: { root: el, tabs: el.querySelector(".tabs"), grid: el.querySelector(".product-grid"), empty: el.querySelector(".empty-state") },
      });
    }
    bind(root, document.getElementById("search"));

    const raw = await loadProducts(config);
    products = raw.map(normalize).filter((p) => p.name);
    distribute(catalogs);
    for (const s of sections.values()) { renderTabs(s); renderGrid(s); }
  }

  return { init, filterBy, countIn };
})();
