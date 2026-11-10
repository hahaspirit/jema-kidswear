/* Helper umum — tanpa dependensi */
window.Jema = window.Jema || {};

Jema.utils = (() => {
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

  /** "69.000" / "Rp69000" / 69000 → "Rp69.000"; kosong → "" */
  const formatRupiah = (value) => {
    const n = Number(String(value ?? "").replace(/[^\d]/g, ""));
    return n ? "Rp" + n.toLocaleString("id-ID") : "";
  };

  /** Ambil nilai bertingkat: get(cfg, "hero.title") */
  const get = (obj, path) => path.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

  /** Hanya izinkan link http(s) supaya data dari sheet tidak bisa menyisipkan javascript: */
  const safeUrl = (url) => (/^https?:\/\//i.test(String(url || "").trim()) ? String(url).trim() : "");

  /**
   * Ubah link share Google Drive menjadi link gambar yang bisa ditampilkan.
   * Mendukung: /file/d/ID/view, open?id=ID, uc?id=ID. Link lain dikembalikan apa adanya.
   */
  const toImageUrl = (url) => {
    const clean = safeUrl(url);
    if (!clean) return "";
    const m = clean.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?(?:export=\w+&)?id=)([\w-]+)/);
    return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w800` : clean;
  };

  /**
   * Pecah isi sel foto jadi daftar URL gambar. Pemisah: baris baru / spasi,
   * atau koma yang diikuti link baru (koma di dalam URL tetap aman).
   */
  const splitImages = (cell) =>
    String(cell || "")
      .split(/\s+|,(?=\s*https?:)/i)
      .map(toImageUrl)
      .filter(Boolean);

  /**
   * Terima link Google Sheets apa pun (link edit/share biasa, atau link "Publikasikan ke web")
   * dan kembalikan link CSV yang bisa di-fetch dari browser.
   * Link share biasa → endpoint gviz (butuh akses "Siapa saja yang memiliki link: Viewer").
   */
  const toSheetCsvUrl = (url) => {
    const clean = safeUrl(url);
    if (!clean) return "";
    if (/\/spreadsheets\/d\/e\//.test(clean) || /output=csv/.test(clean)) return clean; // sudah link publish
    const id = clean.match(/\/spreadsheets\/d\/([\w-]+)/)?.[1];
    if (!id) return clean;
    const gid = clean.match(/[#&?]gid=(\d+)/)?.[1];
    return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv${gid ? `&gid=${gid}` : ""}`;
  };

  /**
   * Parser CSV kecil yang mendukung tanda kutip, koma, dan baris baru di dalam sel
   * (penting karena satu sel foto bisa berisi beberapa baris).
   */
  const parseCsv = (text) => {
    const rows = [];
    let row = [], field = "", inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuotes) {
        if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
        else if (c === '"') inQuotes = false;
        else field += c;
      } else if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); rows.push(row); row = []; field = "";
      } else field += c;
    }
    if (field !== "" || row.length) { row.push(field); rows.push(row); }
    return rows.filter((r) => r.some((v) => v.trim() !== ""));
  };

  const debounce = (fn, ms = 200) => {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  };

  return { escapeHtml, formatRupiah, get, safeUrl, toImageUrl, splitImages, toSheetCsvUrl, parseCsv, debounce };
})();
