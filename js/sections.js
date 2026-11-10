/* Render bagian statis dari config: teks, logo, link, sosial media, lokasi, kotak kategori,
   banner, keunggulan, testimoni */
window.Jema = window.Jema || {};

Jema.sections = (() => {
  const { escapeHtml, get, safeUrl } = Jema.utils;

  function bindText(config) {
    document.querySelectorAll("[data-bind]").forEach((node) => {
      const value = get(config, node.dataset.bind);
      if (value != null) node.textContent = value;
    });
    // Hanya untuk teks dari config (bukan dari sheet), boleh berisi <mark>/<strong>
    document.querySelectorAll("[data-bind-html]").forEach((node) => {
      const value = get(config, node.dataset.bindHtml);
      if (value != null) node.innerHTML = value;
    });
    if (config.pageTitle) document.title = config.pageTitle;
  }

  function renderLogo(config) {
    const c = config.logoColors || {};
    document.querySelectorAll("[data-logo]").forEach((slot) => {
      slot.innerHTML = Jema.logo.full({ color: c.main, sub: c.sub, title: config.storeName });
    });
  }

  /* Semua URL eksternal dihitung di satu tempat */
  function linkMap(config) {
    const { links } = config;
    return {
      shopee: links.shopee,
      whatsapp: `https://wa.me/${links.whatsapp}?text=${encodeURIComponent(links.whatsappMessage || "")}`,
      instagram: links.instagram,
      tiktok: links.tiktok,
      maps: links.maps,
      banner: safeUrl(config.banner?.link) || links.shopee,
    };
  }

  function bindLinks(urls) {
    document.querySelectorAll("[data-link]").forEach((a) => {
      const href = urls[a.dataset.link];
      if (href) a.href = href; else a.closest("li")?.remove();
    });
  }

  function renderBrands(config) {
    const brands = config.brands || [];
    if (!brands.length) return;
    document.getElementById("brands-list").innerHTML = brands.map((b) => `<li>${escapeHtml(b)}</li>`).join("");
    document.getElementById("brand").hidden = false;
  }

  /* Sosial media: kapsul berwarna di bagian "Selalu update!" + daftar kontak di footer */
  function renderSocials(config, urls) {
    const items = (config.socials || []).filter((s) => urls[s.key]);
    const icon = (key) => Jema.art?.social?.[key] || "";
    document.getElementById("socials").innerHTML = items.map((s) => `
      <li><a class="social social--${escapeHtml(s.key)}" href="${escapeHtml(urls[s.key])}" target="_blank" rel="noopener">
        <span class="social__icon" aria-hidden="true">${icon(s.key)}</span>
        <span class="social__text"><small>${escapeHtml(s.label)}</small><b>${escapeHtml(s.handle)}</b></span>
      </a></li>`).join("");

    const address = config.location?.address;
    document.getElementById("footer-contacts").innerHTML = items.map((s) => `
      <li><a href="${escapeHtml(urls[s.key])}" target="_blank" rel="noopener">
        <span class="footer-contacts__icon social--${escapeHtml(s.key)}" aria-hidden="true">${icon(s.key)}</span>${escapeHtml(s.handle)}
      </a></li>`).join("") +
      (address ? `<li class="footer-contacts__address"><span class="footer-contacts__icon" aria-hidden="true">${icon("home")}</span>${escapeHtml(address)}</li>` : "");
  }

  /* Peta Google tanpa API key (mode embed) */
  function renderMap(config) {
    const q = config.location?.mapQuery || config.location?.address;
    const box = document.getElementById("map");
    if (!q) { document.getElementById("lokasi").hidden = true; return; }
    box.innerHTML = `<iframe title="Peta lokasi ${escapeHtml(config.location.name || "")}" loading="lazy"
      referrerpolicy="no-referrer-when-downgrade" allowfullscreen
      src="https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed"></iframe>`;
  }

  /* Foto dari config kalau ada; kalau tidak, ilustrasi bawaan (Jema.art[fallbackArt]) */
  function fillImageSlot(name, src, alt, fallbackArt) {
    const slot = document.querySelector(`[data-slot="${name}"]`);
    if (!slot) return;
    if (src) slot.innerHTML = `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
    else if (Jema.art?.[fallbackArt]) slot.innerHTML = Jema.art[fallbackArt]();
  }

  const artOrEmoji = (art, emoji, cls) =>
    Jema.art?.[art] ? Jema.art[art]() : `<span class="${cls}">${escapeHtml(emoji || "")}</span>`;

  /* Kotak kategori: menyaring satu bagian katalog, atau membuka link kalau tidak terhubung ke katalog */
  const tileTarget = (t) => (t.catalog || (t.categories?.length ? "katalog" : null));

  function renderTiles(config) {
    const root = document.getElementById("tiles");
    const tiles = config.tiles || [];
    root.innerHTML = tiles.map((t, i) => {
      const target = tileTarget(t);
      const attrs = target
        ? `href="#${escapeHtml(target)}" data-tile="${i}"`
        : `href="${escapeHtml(safeUrl(t.link) || config.links.shopee)}" target="_blank" rel="noopener"`;
      return `
      <a class="tile tile--${escapeHtml(t.color || "honey")} ${t.size === "tall" ? "tile--tall" : ""}" ${attrs}>
        ${t.script ? `<span class="tile__script">${escapeHtml(t.script)}</span>` : ""}
        <h3 class="tile__title">${escapeHtml(t.title)}</h3>
        ${t.pill ? `<span class="tile__pill">${escapeHtml(t.pill)}</span>` : ""}
        <span class="tile__cta">${target ? "Lihat produk" : "Belanja"}</span>
        <span class="tile__media" aria-hidden="true">
          ${t.image ? `<img src="${escapeHtml(t.image)}" alt="">` : artOrEmoji(t.art, t.emoji, "tile__emoji")}
        </span>
      </a>`;
    }).join("");

    root.addEventListener("click", (e) => {
      const tile = e.target.closest("[data-tile]");
      if (!tile) return;
      e.preventDefault();
      const t = tiles[tile.dataset.tile];
      Jema.catalog.filterBy(tileTarget(t), t.categories, t.title);
    });
  }

  /** Dipanggil setelah katalog termuat: tampilkan jumlah produk per kotak */
  function updateTileCounts(config) {
    document.querySelectorAll("[data-tile]").forEach((tile) => {
      const t = config.tiles[tile.dataset.tile];
      const n = Jema.catalog.countIn(tileTarget(t), t.categories);
      tile.querySelector(".tile__cta").textContent = n ? `Lihat ${n} produk` : "Segera hadir";
    });
  }

  function renderFeatures(config) {
    document.getElementById("features").innerHTML = (config.features || []).map((f) => `
      <div class="feature">
        <div class="feature__icon" aria-hidden="true">${Jema.art?.icons?.[f.art] || escapeHtml(f.icon || "")}</div>
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
    const urls = linkMap(config);
    bindText(config);
    renderLogo(config);
    bindLinks(urls);
    renderBrands(config);
    renderSocials(config, urls);
    renderMap(config);
    fillImageSlot("heroImage", config.images?.hero, config.storeName, "hero");
    fillImageSlot("bannerImage", config.images?.banner, "", "gift");
    renderTiles(config);
    renderFeatures(config);
    renderTestimonials(config);
    bindNav();
    document.getElementById("year").textContent = new Date().getFullYear();
  }

  return { init, updateTileCounts };
})();
