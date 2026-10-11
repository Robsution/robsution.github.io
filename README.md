# Rafael’s personal site

A local, preprint-inspired website prototype for Rafael Arturo Coca Salazar. This is an independent project inside `niceties/personal-site`; it does not modify the Paper Night extension.

## Try it

The preview is at **http://127.0.0.1:4186** while the local server is running. Select **Explore the design** at the bottom right to compare three neutral surfaces (Paper, Gray, Night), three accent colors (Blue, Burgundy, Graphite), and eight serif typefaces. The current comparison highlights Newsreader, Spectral, Alegreya, and Crimson Text beside EB Garamond and Crimson Pro; Source Serif 4 and Libre Baskerville remain under Earlier comparisons. Each card uses the same capital/lowercase sample. You can also toggle the portrait and choose contours, a lattice, or no motif. Motif color is independent of links. The chosen defaults are Crimson Text, Paper with blue links and burgundy contours, and the portrait at right.

Try a JPG, PNG, or WebP portrait on Home. The preview resizes it locally and keeps it in this tab’s session storage, never uploading it. The Remove photo button clears it. Appearance preferences persist in this browser. Copy this combination produces a short description to paste into the design conversation.

On this Windows computer, start a stopped preview with:

```powershell
.\preview.ps1
```

The launcher uses Node on PATH if it is version 22 or newer, otherwise the bundled Codex Node runtime. Stop it with Ctrl+C. Set `PERSONAL_SITE_PORT` to choose another port.

On another computer, install Node 22 or newer, then:

```sh
npm ci
npm run build
npm test
npm run preview
```

## What exists

- Six static pages: Home, Research, Writings, Teaching & talks, Things I make, and a sample article.
- A compact introduction and a sticky masthead with a direct CV download on every page. There is no separate CV page.
- Writings places informal posts and reflections above academic pieces. “Things I make” is a provisional name for software and non-research work.
- A current WashU appointment and Physics 1760 teaching role based on Rafael’s supplied details.
- Research and education history based on the May 2026 CV. The original PDF is downloadable and explicitly dated. Its “present” LBNL entry is not asserted to remain current.
- A provisional bio and an explicit exploratory status for work with Mikhail Tikhonov.
- A clearly identified demonstration article, with Markdown and KaTeX equations rendered at build time, including accessible MathML.
- Local font and equation assets: the site makes no external requests and has no accounts, analytics, or backend.
- Relative paths suitable for either a GitHub Pages root domain or a repository subpath.

The talks section has a planned October 2026 entry awaiting its title and details. The Princeton course-assistant role is dated February 2023–May 2024; peer tutoring is dated September 2023–December 2024. There are no invented talks, publications, live software releases, advisor appointments, or biographical claims. No portrait has been supplied yet. The contact email comes from the supplied CV. The downloaded original CV includes its original referee section; review that file before making the site public.

## Edit content

- `content/site.json`: identity, default design, portrait filename, preview controls, and CV filename.
- `tools/templates.mjs`: page content and shared HTML templates.
- `content/writing/*.md`: prose posts. Use a lowercase hyphenated filename and the metadata shape in the sample.
- `src/assets/style.css`: all layouts, themes, print, and responsive styles.
- `src/assets/site.js`: design controls and local portrait previews.
- `public/`: public files copied into `dist/assets/`. Add a permanent portrait here and set `portrait` to its filename in the configuration.
- `dist/`: generated site. Rebuild after editing source; do not edit generated pages directly.

Set `section: posts` (the default) or `section: academic` in each post’s metadata to choose its Writings section. Posts use `$...$` for inline equations and `$$` on separate lines for display equations. Invalid LaTeX stops the build. The post pipeline accepts trusted author-written Markdown, including HTML; it is not a public upload service. The metadata format is deliberately simple `key: value` lines rather than full YAML.

## Publish with GitHub Pages

This prototype has **not been published** and is not connected to a GitHub repository. The included [publishing workflow](.github/workflows/pages.yml) installs dependencies with Node 24, builds and checks the site, and publishes `dist/` whenever changes are pushed to `main`. Only a successful build and test run can deploy. No hosting credentials need to be added.

1. On GitHub, create a public repository named `YOUR-USERNAME.github.io`, replacing `YOUR-USERNAME` with your GitHub username. Leave its README, license, and gitignore options empty because this folder already contains the source files.
2. In PowerShell, run the following from this site's folder. Replace both username placeholders in the remote URL before running it. These commands are for the initial setup of this currently unversioned folder:

   ```powershell
   Set-Location 'C:\Users\rafae\projects\niceties\personal-site'
   git init -b main
   git add .
   git commit -m "Add personal website"
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-USERNAME.github.io.git
   git push -u origin main
   ```

   Git may open a browser to sign in. If it asks for a commit identity, configure your name and preferred commit email for this repository, then repeat the commit and push. The `.gitignore` excludes generated files, dependencies, caches, and preview screenshots. The contents of `personal-site` must be at the repository root, with `.github/workflows/pages.yml` included; do not upload the enclosing `niceties` folder.
3. In the GitHub repository, open **Settings → Pages → Build and deployment → Source**, and choose **GitHub Actions**. The publishing workflow is already included, so skip the suggested templates.
4. Open **Actions → Publish website → Run workflow**, choose `main`, and run it. This starts a fresh run if the initial push ran before Pages was enabled. After it succeeds, the site is at `https://YOUR-USERNAME.github.io/`.

Later updates only need a commit and push to `main`; GitHub rebuilds and publishes automatically. A repository with another name also works, with the site under `https://YOUR-USERNAME.github.io/REPOSITORY/`, because all site paths are relative.

The current version still includes design controls and sample copy. To hide the customizer when ready, set `previewTools` to `false` in `content/site.json`. A permanent portrait goes in `public/`, with its filename set in the same configuration. The specimen article, provisional copy, and May 2026 CV can be revised before the first push. If the specimen article is removed, update its corresponding test in `tests/site.test.mjs` as well.

The explorer preference key can be cleared in browser storage if testing different baked-in defaults. The current key is `rafael-site-design-v2`, so superseded palette and section-name preferences do not affect this version. Query parameters such as `?theme=gray&font=crimson&accent=burgundy&motif=lattice` override remembered appearance for that visit.

See [GitHub’s Pages guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [KaTeX’s rendering documentation](https://katex.org/docs/node.html), and the separate [decision history](CODE_HISTORY.md).

## Verification

`npm test` checks Markdown/math parsing, literal code examples, malformed input, generated page links/assets, historical/specimen labels, contrast for all accent/surface combinations, Writings ordering, and the combined teaching history. Build before testing. Browser verification covers appearance changes, persistence across navigation, portrait previews, desktop and phone widths, equation display, font switching, independent motif color, and the sticky CV download. Browser observations are recorded in `REVIEW.md`.


Typography references: [Newsreader](https://github.com/productiontype/Newsreader), [Spectral](https://github.com/productiontype/Spectral), [Alegreya](https://github.com/huertatipografica/Alegreya), and [Crimson Text](https://github.com/google/fonts/tree/main/ofl/crimsontext). Fonts are packaged locally with their licenses.
