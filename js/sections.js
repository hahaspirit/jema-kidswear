/* Render bagian statis dari config: teks, link, tiles, banner, fitur, testimoni */
window.Jema = window.Jema || {};

Jema.sections = (() => {
  const { escapeHtml, get, safeUrl } = Jema.utils;

  function bindText(config) {
    document.querySelectorAll("[data-bind]").forEach((node) => {
      const value = get(config, node.dataset.bind);
      if (value != null) node.textContent = value;
    });
    // Hanya untuk teks dari config (bukan dari sheet), boleh berisi <mark>
    document.querySelectorAll("[data-bind-html]").forEach((node) => {
      const value = get(config, node.dataset.bindHtml);
      if (value != null) node.innerHTML = value;
    });
    if (config.pageTitle) document.title = config.pageTitle;
  }

  function bindLogo(config) {
    document.querySelectorAll("[data-logo]").forEach((img) => {
      if (config.logo) img.src = config.logo; else img.remove();
    });
  }

  function renderBrands(config) {
    const brands = config.brands || [];
    if (!brands.length) return;
    document.getElementById("brands-list").innerHTML = brands.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    document.getElementById("brand").hidden = false;
  }

  function bindLinks(config) {
    const { links } = config;
    const map = {
      shopee: links.shopee,
      whatsapp: `https://wa.me/${links.whatsapp}?text=${encodeURIComponent(links.whatsappMessage || "")}`,
      instagram: links.instagram,
      banner: safeUrl(config.banner?.link) || links.shopee,
    };
    document.querySelectorAll("[data-link]").forEach((a) => {
      const href = map[a.dataset.link];
      if (href) a.href = href; else a.closest("li")?.remove();
    });
  }

  function fillImageSlot(name, src, alt) {
    const slot = document.querySelector(`[data-slot="${name}"]`);
    if (!slot || !src) return;
    slot.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
  }

  /* Kotak dengan `categories` → menyaring katalog. Tanpa `categories` → buka link (default Shopee). */
  function renderTiles(config) {
    const root = document.getElementById("tiles");
    const tiles = config.tiles || [];
    root.innerHTML = tiles.map((t, i) => {
      const filters = Array.isArray(t.categories) && t.categories.length;
      const attrs = filters
        ? `href="#katalog" data-tile="${i}"`
        : `href="${escapeHtml(safeUrl(t.link) || config.links.shopee)}" target="_blank" rel="noopener"`;
      return `
      <a class="tile tile--${escapeHtml(t.color || "purple")} ${t.size === "tall" ? "tile--tall" : ""}" ${attrs}>
        ${t.script ? `<span class="tile__script">${escapeHtml(t.script)}</span>` : ""}
        <h3 class="tile__title">${escapeHtml(t.title)}</h3>
        ${t.pill ? `<span class="tile__pill">${escapeHtml(t.pill)}</span>` : ""}
        <span class="tile__cta">${filters ? "Lihat produk" : "Belanja"}</span>
        <span class="tile__media" aria-hidden="true">
          ${t.image ? `<img src="${escapeHtml(t.image)}" alt="">` : `<span class="tile__emoji">${escapeHtml(t.emoji || "")}</span>`}
        </span>
      </a>`;
    }).join("");

    root.addEventListener("click", (e) => {
      const tile = e.target.closest("[data-tile]");
      if (!tile) return;
      e.preventDefault();
      const t = tiles[tile.dataset.tile];
      Jema.catalog.filterBy(t.categories, t.title);
    });
  }

  /** Dipanggil setelah katalog termuat: tampilkan jumlah produk per kotak */
  function updateTileCounts(config) {
    document.querySelectorAll("[data-tile]").forEach((tile) => {
      const n = Jema.catalog.countIn(config.tiles[tile.dataset.tile].categories);
      tile.querySelector(".tile__cta").textContent = n ? `Lihat ${n} produk` : "Segera hadir";
    });
  }

  function renderFeatures(config) {
    document.getElementById("features").innerHTML = (config.features || []).map((f) => `
      <div class="feature">
        <div class="feature__icon" aria-hidden="true">${escapeHtml(f.icon)}</div>
        <h3>${escapeHtml(f.title)}</h3>
        <p>${escapeHtml(f.text)}</p>
      </div>`).join("");
  }

  function renderTestimonials(config) {
    const items = config.testimonials || [];
    const section = document.getElementById("testimoni");
    if (!items.length) return;
    section.hidden = false;

    const figure = document.getElementById("testimonial");
    let index = 0;
    const show = () => {
      const t = items[index];
      figure.innerHTML = `
        ${t.photo ? `<img src="${escapeHtml(t.photo)}" alt="">` : ""}
        <blockquote>“${escapeHtml(t.text)}”</blockquote>
        <figcaption>${escapeHtml(t.name)}</figcaption>`;
    };
    section.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-dir]");
      if (!btn) return;
      index = (index + Number(btn.dataset.dir) + items.length) % items.length;
      show();
    });
    section.querySelectorAll(".round-btn").forEach((b) => (b.hidden = items.length < 2));
    show();
  }

  function bindNav() {
    const nav = document.querySelector(".main-nav");
    const toggle = nav.querySelector(".nav-toggle");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", false); }
    });
  }

  function init(config) {
    bindText(config);
    bindLogo(config);
    bindLinks(config);
    renderBrands(config);
    fillImageSlot("heroImage", config.images?.hero, config.storeName);
    fillImageSlot("bannerImage", config.images?.banner, "");
    renderTiles(config);
    renderFeatures(config);
    renderTestimonials(config);
    bindNav();
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  return { init, updateTileCounts };
})();
