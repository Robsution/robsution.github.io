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

## 2026-10-11 — Remove the public design explorer

- Disabled the customizer and omitted its appearance and photo-preview scripts from generated pages, so stored browser preferences cannot override the chosen design. Removed the photo-picker prompt as well.
- Saved the user's selected preview portrait as `public/portrait.jpg` and connected it to the site configuration, preserving the photo after removing the browser-only preview tools.
- Preserved the sample writing at the user's request. Added a regression check for public pages without design controls and for a configured portrait still rendering.
- The user connected the repository and confirmed successful GitHub Pages publication after running the workflow. The earlier README page was resolved through that deployment; no further hosting change was needed.

## 2026-10-11 — Independently editable page content

- Moved the homepage bio into `content/home.md`, containing only the two paragraphs. Moved activity summaries, research, teaching/talks, software descriptions, and Writings introductions into separate Markdown files so routine edits no longer require navigating HTML template strings.
- Retained the static GitHub Pages workflow and existing appearance. Used the installed Markdown renderer rather than introducing a CMS, account, or new dependency. Standard section headings and a documented `### label | title` convention preserve the timeline layout; token-based parsing keeps headings inside code examples intact.
- Connected identity, affiliation, masthead, footer, and CV date to `content/site.json`. Added a direct-link editing guide covering GitHub commits, local edits, math, new writings, and replacing the CV or portrait.
- Derived homepage recent posts and sample indicators from writing metadata. Editing or deleting the sample no longer requires modifying tests or removing a hardcoded reference from another page. Reserved main-page filenames prevent a new writing from overwriting navigation destinations.
- Replaced checks that pinned biographical copy with fixture-based rendering and an isolated full-build test that changes content, adds a post, then deletes it. External links in author text are allowed; local asset/link checks remain in place.

## 2026-10-11 — Research reading hierarchy

- Pulled Rafael's new Markdown edits before changing the design. His longer research introduction was inheriting the 21 px lead-paragraph style throughout, making the text oversized.
- Gave Research a scoped reading layout with 17 px overview text (16 px on phones), 16 px project descriptions, and a narrower maximum content width. Renamed “Current direction” to “Research interests”; preserved the newly authored paragraphs.
- Added burgundy section headings, a small title rule, a faint burgundy tint and margin rule around the overview, and blue date labels. Kept the existing Paper and Crimson Text design and the other pages' typography.

## 2026-10-17 — Independent homepage mock-ups

- Used the supplied landing-page HTML as a visual reference and source for the inspected contour geometry and noisy-ascent interaction. Preserved its welcoming whitespace and prominent landscape while moving the personal overview into the first screen.
- Built three local compositions: overview beside the map, compact introduction above a landscape ribbon, and a narrow reading column with a lower portrait. All try “Rafael A. Coca Salazar,” keep Crimson Text, and use a neutral near-white background. A and C add blue-green links beside burgundy; B provides a single-accent comparison.
- Treated the supplied criticism as design input rather than instructions. Did not adopt its blanket judgment about travel photographs or its arbitrary “Before WashU” grouping. Draft copy follows research topics and teaching roles; it removes repeated collaborator references from the introductory paragraphs without inventing new results or affiliations.
- Added a Writings layout and three introduction candidates, plus concrete prompts for research, teaching, talks, software, CV updates, and existing content inconsistencies. The study labels draft-only explanations and empty writing sections explicitly.
- Kept everything in `design-study/` with local assets and a separate optional preview on port 4187. Public templates, styles, Markdown, and deployment configuration are unchanged. This is a comparison artifact awaiting a design choice, not a migration or deployment.
- Added a portable `comparison.html` that embeds all five views and their display assets. Once loaded, switching compositions does not need the preview server; existing public detail-page and CV links still use the network.

## 2026-10-17 — Restore the preprint character as two more alternatives

- Preserved A–C before extending the study: a byte-identical portable comparison and an editable source archive are saved under `design-study/saved/`. The existing homepage layouts remain available in the expanded comparison.
- Added D, a journal first page with a centered author identity, abstract, two columns, numbered sections, Figure 1, and a working correspondence footnote. Added E, a manuscript with a reading column, contents and explanatory notes in the margin, and a wide interactive figure.
- Kept the preprint references functional: contents numbers correspond to actual sections on that page, footnotes link to their text, and the figure is identified as a toy model. No publication identifier, journal affiliation, peer-review status, or research result is invented. The biography remains near the top.
- Scoped the new composition styles separately so the original three designs retain their styling. The new variants are local proposals only; the production website and deployment remain unchanged. The preview server is left running at the user's request.

## 2026-10-18 — Three final preprint proposals

