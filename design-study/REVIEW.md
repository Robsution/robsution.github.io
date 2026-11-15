# Design study verification

- Built all five standalone pages and the portable comparison with the existing Node runtime and Marked dependency.
- Compiled the eight inline scripts in the standalone pages and checked 53 local links and anchors. Each page has one main heading. Body, secondary, burgundy, and blue-green text colors exceed 4.5:1 contrast against the paper background.
- Visually inspected A, B, and C on desktop (the final comparison viewport reported 1280 × 720), including C's lower portrait/contact area.
- Inspected the three phone compositions and Writings at a reported 390 × 844 viewport. All three homepages had no horizontal overflow. A later request for 320 px did not change the measured viewport, so 320 px was not independently verified.
- Exercised the contour with Enter: a new walker appeared and its trajectory acquired points. The original reduced-motion branch remains in the inspected animation code; OS reduced-motion emulation was not tested.
- Exercised Copy on the contact address and observed its “Copied” state. Verified navigation between the comparison layouts and the Writings/content pages. No browser console errors or warnings were reported in the inspected session.
- The screenshot artifacts under `../artifacts/design-study/` are local review outputs. The `*-opening.png` screenshots show the final desktop compositions; earlier full-page captures record the layout exploration.
- No production templates, styles, content, workflow, or deployed files were changed. Production tests were not rerun for this independent design study.
- Stopped the owned preview server and then verified that the loaded portable comparison still switches to Content to fill, Writings, and back to A. Its inline JavaScript also passed compilation. Reopening the HTTP URL requires restarting the preview server; the saved portable HTML can be opened directly in a browser that supports local files.

## Added preprint alternatives

- Preserved the original comparison and source archive before adding D and E. Verified that the saved comparison's SHA-256 still matches the original after the rebuild.
- Built seven standalone pages plus the portable comparison. Compiled all 12 standalone inline scripts and the portable wrapper, checked 102 local links/anchors, and verified one main heading per page.
- Inspected D and E at desktop 1280 × 900, the narrower in-app panel, and phone 390 × 844. At phone width, both documents measured 375 px content width and 375 px scroll width: no horizontal overflow. D's columns stack; E's notes join the reading flow.
- Clicked the contents link to Research and the author correspondence footnote, and observed the corresponding sections. Pressing Enter on D's figure increased its walker count from two to three.
- The browser log included one MutationObserver error while switching iframe documents. The authored scripts do not instantiate a MutationObserver; its origin was not established. The tested layout switching, links, and figure interaction worked. No claim is made that the browser console was entirely clear.
- Final desktop captures: `../artifacts/design-study/d-opening.png` and `e-opening.png`; phone captures: `d-mobile.png` and `e-mobile.png`.
- The user requested the preview remain hosted, so the server on port 4187 is left running. These additions are not published to GitHub Pages.

## Final proposals — 18 October 2026

- Built three standalone candidates and the separate portable `final-comparison.html` using Node built-ins. Compiled 10 scripts across the standalone pages, embedded pages, and wrapper; checked 30 links/anchors and 12 display-asset references. All public page destinations match existing generated site routes, including `writing.html`.
- Visually inspected all three at 1280 × 1000 and 390 × 844. Each phone document measured 375 px client width and 375 px scroll width, with a loaded portrait and no horizontal overflow. Also inspected First page in the normal in-app panel and at 1280 × 1200 to see the correspondence portrait together with the page body.
- Verified switching all three proposals, an active comparison tab, the real CV/page-link destinations, and the correspondence jump. Found and fixed fragment navigation inside `srcdoc` that initially nested the comparison; after the fix the footnote scrolls within the selected proposal and leaves its comparison URL intact.
- Enter on the contour increased the walker count from two to three. Copying the email displayed “Copied.” The final browser log check returned no errors or warnings.
- The saved original A–C comparison retains SHA-256 `84a36ebc6a0c1cde72457959fba8ff6fdb3747e8616581464d8f61836d2bd5fc`. The separate final builder leaves the earlier A–E source and generated pages untouched. `git diff --check` passed.
- Screenshots are `../artifacts/design-study/final-{1,2,3}-desktop.png` and `final-{1,2,3}-mobile.png`; the First page correspondence has an additional close view. The viewport was reset and the final comparison left open, with the preview server running as requested.
- These remain local design proposals with provisional copy. Interior-page links open the existing public site; no production templates, editable content, deployment, or GitHub publication were changed. Production tests were not rerun for the separate study.
