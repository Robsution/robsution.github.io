# Rafael’s personal site

A preprint-inspired academic website for Rafael Arturo Coca Salazar, published at [robsution.github.io](https://robsution.github.io/). This is an independent repository inside `niceties/personal-site`; it does not modify the Paper Night extension.

**To change the homepage introduction, [edit content/home.md on GitHub](https://github.com/Robsution/robsution.github.io/edit/main/content/home.md).** It contains only prose. Commit to `main` to publish through the existing GitHub Pages workflow. See [EDITING.md](EDITING.md) for the other pages and copyable examples.

## Current site

- The chosen **First page** design: Crimson Text on neutral Paper, a centered abstract, two columns, an interactive burgundy contour figure, and a portrait beside the correspondence email.
- A sticky header with a direct CV download on the left and page links on the right. Interior pages add Home and highlight the current page. There are no public design controls or location line in correspondence.
- Five main pages: Home, Research, Writings, Teaching & talks, and Things I make.
- Research and teaching updated from the supplied November 2026 CV. Current work includes microbial consumer–resource models, conditional auxotrophy, three-spin glasses, and nuclear-response emulators. The muon-collider project is dated September 2025–September 2026.
- The October 2026 workshop **poster** is listed by title with its collaborators. The project and presentation descriptions distinguish completed results from planned work.
- [Chocalate](https://pghrev.com/chocalate/), published in the Pittsburgh Review of Books on October 5, 2026, links directly to the publication from Home and Writings. The publisher’s spelling is retained. Academic writing appears below informal pieces.
- The November 2026 CV is downloadable unchanged. Site correspondence uses the WashU email from that CV.
- Paper Night is described as an in-development local prototype, using the current Niceties project documentation. No public installation link or release is invented.
- The equation specimen remains editable with `draft: true` and is omitted from publication. Markdown, LaTeX, and accessible MathML continue to work for real posts and page content.

The toy landscape is a sum of Gaussian bumps with noisy gradient ascent, adapted from the user's supplied mock-up. It is an interactive illustration, not a research result. Display assets are hosted locally; the site has no accounts, analytics, or backend. Navigation and asset paths work under either a GitHub Pages root domain or a repository subpath.

## Editing

| Content | Source |
| --- | --- |
| Homepage abstract | `content/home.md` |
| Homepage research, teaching, and software summaries | `content/currently.md` |
| Full research entries | `content/research.md` |
| Teaching, presentations, community roles | `content/teaching.md` |
| Software and other work | `content/making.md` |
| Writings introductions and academic-writing summary | `content/writings.md` |
| Individual articles or externally published writing | `content/writing/*.md` |
| Identity, affiliation, email, portrait, CV filename/date | `content/site.json` |
| CV, portrait, additional images | `public/` |

Homepage summaries use `##` sections and `### label | title` entries; the first section occupies the left of Figure 1, with subsequent sections below. The right-hand title is displayed for each research summary. Writings keeps two sections: informal pieces first, academic writing second. Recent public informal pieces appear automatically on the homepage.

Posts accept `section: posts` or `section: academic`, `draft: true` to exclude unfinished work, and optional `externalUrl:` and `publication:` for a piece published elsewhere. External URLs must use HTTPS; external entries link to the publisher and do not create duplicate article pages. The simple metadata format uses one `key: value` per line, rather than full YAML.

Use `$...$` for inline mathematics and `$$` on separate lines for display equations. Invalid LaTeX stops publication. Markdown is trusted author content and may include HTML; it is not a public upload service.

## Development and preview

Requires Node 22 or newer. From this repository:

```sh
npm ci
npm run build
npm test
npm run preview
```

Open <http://127.0.0.1:4186/>. On this Windows computer, `./preview.ps1` uses the bundled Node runtime when available. The preview serves `dist/`; rebuild after editing source, then refresh. Stop the server with Ctrl+C. Set `PERSONAL_SITE_PORT` to choose another port.

- `tools/content.mjs`: Markdown, mathematics, page sections, and writing metadata.
- `tools/templates.mjs`: layouts; normal text editing does not require this file.
- `tools/build.mjs`: static page generation, assets, and omission of drafts/external article pages.
- `src/assets/style.css`: selected appearance, reading layouts, responsive and print styles.
- `src/assets/landscape.svg` and `landscape.js`: contour figure and interaction.
- `src/assets/interactions.js`: copying the selectable email address.
- `dist/`: generated output; do not edit it directly.

The earlier font explorer scripts and packaged alternative fonts remain as historical source, but are not loaded by the public pages.

## Publish

The repository is [Robsution/robsution.github.io](https://github.com/Robsution/robsution.github.io). The [Publish website workflow](.github/workflows/pages.yml) installs dependencies with Node 24, builds, runs the tests, and deploys only `dist/` after checks pass. A push to `main` or a manual workflow run on `main` triggers publication.

For local edits, first `git pull --ff-only`, then edit, build, test, commit, and push. Content changes made in GitHub’s editor publish automatically too. [Actions](https://github.com/Robsution/robsution.github.io/actions/workflows/pages.yml) shows deployment status.

## Verification

`npm test` checks Markdown/LaTeX, content structure, generated links and anchors, asset paths, the downloadable PDF, contrast, writing order, safe external publication links, draft exclusion, and absence of design controls. Isolated builds exercise editing the bio and identity, adding/deleting articles, and turning a published article back into a draft without stale output. Tests use fixtures instead of pinning ordinary author text.

Browser review observations are in [REVIEW.md](REVIEW.md). Decisions and changes are recorded separately in [CODE_HISTORY.md](CODE_HISTORY.md).

## Preserved design studies

The independent [design-study](design-study/README.md) folder preserves the earlier A–E proposals, three final candidates, and saved A–C snapshots. Its October copy and checklist are historical drafts; the current website is generated from `content/` and `tools/`.

Run `./design-study/preview.ps1` for the historical comparison at <http://127.0.0.1:4187/final-comparison.html>. This directory is not copied into the deployed site.

Crimson Text is packaged locally with its [font license](https://github.com/google/fonts/tree/main/ofl/crimsontext). KaTeX assets and their license are also bundled.