- Combined the user's preference for D's first-page attitude, A's side-by-side composition, and C's welcoming portrait into three final homepage candidates. First page retains D's centered abstract and two columns, adding the portrait to the correspondence note; Alongside puts the portrait by the opening byline; Personal manuscript uses a reading column with an author margin.
- Replaced mock publication labels inside these candidates with the requested actual navigation: CV on the left, Research, Writings, Teaching & talks, and Things I make on the right. Page links open the existing published pages; the study does not imply redesigned interior pages are finished.
- Kept the comparison controls outside the proposed website and made the new comparison portable, with display assets embedded and URL fragments selecting the candidate. Intercepted intra-document links in embedded previews so correspondence links scroll within the proposal rather than nesting the comparison.
- Added a separate final-proposal builder and stylesheet, preserving A–E and the saved A–C snapshots. Reused approved typography, portrait, toy landscape, interaction, and provisional content. The user's next content-writing pass can happen after choosing the composition; production Markdown and deployment are unchanged.

## 2026-10-18 — Select First page

- Recorded the user's choice of final proposal 1, First page, as the design to carry forward. Removed the separate “St. Louis, Missouri” line from the final candidates' correspondence areas, retaining the university's full name in the affiliation.
- Rebuilt the local candidates and comparison. Content refinement and migration into the production templates remain future work; this selection does not publish the mock-up or change the earlier saved explorations.

## 2026-11-14 — Publish First page with the November CV and first essay

- Migrated the selected First page composition into the production templates, retaining Crimson Text, neutral Paper, the centered abstract, two-column overview, interactive burgundy Figure 1, and the portrait by correspondence. The CV stays on the left of a sticky header; interior pages use the same reading style and include Home. The separate location line and public design controls remain absent.
- Replaced the downloadable CV with the supplied November 2026 PDF, unchanged, and updated correspondence to its WashU email. Retained the May PDF asset for existing links. Updated research dates, supervisors, completed results, and explicitly planned work; moved the muon-collider project into earlier work. Added the completed October workshop poster, teaching responsibilities, and community roles from the CV.
- Added Chocalate as an external publication entry with the publisher's title and October 5, 2026 date. A short description links to the Pittsburgh Review of Books rather than republishing the essay. Writings keeps informal work above academic-writing context. The existing equation specimen is preserved as an editable draft.
- Added validated HTTPS external-writing metadata and explicit draft handling. Neither external entries nor drafts create local article pages; turning a published article into a draft removes stale output on rebuild. Extended existing editing-workflow tests to cover these cases and all fragment links.
- Kept prose in Markdown, including the homepage research, teaching, and software summaries. Paper Night's updated description follows the adjacent project's current README and remains labeled in development. Added no unprovided slides, paper downloads, software release links, or formal group appointment.
- Preserved the local design history and snapshots, and refreshed the editing guide for the selected layout, externally published writing, and drafts. GitHub Pages continues to deploy only the built `dist/` after checks pass.

## 2026-11-14 — Correct the essay title

- Changed the displayed title to Chocolate at the author's request. Home and Writings use the same entry; the publisher URL and source filename remain unchanged. Updated the editing example to match.

## 2026-11-26 — Search visibility for rafacs.com

- Audited the live site and confirmed the custom domain and redirects. Found repeated page descriptions and missing canonical, sitemap, crawler-discovery, social-preview, and author metadata. Chose a focused technical SEO pass that preserves the selected composition and prose.
- Added editable per-page search descriptions and titles, absolute canonical and social URLs, and safely serialized JSON-LD connecting the author, confirmed WashU profile, website, and page. Future local writings receive BlogPosting metadata and validated publication/revision dates; no unfinished work is presented as a scholarly publication.
- Generate robots.txt and sitemap.xml from the actual built pages, excluding drafts, external article destinations, historical studies, and stale output. Omitted unsupported or guessed freshness signals. Root links now consistently use the canonical homepage path while remaining relative for previews.
- Reused the existing portrait for social previews, preloaded the primary reading font, and load equation CSS only when equations occur. Retained the GitHub Pages deployment and existing URL paths.
- Added regression checks for metadata consistency, sitemap membership and removals, identity relationships, JSON escaping, date/URL validation, and conditional math styles. Documented editable SEO fields and Search Console verification/submission. Public DNS already has the expected www CNAME; the observed www HTTPS certificate issue requires checking hosting state rather than overwriting working DNS.

## 2026-11-26 — Connect the Rafael Coca byline with the academic identity

- The author wants the site discoverable for Rafael Coca, also the byline on the published Chocolate essay. Put that name in the homepage search title and natural introductory prose, with the full name retained in the description, author entity, and formal page identity.
- Added editable, validated alternateNames metadata so Rafael Coca and Rafael Coca Salazar resolve to the same Person as the existing full name and initials. Kept all page URLs and design styling unchanged; did not create duplicate name-targeted pages or keyword lists.
- Extended the author metadata checks to cover optional aliases, duplicates, and invalid input. Updated the domain notes after a successful www HTTPS and permanent-redirect recheck. Indexing and ranking remain external outcomes; the owner manages Search Console in their own browser.
