/* Logo Jema: leher jerapah = huruf "j", disambung "ema" (font Fredoka 600) + "KIDSWEAR".
   Angka di bawah diukur dari metrik Fredoka (lihat logo-konsep.html, pilihan no. 2). */
window.Jema = window.Jema || {};

Jema.logo = (() => {
  const BASELINE = 74, STEM_X = 50;
  const FONT = { family: "Fredoka", weight: 600, size: 62.75, emaX: 58.9, inkLeft: 59.9, emaW: 117.1 };
  const SW = 11; // tebal garis leher ≈ tebal huruf Fredoka
  let uid = 0;

  const heart = (cx, cy, s, fill) =>
    `<path fill="${fill}" d="M${cx} ${cy + s * .9} C${cx - s * 1.25} ${cy + s * .05} ${cx - s * .95} ${cy - s} ${cx} ${cy - s * .35} C${cx + s * .95} ${cy - s} ${cx + s * 1.25} ${cy + s * .05} ${cx} ${cy + s * .9} Z"/>`;

  /** Jerapah saja (koordinat lokal); dipakai di logo lengkap dan ikon */
  function giraffe(fg, sw = SW) {
    const id = "jema-eye-" + (++uid);
    const knob = 2.6 + sw * .38;
    const L = STEM_X - sw / 2 - 1;
    return `
      <defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-50" y="-50" width="300" height="250">
        <rect x="-50" y="-50" width="300" height="250" fill="#fff"/>
        <circle cx="69" cy="22" r="3.4" fill="#000"/>
      </mask></defs>
      <g fill="none" stroke="${fg}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
        <path d="M${STEM_X} 30 V${BASELINE} a14 14 0 0 1 -28 0"/>
        <path d="M53 15 L49 5 M66 13 L67 3" stroke-width="${Math.min(sw, 6)}"/>
        <path d="M45 22 Q38 16 33 18" stroke-width="${Math.min(sw, 6.5)}"/>
      </g>
      <circle cx="48.5" cy="${(4 - knob * .3).toFixed(2)}" r="${knob.toFixed(2)}" fill="${fg}"/>
      <circle cx="67.5" cy="${(2 - knob * .3).toFixed(2)}" r="${knob.toFixed(2)}" fill="${fg}"/>
      <path mask="url(#${id})" fill="${fg}" d="M${L} 31 Q${L} 12 62 12 H75 Q88 12 88 24 Q88 35 76 35 H${STEM_X + 2} Q${L} 35 ${L} 31 Z"/>
      ${heart(STEM_X - 13 - sw * .25, 56, 5.5, fg)}`;
  }

  /**
   * Logo lengkap sebagai string SVG.
   * opts.color: warna jerapah + "ema"; opts.sub: warna "KIDSWEAR" (default sama); opts.title untuk aksesibilitas
   */
  function full({ color = "#E09A2D", sub = color, title = "Jema Kidswear" } = {}) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="18 -11 165 116" role="img" aria-label="${title}">
      ${giraffe(color)}
      <text x="${FONT.emaX}" y="${BASELINE}" font-family="'${FONT.family}', 'Baloo 2', sans-serif" font-weight="${FONT.weight}" font-size="${FONT.size}" fill="${color}">ema</text>
      <text x="${FONT.inkLeft}" y="${BASELINE + 24}" font-family="'${FONT.family}', 'Baloo 2', sans-serif" font-weight="${FONT.weight}" font-size="11"
            textLength="${FONT.emaW}" lengthAdjust="spacing" fill="${sub}">KIDSWEAR</text>
    </svg>`;
  }

  /** Ikon jerapah saja (avatar, favicon) */
  const icon = (color = "#E09A2D") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="8 -8 88 104" aria-hidden="true">${giraffe(color, 9)}</svg>`;

  return { full, icon };
})();
