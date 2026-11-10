/* Entry point */
(async () => {
  const config = window.STORE_CONFIG;
  Jema.sections.init(config);
  await Jema.catalog.init(config);
  Jema.sections.updateTileCounts(config);
})();
