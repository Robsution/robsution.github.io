// Two additional compositions. Existing A/B/C templates and styles stay intact.
export function preprintHeader(id) {
  const label = id === 'journal' ? 'Personal preprint' : 'Author’s manuscript';
  return `<header class="preprint-running"><span>${label}</span><nav aria-label="Site navigation"><a href="index.html">Other layouts</a><a href="writings.html">Writings</a><a href="assets/cv-2026-05.pdf" download="Rafael-Coca-Salazar-CV.pdf" aria-label="Download CV (PDF)">CV <small>PDF</small></a></nav></header>`;
}

const abstractText = `I’m interested in how mathematical models describe complex systems, especially in theoretical biophysics and condensed matter. My current work ranges from bacterial auxotrophy and spin glasses to machine learning in nuclear and particle physics.`;
const identity = `<div class="preprint-identity"><h1 aria-label="Rafael A. Coca Salazar">Rafael A. <span class="surname">Coca Salazar</span><sup><a href="#correspondence" aria-label="Correspondence details">*</a></sup></h1><p class="preprint-affiliation">Department of Physics, Washington University in St. Louis</p><p class="preprint-role">Physics PhD student &amp; Arthur L. Hughes Fellow</p></div>`;
const contents = `<nav class="paper-contents" aria-label="On this page"><span>Contents</span><a href="#research">1. Research</a><a href="#teaching">2. Teaching &amp; talks</a><a href="#making">3. Things I make</a></nav>`;
const correspondence = `<footer class="correspondence" id="correspondence"><p><span class="correspondence-star">*</span> Correspondence: <span id="email">rafael.coca.sal@gmail.com</span> <button class="copy" type="button" data-copy="rafael.coca.sal@gmail.com" aria-live="polite">Copy</button></p><span>St. Louis, Missouri</span></footer>`;
const numbered = (html, n) => html.replace('<h2>', `<h2><span class="section-number">${n}.</span> `);

export function preprintPage(id, { figure, research, teaching, making }) {
  const journalFigure = figure.replace('A noisy walk uphill on a toy landscape.', '<strong>Figure 1.</strong> A noisy walk uphill on a toy landscape.');
  if (id === 'journal') return `<main id="main" class="journal-paper">
    ${identity}
    <section class="paper-abstract" aria-labelledby="abstract-heading"><h2 id="abstract-heading">Abstract</h2><p>${abstractText}</p></section>
    ${contents}
    <div class="paper-grid">
      ${numbered(research,1)}
      ${journalFigure}
      ${numbered(teaching,2)}
      ${numbered(making,3)}
    </div>
    ${correspondence}
  </main>`;
  const manuscriptFigure = journalFigure.replace('</figcaption>', ' <sup><a href="#figure-note" aria-label="Note on the landscape">1</a></sup></figcaption>');
  return `<main id="main" class="manuscript-paper">
    ${identity}
    <div class="manuscript-grid">
      <section class="paper-abstract" aria-labelledby="abstract-heading"><h2 id="abstract-heading">Abstract.</h2><p>${abstractText}</p></section>
      <aside class="manuscript-contents">${contents}<p class="revision">Revised 17 October 2026</p></aside>
      ${manuscriptFigure}
      <aside class="figure-note" id="figure-note"><span class="note-mark">1</span><p>The landscape is a toy model: a sum of Gaussian bumps. A walker follows the local slope with some noise.</p><p>A higher peak may be out of reach from a given starting point.</p></aside>
      <div class="manuscript-body">${numbered(research,1)}${numbered(teaching,2)}${numbered(making,3)}</div>
    </div>
    ${correspondence}
  </main>`;
}
