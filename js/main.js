/* Entry point */
(async () => {
  const config = window.STORE_CONFIG;
  Jema.sections.init(config);
  await Jema.catalog.init(config);
  Jema.sections.updateTileCounts(config);

  // Bagian katalog dibuat lewat JS, jadi link langsung (mis. …/#sepatu) perlu di-scroll ulang
  const target = location.hash && document.getElementById(location.hash.slice(1));
  if (target && !target.hidden) target.scrollIntoView({ behavior: "instant" });
})();
