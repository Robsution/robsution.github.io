# Prototype review

Reviewed 2026-10-10 in the Codex in-app browser.

- Built all eight pages and checked generated links and local font/CSS/PDF assets.
- Parsed inline, display, and aligned equations; checked literal dollar signs in code and build failures for invalid metadata/LaTeX.
- Verified all four theme controls change the rendered palette.
- Verified the classic preprint composition, the compact composition, the lattice selection, and hiding the flourish.
- Changed Writing to Marginalia and Essays, then navigated to the prose index. A label-selector bug initially replaced the document; it was fixed and retested, including navigation with remembered settings.
- Added a one-pixel test PNG through the file picker, confirmed decoding, reloaded to confirm the tab-local preview survived, and removed it. No test portrait remains in the delivered preview.
- Verified the copy-combination success message and reset control.
- Checked all seven main pages at 390 × 844: no page-level horizontal overflow. Inspected the full equation specimen at phone width; both display equations fit.
- Inspected the Vellum homepage and Dusk specimen visually. Saved homepage and phone screenshots under `artifacts/`.
- No browser errors or warnings were reported in the inspected session.
- Reset the temporary viewport and restored Vellum, margin portrait, contours, and Writing for handoff.

The portrait currently shown is a placeholder. The bio is a draft, the article a marked specimen, and the talks page awaits content. External hosting and real-device testing have not been performed.


## Second design iteration — 2026-10-10

- All eight automated tests pass after the route consolidation, Writings grouping, local font additions, and palette replacement. Every text/accent color meets 4.5:1 contrast on the paper, inset, and panel surfaces.
- At the normal 817 × 668 viewport, the bio starts at about 230 px and Currently at 405 px. The selected Source Serif 4 font was confirmed loaded.
- Switched all four font controls and checked the applied font family. Confirmed a changed font, palette, and accent persist when navigating to Teaching & talks.
- Checked all five main pages at 390 × 844 using Libre Baskerville and Night. No horizontal overflow; the CV link remained in the viewport. No console warnings or errors were reported.
- Scrolled the homepage and verified the CV link remains 12 px from the top. Downloaded the PDF successfully through the browser control.
- Confirmed the merged page visibly includes the two separate Princeton roles with their exact month ranges, and the planned October 2026 talk placeholder.
- Restored Paper, Blue, Source Serif 4, portrait at right, and contours; reset the responsive viewport. Saved `artifacts/home-v2.png` and `artifacts/home-v2-mobile.png`.
- Earlier review entries describe the first iteration; its palettes, separate CV/talks pages, and editable prose name have been superseded.


## Typography exploration — 2026-10-10

- Verified Newsreader, Spectral, Alegreya, and Crimson Text switch the actual page font with no document overflow at a 900 px viewport. Confirmed Newsreader loaded rather than falling back.
- Verified Match links gives the motif the link color, then switched the motif to burgundy while links remained blue. Navigated between Research and Home and confirmed the font and independent color persisted.
- Inspected the font picker at 390 × 844. Fixed initial intrinsic-width overflow; the final panel's scroll width equals its client width, and all six primary specimen lines fit their cards.
- The standard static build and all nine tests pass, including new preference-initialization coverage.

## Public appearance — 2026-10-11

- The static build and all ten checks pass, including public pages without designer controls or scripts that restore stored preview settings.
- Reloaded the homepage and confirmed Crimson Text is applied, both designer and photo-picker controls are absent, and the portrait loads from `assets/portrait.jpg`.
- Saved the selected browser preview photo as a permanent site asset. The sample writing remains unchanged.
- Screenshot: `artifacts/home-without-designer.png`.
