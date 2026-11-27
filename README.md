# Rafael’s personal site

A preprint-inspired academic website for Rafael Arturo Coca Salazar, published at [rafacs.com](https://rafacs.com/). The original GitHub Pages address redirects there. This is an independent repository inside `niceties/personal-site`; it does not modify the Paper Night extension.

**To change the homepage introduction, [edit content/home.md on GitHub](https://github.com/Robsution/robsution.github.io/edit/main/content/home.md).** It contains only prose. Commit to `main` to publish through the existing GitHub Pages workflow. See [EDITING.md](EDITING.md) for the other pages and copyable examples.

## Current site

- The chosen **First page** design: Crimson Text on neutral Paper, a centered abstract, two columns, an interactive burgundy contour figure, and a portrait beside the correspondence email.
- A sticky header with a direct CV download on the left and page links on the right. Interior pages add Home and highlight the current page. There are no public design controls or location line in correspondence.
- Five main pages: Home, Research, Writings, Teaching & talks, and Things I make.
- Research and teaching updated from the supplied November 2026 CV. Current work includes microbial consumer–resource models, conditional auxotrophy, three-spin glasses, and nuclear-response emulators. The muon-collider project is dated September 2025–September 2026.
- The October 2026 workshop **poster** is listed by title with its collaborators. The project and presentation descriptions distinguish completed results from planned work.
- [Chocolate](https://pghrev.com/chocalate/), published in the Pittsburgh Review of Books on October 5, 2026, links directly to the publication from Home and Writings. The display title uses the author's corrected spelling; the publisher's URL is unchanged. Academic writing appears below informal pieces.
- The November 2026 CV is downloadable unchanged. Site correspondence uses the WashU email from that CV.
- Paper Night is described as an in-development local prototype, using the current Niceties project documentation. No public installation link or release is invented.
- The equation specimen remains editable with `draft: true` and is omitted from publication. Markdown, LaTeX, and accessible MathML continue to work for real posts and page content.
- Each page has its own search description, a canonical URL on rafacs.com, Open Graph and social preview metadata, and structured author/site data. The build generates `robots.txt` and `sitemap.xml` from public pages. Local articles receive BlogPosting metadata; external publications and drafts do not acquire duplicate article URLs.

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
- `tools/seo.mjs`: validated website URLs, metadata, JSON-LD, sitemap, and crawler discovery.
- `src/assets/style.css`: selected appearance, reading layouts, responsive and print styles.
- `src/assets/landscape.svg` and `landscape.js`: contour figure and interaction.
- `src/assets/interactions.js`: copying the selectable email address.
- `dist/`: generated output; do not edit it directly.

The earlier font explorer scripts and packaged alternative fonts remain as historical source, but are not loaded by the public pages.

## Publish

The repository is [Robsution/robsution.github.io](https://github.com/Robsution/robsution.github.io). The [Publish website workflow](.github/workflows/pages.yml) installs dependencies with Node 24, builds, runs the tests, and deploys only `dist/` after checks pass. A push to `main` or a manual workflow run on `main` triggers publication.

For local edits, first `git pull --ff-only`, then edit, build, test, commit, and push. Content changes made in GitHub’s editor publish automatically too. [Actions](https://github.com/Robsution/robsution.github.io/actions/workflows/pages.yml) shows deployment status.

## Search visibility

The canonical address is `https://rafacs.com/`, controlled by `url` in `content/site.json`. GitHub Pages' custom-domain setting handles the actual domain and redirects; changing this JSON value alone does not configure hosting. The current Actions deployment does not require a CNAME file in the source repository.

Homepage search text uses `seoTitle` and `description` in `content/site.json`. Interior pages can set `seoTitle` and `seoDescription` in their Markdown metadata without changing the visible heading or introduction. Articles use their own title and description, with an optional truthful `updated: YYYY-MM-DD` date. The sitemap deliberately omits guessed modification dates, priority, and change frequency. Home links consistently use `./`, matching the canonical root while retaining local previews and repository-subpath compatibility.

JSON-LD connects the homepage ProfilePage, Person, and WebSite, including the verified WashU directory profile in `sameAs`. Only add other profiles after confirming they belong to the author. This markup helps describe the site; it does not guarantee a special search result. The existing portrait supplies share previews. The primary reading font is preloaded and KaTeX CSS is loaded only on pages with rendered mathematics.

To connect [Google Search Console](https://search.google.com/search-console/):

1. Add a URL-prefix property for **https://rafacs.com/**. Choose HTML-tag verification. This avoids needing DNS access for this one canonical address; a Domain property verified through Porkbun DNS is an alternative if all subdomains/protocols should be included.
2. Copy only the supplied tag's `content` value into a `googleSiteVerification` string in `content/site.json`, publish, then click **Verify** in Search Console. Keep the token after verification. No analytics script is needed.
3. Submit **https://rafacs.com/sitemap.xml** in Sitemaps. Inspect the homepage URL, run a live test, and request indexing. Monitor Page indexing and Performance for actual Google status; a general web search is not a definitive indexing audit.

On November 26 the apex HTTPS address, HTTP redirect, and old GitHub Pages redirect worked. The `www` CNAME already pointed to `robsution.github.io`, but an HTTPS request to `www.rafacs.com` failed certificate validation. That remaining hosting/certificate check is separate from the canonical metadata. Check GitHub Pages' domain/certificate status before changing correct DNS records.

The strongest next content work is publishing substantive research outputs and adding the canonical site link to relevant author-controlled university, ORCID, publication, or GitHub profiles. Add those links only where appropriate and authorized. No keyword stuffing, fabricated papers, purchased links, or indexation claims are used here.

References: [Google SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), [profile markup](https://developers.google.com/search/docs/appearance/structured-data/profile-page), and [GitHub custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Verification

`npm test` checks Markdown/LaTeX, content structure, generated links and anchors, asset paths, the downloadable PDF, contrast, writing order, safe external publication links, draft exclusion, and absence of design controls. SEO checks cover unique metadata, canonical/share URL agreement, structured-data relationships and safe serialization, sitemap completeness, valid dates and site URLs, and conditional math styles. Isolated builds exercise editing the bio and identity, adding/deleting articles, and turning a published article back into a draft without stale HTML or sitemap entries. Tests use fixtures instead of pinning ordinary author text.

Browser review observations are in [REVIEW.md](REVIEW.md). Decisions and changes are recorded separately in [CODE_HISTORY.md](CODE_HISTORY.md).

## Preserved design studies

The independent [design-study](design-study/README.md) folder preserves the earlier A–E proposals, three final candidates, and saved A–C snapshots. Its October copy and checklist are historical drafts; the current website is generated from `content/` and `tools/`.

Run `./design-study/preview.ps1` for the historical comparison at <http://127.0.0.1:4187/final-comparison.html>. This directory is not copied into the deployed site.

Crimson Text is packaged locally with its [font license](https://github.com/google/fonts/tree/main/ofl/crimsontext). KaTeX assets and their license are also bundled.
