# Design and implementation history

## 2026-10-10 — First local design explorer

- Kept the user's preferred preprint vocabulary: serif typography, an abstract, numbered navigation and sections, a restrained two-tone name, and a small scientific motif.
- Added Vellum and Sage to bridge the reference's bright white and empty-feeling dark background. Dusk and warm Ink provide two darker alternatives.
- Added margin, classic-paper, and compact compositions to compare portrait placement without committing to a final direction. Contour lines are an abstract illustration, not a research result or a depiction of Tikhonov's work. The optional lattice retains the earlier reference.
- Used “Writing” as a provisional neutral title, with Essays and Marginalia alternatives. The sole sample article is explicitly a layout specimen.
- Used a small static Node build with Marked and KaTeX rather than an application framework. This preserves simple editable Markdown, local assets, usable pages without client-side routing, and GitHub Pages project-path compatibility. Runtime JavaScript is only for preview preferences and portrait selection.
- Kept the project in a new `personal-site` subdirectory because the selected workspace contains the unrelated Paper Night extension and has no Git repository. No commits, repository creation, registration with Sites, or external deployment were part of this design exploration.
- Grounded the content in the user’s current details, the supplied May 2026 CV, the referenced Career Advice chat, and the local Niceties README. Did not promote future research plans to formal group membership or expose the private career doubts discussed in that chat.
- Preserved the original CV as a dated download. The HTML summary includes the newer WashU role and qualifies the old “present” date instead of inventing an end date.

Compatibility: Node 22 or newer for building. The Windows preview launcher can use the bundled Node runtime because the system Node on this computer is version 16. The output consists of HTML, CSS, JavaScript, fonts, and the supplied PDF.


## 2026-10-10 — Direct academic layout and type exploration

- Replaced the large centered title block with a compact left-aligned introduction. The initial browser check at 817 × 668 placed the bio at roughly 230 pixels and current work at 405 pixels from the top.
- Kept “R. A. Coca Salazar” in the masthead and removed “Physics · WashU.” Made the masthead sticky and the CV a direct, dated PDF download available on every page. Removed the separate CV page from the build.
- Replaced the rejected Vellum/Sage/Dusk/Ink palettes with cool Paper, Gray, and Night surfaces. Subtle canvas/page/header separation and independent blue, burgundy, or graphite accents add variation while preserving the paper aesthetic.
- Added locally hosted Source Serif 4, Libre Baskerville, and Crimson Pro alongside EB Garamond, with live specimens and page-wide switching. Versioned the browser preference key so old palettes and prose-section names cannot override the new design.
- Fixed the prose section name as “Writings.” Posts default to its upper informal section; `section: academic` places them below. Added validation and an ordering regression test. The sample remains clearly labeled demonstration material.
- Combined Teaching and Talks, made both Princeton role dates explicit, and added a planned October 2026 talk placeholder without inventing a title, date, venue, or abstract.
- Replaced the ambiguous “Projects” label with provisional “Things I make” and renamed its output route to `making.html`. No separate talks, projects, or CV HTML pages are generated. These were unpublished local routes, so no public URLs need migration.


## 2026-10-10 — Fuller letterforms and independent contour color

- The user confirmed that EB Garamond's tall, narrow letter shapes were the concern, while its capital/lowercase contrast appealed to them. Added Newsreader, Spectral, Alegreya, and Crimson Text for comparison at their original proportions.
- Moved typography to the top of the customizer and gave every font the same “Rafael Aa Rr Gg” specimen. Kept EB Garamond and Crimson Pro in the primary comparison, with the two other previous choices under a disclosure.
- Preserved the agreed Paper, blue link accent, contours, and right-hand portrait direction. Added a separate motif-color preference so the contours can use burgundy without changing links. Newsreader and burgundy contours are starting candidates, not a final font decision.
- Extended the existing preference storage without discarding current selections. Added regression coverage for the new family names, independent motif color, URL overrides, and invalid preferences.
- Kept all font files and licenses local. Adjusted fieldset/grid minimum widths and mobile specimen size after a phone inspection found intrinsic-width overflow.

## 2026-10-11 — Chosen appearance

- Saved the user's final choice of Crimson Text as the default typeface, including the reset and CSS fallbacks. Retained Paper, blue links, burgundy contours, and the portrait at right. The customizer remains available for later adjustments.

## 2026-10-11 — GitHub Pages setup

- Added a GitHub Actions workflow that builds with Node 24, runs the existing checks, and deploys only the generated `dist/` directory after a successful build. Publishing runs on pushes to `main` or a manual run on that branch.
- Documented initial repository setup, the GitHub Pages source setting, and future updates. The website source belongs at the root of its own repository, separate from Niceties. This prepares deployment locally; it does not create a repository, push source, or publish the site.
