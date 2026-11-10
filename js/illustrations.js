/* Ilustrasi flat orisinal (SVG inline) — pengganti emoji.
   Semua karakter dibangun dari satu generator `kid()` supaya gaya konsisten
   dan mudah menambah variasi baru (ganti rambut, baju, pose, warna). */
window.Jema = window.Jema || {};

Jema.art = (() => {
  const P = {
    skin: "#FBE1C8", cheek: "#F5A3A0", ink: "#3B2A2A", mouth: "#A0413F",
    shadow: "rgba(47, 72, 88, .2)", white: "#FFFDF8",
  };

  const wrap = (viewBox, inner, align = "xMidYMax") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="${align} meet" aria-hidden="true" focusable="false">${inner}</svg>`;

  /* ---------- Bagian tubuh (kotak lokal 200×260, kepala di (100,80)) ---------- */

  const face = () => `
    <path d="M80 84 q6 -7 12 0 M108 84 q6 -7 12 0" fill="none" stroke="${P.ink}" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="76" cy="98" r="7" fill="${P.cheek}" opacity=".85"/>
    <circle cx="124" cy="98" r="7" fill="${P.cheek}" opacity=".85"/>
    <path d="M88 100 Q100 120 112 100 Z" fill="${P.mouth}" stroke="${P.mouth}" stroke-width="2" stroke-linejoin="round"/>`;

  const FRINGE = "M54 80 Q56 34 100 34 Q144 34 146 80 Q128 62 104 66 Q80 60 54 80 Z";
  const hairBack = (style, c, accent) => ({
    bob: `<path fill="${c}" d="M52 80 Q52 30 100 30 Q148 30 148 80 V116 Q148 128 136 124 H64 Q52 128 52 116 Z"/>
          <circle cx="54" cy="116" r="10" fill="${c}"/><circle cx="146" cy="116" r="10" fill="${c}"/>`,
    ponytail: `<path fill="${c}" d="M136 50 Q176 6 188 28 Q170 30 178 54 Q158 48 146 68 Z"/>
               <circle cx="140" cy="46" r="7" fill="${accent}"/>`,
  }[style] || "");

  const hairFront = (style, c) => ({
    curly: [[62, 62, 16], [80, 44, 18], [104, 38, 18], [126, 46, 17], [142, 64, 15]]
      .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`).join(""),
    short: `<path fill="${c}" d="M54 76 Q54 32 100 32 Q146 32 146 76 Q138 56 118 56 Q98 64 78 56 Q60 58 54 76 Z"/>`,
    bob: `<path fill="${c}" d="${FRINGE}"/>`,
    ponytail: `<path fill="${c}" d="${FRINGE}"/>`,
  }[style] || "");

  const ARMS = {
    up: [["M70 134 Q50 118 38 100", 37, 98], ["M130 134 Q150 116 162 98", 163, 96]],
    wave: [["M70 136 Q56 156 52 176", 52, 178], ["M130 134 Q150 116 162 98", 163, 96]],
  };

  const LEGS = {
    pants: {
      jump: { d: ["M86 182 Q80 206 66 216", "M114 182 Q122 204 138 210"], shoes: [[62, 219, -30], [142, 212, 20]] },
      stand: { d: ["M88 182 V232", "M112 182 V232"], shoes: [[85, 236, 0], [115, 236, 0]] },
    },
    skin: {
      jump: { d: ["M88 196 Q84 218 72 228", "M112 196 Q120 216 134 220"], shoes: [[68, 231, -25], [138, 222, 15]] },
      stand: { d: ["M90 198 V234", "M110 198 V234"], shoes: [[87, 238, 0], [113, 238, 0]] },
    },
  };

  const TOPS = {
    tee: { d: "M66 132 Q100 118 134 132 L142 186 Q100 194 58 186 Z", buttons: [140, 152, 164] },
    dress: { d: "M70 130 Q100 118 130 130 L152 200 Q100 210 48 200 Z", buttons: [138, 150] },
  };

  /**
   * Anak flat. opsi:
   *  hair: curly | short | bob | ponytail, hairColor, accent
   *  top: tee | dress, topColor, pants (warna; kosong = kaki telanjang), shoe
   *  arms: up | wave, legs: jump | stand
   */
  function kid(o) {
    const top = TOPS[o.top || "tee"];
    const legSet = LEGS[o.pants ? "pants" : "skin"][o.legs || "jump"];
    const arms = ARMS[o.arms || "up"];
    const shoe = o.shoe || P.ink;
    return `
      ${legSet.d.map((d) => `<path d="${d}" fill="none" stroke="${o.pants || P.skin}" stroke-width="${o.pants ? 13 : 8}" stroke-linecap="round"/>`).join("")}
      ${legSet.shoes.map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="9" ry="5" fill="${shoe}" transform="rotate(${r} ${x} ${y})"/>`).join("")}
      ${arms.map(([d, hx, hy]) => `<path d="${d}" fill="none" stroke="${P.skin}" stroke-width="8" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="6.5" fill="${P.skin}"/>`).join("")}
      ${hairBack(o.hair, o.hairColor, o.accent || P.white)}
      <path d="${top.d}" fill="${o.topColor}"/>
      <circle cx="70" cy="134" r="9" fill="${o.topColor}"/><circle cx="130" cy="134" r="9" fill="${o.topColor}"/>
      ${top.buttons.map((y) => `<circle cx="100" cy="${y}" r="2.6" fill="rgba(0,0,0,.28)"/>`).join("")}
      <circle cx="100" cy="80" r="46" fill="${P.skin}"/>
      ${face()}
      ${hairFront(o.hair, o.hairColor)}`;
  }

  const shadow = (cx, cy, rx = 46) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="6" fill="${P.shadow}"/>`;

  const heart = (cx, cy, s, fill) =>
    `<path fill="${fill}" d="M${cx} ${cy + s * .9} C${cx - s * 1.25} ${cy + s * .05} ${cx - s * .95} ${cy - s} ${cx} ${cy - s * .35} C${cx + s * .95} ${cy - s} ${cx + s * 1.25} ${cy + s * .05} ${cx} ${cy + s * .9} Z"/>`;

  const balloon = (cx, cy, r, fill) => `
    <path d="M${cx} ${cy + r * 1.15} q-6 ${r * .8} 3 ${r * 1.6}" fill="none" stroke="${fill}" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.15}" fill="${fill}"/>
    <ellipse cx="${cx - r * .35}" cy="${cy - r * .4}" rx="${r * .22}" ry="${r * .32}" fill="#fff" opacity=".35"/>`;

  /* ---------- Karakter siap pakai ---------- */

  const CAST = {
    boy: { hair: "curly", hairColor: "#E8964A", top: "tee", topColor: "#F2A65A", pants: "#2F4858", shoe: "#E0645A", arms: "up", legs: "jump" },
    girl: { hair: "bob", hairColor: "#7A4A3A", top: "dress", topColor: "#F07C7C", shoe: "#B4473F", arms: "up", legs: "jump" },
    teen: { hair: "ponytail", hairColor: "#F28B82", accent: "#FFD166", top: "dress", topColor: "#5DBB9B", shoe: "#2F4858", arms: "wave", legs: "jump" },
    kidTile: { hair: "short", hairColor: "#4A3B5C", top: "tee", topColor: "#FFC531", pants: "#2F4858", shoe: "#F07C7C", arms: "up", legs: "jump" },
  };

  const single = (cast) => wrap("20 20 170 245", kid(CAST[cast]) + shadow(100, 252, 42));

  function baby() {
    const onesie = "#FFD166";
    return wrap("20 18 160 222", `
      ${shadow(100, 228, 56)}
      <ellipse cx="72" cy="214" rx="15" ry="9" fill="${P.skin}"/>
      <ellipse cx="128" cy="214" rx="15" ry="9" fill="${P.skin}"/>
      <path d="M64 152 Q46 140 40 124" fill="none" stroke="${P.skin}" stroke-width="9" stroke-linecap="round"/><circle cx="39" cy="121" r="7.5" fill="${P.skin}"/>
      <path d="M136 152 Q154 140 160 124" fill="none" stroke="${P.skin}" stroke-width="9" stroke-linecap="round"/><circle cx="161" cy="121" r="7.5" fill="${P.skin}"/>
      <path d="M60 146 Q100 126 140 146 Q154 200 124 212 H76 Q46 200 60 146 Z" fill="${onesie}"/>
      <circle cx="64" cy="150" r="10" fill="${onesie}"/><circle cx="136" cy="150" r="10" fill="${onesie}"/>
      <path d="M86 140 Q100 154 114 140" fill="#fff" opacity=".7"/>
      <circle cx="100" cy="172" r="2.8" fill="rgba(0,0,0,.25)"/><circle cx="100" cy="186" r="2.8" fill="rgba(0,0,0,.25)"/>
      <g transform="translate(0 8)">
        <circle cx="100" cy="80" r="46" fill="${P.skin}"/>
        ${face()}
        <path d="M98 36 q-8 -16 6 -18 q10 0 5 9" fill="none" stroke="#C98B5A" stroke-width="4.5" stroke-linecap="round"/>
      </g>`);
  }

  function hero() {
    return wrap("0 0 620 420", `
      ${balloon(200, 70, 20, "#5DBB9B")}
      ${balloon(440, 52, 17, "#7CC4F0")}
      ${balloon(560, 120, 14, "#F07C7C")}
      ${heart(318, 46, 13, "#F07C7C")}
      ${heart(70, 120, 9, "#FFC531")}
      ${heart(590, 210, 8, "#8DB89A")}
      ${shadow(112, 392, 48)}${shadow(312, 388, 48)}${shadow(512, 392, 48)}
      <g transform="translate(12 110)">${kid(CAST.boy)}</g>
      <g transform="translate(212 80)">${kid(CAST.girl)}</g>
      <g transform="translate(412 104)">${kid(CAST.teen)}</g>`);
  }

  function gift() {
    return wrap("0 0 260 240", `
      ${balloon(54, 62, 22, "#FFD166")}
      ${balloon(206, 48, 18, "#7CC4F0")}
      ${heart(150, 26, 10, "#fff")}
      ${shadow(130, 226, 84)}
      <rect x="62" y="118" width="136" height="104" rx="12" fill="#FFD166"/>
      <rect x="52" y="96" width="156" height="34" rx="10" fill="#FFC531"/>
      <rect x="118" y="96" width="24" height="126" fill="#F07C7C"/>
      <path d="M130 96 C104 58 74 74 92 92 C100 100 116 98 130 96 Z" fill="#F07C7C"/>
      <path d="M130 96 C156 58 186 74 168 92 C160 100 144 98 130 96 Z" fill="#E35D6A"/>
      <circle cx="130" cy="96" r="9" fill="#E35D6A"/>`);
  }

  function priceTag() {
    return wrap("0 0 200 200", `
      ${shadow(104, 186, 50)}
      <g transform="rotate(-14 100 100)">
        <path d="M66 46 H150 Q162 46 162 58 V148 Q162 160 150 160 H66 L30 103 Z" fill="#F07C7C"/>
        <circle cx="62" cy="103" r="9" fill="#FFC531"/>
        <text x="112" y="122" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="56" fill="#fff">%</text>
      </g>
      <path d="M48 92 C30 60 50 30 78 34" fill="none" stroke="#2F4858" stroke-width="3" stroke-linecap="round"/>`);
  }

  /* ---------- Ikon kecil untuk bagian keunggulan (64×64) ---------- */
  const icon = (inner) => wrap("0 0 64 64", inner, "xMidYMid");
  const icons = {
    tag: icon(`<g transform="rotate(-20 32 32)"><path d="M22 14 H48 Q52 14 52 18 V46 Q52 50 48 50 H22 L10 32 Z" fill="#F2A65A"/><circle cx="21" cy="32" r="4" fill="#fff"/><path d="M30 26 h14 M30 33 h10 M30 40 h12" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>`),
    coins: icon(`<ellipse cx="26" cy="46" rx="16" ry="6" fill="#E89B2E"/><rect x="10" y="34" width="32" height="12" fill="#E89B2E"/><ellipse cx="26" cy="34" rx="16" ry="6" fill="#FFC531"/>
      <ellipse cx="40" cy="36" rx="14" ry="5.5" fill="#E89B2E"/><rect x="26" y="20" width="28" height="16" fill="#E89B2E"/><ellipse cx="40" cy="20" rx="14" ry="5.5" fill="#FFD166"/>${heart(40, 20, 3.4, "#F07C7C")}`),
    growth: icon(`<circle cx="14" cy="38" r="5" fill="#F5A3A0"/><rect x="9" y="44" width="10" height="12" rx="4" fill="#F07C7C"/>
      <circle cx="32" cy="27" r="6" fill="#F5A3A0"/><rect x="26" y="34" width="12" height="22" rx="5" fill="#5DBB9B"/>
      <circle cx="51" cy="14" r="6.5" fill="#F5A3A0"/><rect x="44.5" y="22" width="13" height="34" rx="5.5" fill="#8DB89A"/>
      <path d="M6 58 H60" stroke="#2F4858" stroke-width="3" stroke-linecap="round"/>`),
    ruler: icon(`<circle cx="22" cy="30" r="15" fill="#7CC4F0"/><circle cx="22" cy="30" r="5" fill="#fff"/>
      <path d="M30 41 H58 V51 H24 Q30 48 30 41 Z" fill="#FFC531"/>
      <path d="M36 41 v5 M42 41 v3 M48 41 v5 M54 41 v3" stroke="#2F4858" stroke-width="2" stroke-linecap="round"/>`),
  };

  /* Sepatu sneakers flat (kotak kategori & placeholder produk sepatu) */
  const shoe = (align = "xMidYMax") => wrap("6 30 190 122", `
    ${shadow(102, 142, 74)}
    <path d="M28 118 Q24 84 44 70 L70 52 Q80 46 88 54 L120 86 Q150 92 170 100 Q184 106 182 118 Z" fill="#F07C7C"/>
    <path d="M40 72 Q52 56 72 50 Q66 64 54 74 Z" fill="#B4473F"/>
    <path d="M150 95 Q178 100 182 118 H146 Q145 104 150 95 Z" fill="${P.white}" opacity=".92"/>
    <path d="M58 106 Q90 88 124 104" fill="none" stroke="#FFD166" stroke-width="7" stroke-linecap="round"/>
    <path d="M82 62 L97 56 M92 72 L107 66 M102 82 L117 76" stroke="${P.white}" stroke-width="4" stroke-linecap="round"/>
    <path d="M22 118 H178 Q186 118 186 126 Q186 136 174 136 H30 Q16 136 16 126 Q16 118 22 118 Z" fill="${P.white}"/>
    <path d="M24 127 H178" stroke="#E8D9C4" stroke-width="2.5" stroke-dasharray="7 6"/>`, align);

  /* Ikon sosial media (24×24, warna mengikuti currentColor) */
  const s24 = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${inner}</svg>`;
  const social = {
    instagram: s24(`<g fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="18" height="18" rx="5.5"/><circle cx="12" cy="12" r="4.2"/></g><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/>`),
    tiktok: s24(`<path fill="currentColor" d="M14.2 2.5h3.1a4.6 4.6 0 0 0 4.2 4.2v3.2a7.6 7.6 0 0 1-4.2-1.4v6.6a6.3 6.3 0 1 1-6.3-6.3h.6v3.3a3 3 0 1 0 2.6 3V2.5z"/>`),
    whatsapp: s24(`<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-3.9-4.7-4.1-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/>`),
    shopee: s24(`<path fill="currentColor" d="M5.5 7.5h13l-.9 12.2a1.5 1.5 0 0 1-1.5 1.3H7.9a1.5 1.5 0 0 1-1.5-1.3z"/><path d="M8.8 7.5a3.2 3.2 0 0 1 6.4 0" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14.3 11.3c-.6-.6-1.5-.9-2.4-.8-1.1.1-1.8.8-1.7 1.6.2 1.7 4.2 1 4.2 3.1 0 .9-.9 1.6-2.1 1.6-1 0-1.9-.4-2.5-1" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>`),
    maps: s24(`<path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7z"/><circle cx="12" cy="9" r="2.7" fill="#fff"/>`),
    home: s24(`<path fill="currentColor" d="M3.5 11 12 3.8l8.5 7.2v9a1 1 0 0 1-1 1H15v-6H9v6H4.5a1 1 0 0 1-1-1z"/>`),
  };

  /* Placeholder kartu produk tanpa foto */
  const tee = () => wrap("0 0 100 100", `
    <path d="M30 24 L42 16 Q50 24 58 16 L70 24 L82 40 L70 46 V84 Q70 86 68 86 H32 Q30 86 30 84 V46 L18 40 Z" fill="#F3D3A8"/>
    <path d="M42 16 Q50 26 58 16" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    ${heart(50, 54, 6, "#fff")}`, "xMidYMid");

  return {
    kid, hero, baby, gift, priceTag, tee, icons, social,
    shoe: () => shoe(), shoePlaceholder: () => shoe("xMidYMid"),
    boy: () => single("kidTile"),
    teen: () => single("teen"),
    girl: () => single("girl"),
  };
})();
