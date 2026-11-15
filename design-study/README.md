# Local homepage design study

The selected composition has now been integrated into the working website. These files preserve the October design exploration and draft copy; current text lives in `../content/`, and the working preview is at <http://127.0.0.1:4186/>. The checklist below predates the November CV update.

**Chosen design: 1. First page.** Open `final-first.html` for the selected homepage, or `final-comparison.html` to revisit the alternatives. Its correspondence area contains the portrait and email without a separate city/state line. Content remains provisional for the next writing pass.

The three final proposals combine the preferred D preprint, A Alongside layout, and C portrait. The earlier five alternatives remain saved separately. This folder is independent of the production build and GitHub Pages deployment. None of these drafts replaces the published site or its editable Markdown.

## Final proposals

Open **final-comparison.html** to switch among these three candidates:

- **1. First page:** closest to D, with a centered abstract, two-column body, Figure 1, and an unframed portrait beside the correspondence footnote.
- **2. Alongside:** an immediate introduction and portrait opposite the contour, with a run-in abstract and numbered sections below.
- **3. Personal manuscript:** a centered identity and abstract, a reading column with the figure, and a portrait and correspondence in the margin. The author margin moves below the text on phones.

All three use Crimson Text, neutral Paper, burgundy contours and section numbers, and blue-green links. The site header puts the CV on the left and real Research, Writings, Teaching & talks, and Things I make page links on the right. Those page links open the existing published site in a new tab to preserve the comparison. They do not preview a redesign of the interior pages. The comparison controls live outside the proposed website.

Edit `finals.css` for appearance and `build-finals.mjs` for the final layouts and provisional copy. Run `node design-study/build-finals.mjs` from the site repository to regenerate `final-first.html`, `final-alongside.html`, `final-personal.html`, and the portable `final-comparison.html`. This build uses only Node built-ins and does not change A–E. The final comparison embeds fonts and the portrait; it needs the network only for existing public detail pages and the CV. Individual proposal files use the adjacent `assets` folder.

Preview at <http://127.0.0.1:4187/final-comparison.html> while the local server is running. Add `#final-alongside.html` or `#final-personal.html` to share a particular starting choice locally. The existing [content checklist](CONTENT-PLAN.md) is ready for the next writing pass; draft biographical text is not final copy.

## Earlier exploration

Open **comparison.html** in a browser; this single portable file includes all five layouts, a Writings draft, the content checklist, fonts, portrait, and interactive landscape. Switching views needs no additional server requests. The CV and detailed-page links lead to the existing public site. The Codex in-app browser supports HTTP previews, rather than direct file URLs; use the optional local preview below when reopening it there.

The separate `index.html`, `ribbon.html`, and `column.html` versions are also available. For these individual files, keep this folder's `assets` directory beside them; their CV link uses the local copy of the existing PDF.

- **A. Alongside:** shorter name and an immediate overview beside a prominent burgundy contour. Blue-green links provide a second restrained color. No portrait.
- **B. Landscape ribbon:** the identity and introduction share a row, followed by a broad map and a narrower reading column. Burgundy is the only interface accent.
- **C. Personal column:** a smaller name, a text-first column, the contour in the margin, and the existing portrait beside contact details.
- **D. First page:** a compact centered identity and abstract, then two columns, numbered sections, an interactive Figure 1, and a correspondence footnote.
- **E. Working manuscript:** an abstract with a contents list in the margin, a wide Figure 1 with a model note beside it, and a single reading column. Margin notes move into the text flow on phones.
- **Writings:** proposed introduction and section names; empty sections are explicitly a local layout demonstration, not fake posts.
- **Content to fill:** practical prompts for current projects, teaching, the upcoming talk, Writings, software, the CV, and cleanup.

The pale green comparison bar belongs only to this study. Main navigation links scroll to the relevant homepage section; detailed research, teaching, and software links open the corresponding existing public pages. The CV download is the existing May 2026 PDF, not an updated version.

## Editing and preview

Edit `style.css` for A–C appearance, `preprint.css` and `preprint.mjs` for D–E, `build.mjs` for shared draft layouts and copy, and `CONTENT-PLAN.md` for the checklist. From the website repository, run `node design-study/build.mjs` to regenerate the seven HTML pages and portable comparison. The build uses the existing `marked` dependency and requires the website dependencies to be installed.

For a browser preview served over HTTP, run `./design-study/preview.ps1` in PowerShell, then visit <http://127.0.0.1:4187/comparison.html>. Stop it with Ctrl+C. The launcher uses the bundled Node runtime when available. The loaded comparison continues switching views after stopping the server; reloading the browser tab requires restarting it. The production preview continues to use port 4186.

## Source and boundaries

The SVG contours and noisy-ascent interaction were extracted from the user's supplied HTML after inspection. The map is a toy landscape, not a research result. The framing was adapted to these layouts, with keyboard input and reduced-motion handling retained. Crimson Text is locally hosted with its license in `assets/FONT-LICENSE.txt`. The portrait and CV are copies of the existing approved site assets.

Draft homepage copy condenses the current public content. It does not assert a formal advisor appointment, group membership, new publication, or completed talk. The eventual selected design should keep the production Markdown editing workflow rather than adopting this mock-up's template text.

See [CONTENT-PLAN.md](CONTENT-PLAN.md) for content prompts and the repository's [CODE_HISTORY.md](../CODE_HISTORY.md) for rationale.

## Preserved A–C set

Before adding D and E, the original three-layout comparison was frozen in [saved/abc-2026-10-17.html](saved/abc-2026-10-17.html). It includes its own display assets. A matching editable source archive is [saved/abc-source-2026-10-17.zip](saved/abc-source-2026-10-17.zip). The build does not write into `saved/`; do not overwrite these snapshots while exploring later alternatives.
