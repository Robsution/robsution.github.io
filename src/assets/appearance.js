// Apply preferences before paint. The site remains readable without storage or JS.
(() => {
  const allowed = {theme:['paper','gray','night'],font:['source','garamond','baskerville','crimson','newsreader','spectral','alegreya','crimsontext'],accent:['blue','burgundy','graphite'],layout:['margin','compact'],motif:['contours','lattice','none'],motifColor:['accent','blue','burgundy','graphite']};
  try {
    const stored = JSON.parse(localStorage.getItem('rafael-site-design-v2') || '{}');
    const query = new URLSearchParams(location.search);
    for (const [key,values] of Object.entries(allowed)) {
      const value = query.get(key) || stored[key];
      if (values.includes(value)) document.documentElement.dataset[key] = value;
    }
  } catch { /* Storage may be disabled; use the baked-in defaults. */ }
})();
