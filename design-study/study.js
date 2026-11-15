// Keep homepage navigation within the chosen composition.
for (const anchor of document.querySelectorAll('.site-header a[href^="index.html#"]')) {
  if (document.querySelector('.hero')) anchor.setAttribute('href', anchor.getAttribute('href').replace('index.html', ''));
}
