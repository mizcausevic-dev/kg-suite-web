# Aerospace Suite site release gate — 2026-10-12

## State

**Live public draft, verified on 2026-10-12.** Suite site PR #4 merged at `205a7b7758f834152049074797ecd41f872e60bd`; cache hotfix PR #5 merged at `3dedee9dce98f1ecb9d379b3521bb78cd450c9a3`. The four reviewed files were selectively activated on Hostinger. The five linked aerospace repositories are public drafts, the optional Incident Card profile is merged, and the source-linked crosswalk page is live at <https://mizcausevic-dev.github.io/aero-assurance-crosswalk/>. Aviation MCP tools remain a review candidate; the public MCP package does not yet include them. The new Suite page is `noindex,nofollow` and is absent from `sitemap.xml` and `llms.txt`.

The first activation exposed a one-week stylesheet cache: the unversioned `/verticals/vertical.css` URL returned the prior bytes under `Cache-Control: public, max-age=604800`. PR #5 added `?v=20261012-aerospace` to both edited HTML pages. Live HTTP then returned the reviewed stylesheet bytes at the URL those pages load. The plain URL can remain stale until its cache expires; the shipped pages do not use it.

The active Suite source is `kg-suite-web`. The older `kinetic-gain-suite-landing` repository is retired and must not be used as a deploy source. This branch started from GitHub `origin/main` at `dd8fa6748aa98dabf812c6f42d4e6db83528f819`.

## Live baseline observed on 2026-10-12

Read-only HTTPS GETs returned status 200. SHA-256 hashes are for the fetched response bytes:

| Live path | SHA-256 | Compared with `origin/main` |
| --- | --- | --- |
| `/` | `8ffe998eb24afc41cd0e108a34f6d155432be26d9f11de1ea9bf280b35d7c7b7` | matched |
| `/verticals/` | `3b81ed44f16dccccb8443b380598bdff56659c3b7ac9920ae03c2581a6698622` | drifted; exact live file imported before editing |
| `/verticals/healthtech/` | `541c47d37415dfd3cef2188c5b1a527c38e09d7dcd37a62c4b6d424d4573e901` | drifted; left untouched |
| `/sitemap.xml` | `40ac6dec6e7578cd93e5d27467baf230d3e17e08e44188f00c77a8f195ec00bd` | matched; draft route intentionally excluded |
| `/style.css` | `3a0b91a9935c26c8521f1241f938b3a68afc87275462fe497733da198c82639d` | drifted; exact live file imported |
| `/verticals/vertical.css` | `0ee6b78a5d363251b0d47eaba4ba30518e654eb720531303d55a3dc302d35961` | matched |
| `/suite-nav.js` | `f4a222052cfc75ac235b1f84da5805a643a4ea785b1c8e77ae10900182e69780` | matched |
| `/nav-toggle.js` | `f733745fc92d53f83233d0b6ee5831c042c1ded7a9ce258b7f9b64dce4a398f2` | matched |
| `/verticals-constellation.js` | `986301155be6bcb565cb605ad9fbf60810273d0689b822ee15112fcc0394cb14` | missing locally; exact live file imported |
| `/send-to-llm.js` | `7fb43094409e32f91467aa26e6e604d94c6b67f4472d58869e5c967e53e570ac` | matched |

The live verticals index has an 11-hub, 66-leaf constellation. Those are the existing eleven six-pack verticals. Aerospace is a separate draft extension and must not be counted as a twelfth six-pack or a 67th sibling repo. The stale count in the edited index was its footer label, `All six verticals`; this branch changes it to `All verticals`.

The live index also links to `/certified/`, which returned HTTP 200 but is not represented in `origin/main`. The new page preserves that live navigation link. Its presence is a further reason to deploy selected files only.

The live `/`, `/verticals/`, `/style.css`, `/verticals-constellation.js`, and `/verticals/vertical.css` responses were fetched again before release work on 2026-10-12. All five returned HTTP 200 and exactly matched the SHA-256 baselines above.

## Local verification

- `py -3 -m unittest discover -s tests -v`: 6/6 passed after the cache hotfix, including local links, route separation, noindex, public-draft source links, and a versioned shared stylesheet URL.
- `node --check nav-toggle.js`: exit 0.
- `git -c core.whitespace=cr-at-eol diff --check`: exit 0.
- Local HTTP preview in the in-app browser: on the new page, at 390 px and 1440 px viewport widths, document scroll width equalled client width; the four cards became one column on phone and two on desktop. At 768 px the page was visually checked with no horizontal overflow. Mobile menu opened by button, Tab reached its first link, Escape closed it. With `prefers-reduced-motion: reduce`, computed transition and animation durations on the primary button were `0s`. The edited `/verticals/` index also had no horizontal overflow at 390 px and its menu button now precedes the links in keyboard order; after opening it, Tab reached Overview. This checks the local candidate, not Hostinger behavior.

## Hosted verification and restoration

`Site checks` succeeded on PR #5 head `9c03ad831a5dbf2ff4384d8943d71c6b26c2a6ea` and on merged `main` at `3dedee9dce98f1ecb9d379b3521bb78cd450c9a3` ([run 38277596725](https://github.com/mizcausevic-dev/kg-suite-web/actions/runs/38277596725)). The two existing destination files were backed up locally and in a private directory on Hostinger before activation. The merged `main` HTML bytes matched the files uploaded.

After the hotfix, HTTPS GETs returned 200 with these SHA-256 response-body hashes; the same results were observed again after the rollback drill and reactivation:

| Live URL | SHA-256 |
| --- | --- |
| `/verticals/` | `864140a9bcee8b6f58aca2797446598ed0298ae1f0b86ba62a634e86f25c3cbe` |
| `/verticals/vertical.css?v=20261012-aerospace` | `1ca6da10fdb29036fbef5b7c6fe2c6fd875d7e2c03889a22c7b3805610b59156` |
| `/verticals/aerospace/` | `1e73eb4d1114f50cd13efce11b4a4c00dd4d08e09cee181868e51392ba73f3a2` |
| `/verticals/aerospace/aerospace.css` | `c4d219b9cf88b2349095fe2b1ec5960895ba46133a7e0b6ce1f2ee42b404e1a2` |

Those four responses carried CSP, HSTS, `X-Content-Type-Options: nosniff`, and `X-Frame-Options: DENY`. A live browser loaded the versioned shared stylesheet, showed no horizontal overflow at 390 or 1440 px, exposed five reviewed artifact links, and logged no console errors. The aerospace route remained `noindex,nofollow`.

The rollback script restored the prior `/verticals/` hash `3b81ed44f16dccccb8443b380598bdff56659c3b7ac9920ae03c2581a6698622`; a live GET returned that hash and `/verticals/aerospace/` returned 404. Reactivation then restored the four final hashes above. The new directory was moved into the private backup during rollback, not deleted.

## Release procedure and continuing gates

1. The five aerospace source repositories exist remotely and are linked as public drafts. The Rust implementation has hosted CI; the crosswalk page's generated HTML/CSS hashes were read back from GitHub Pages at its successful deployment run `38276505643`. Keep the aviation MCP tools labelled unreleased until their private Glama and package release gates pass.
2. Re-fetch the exact live destination paths and compare hashes before any later upload. If the live files change from the final hashes above, rebase the affected files on the new live versions and rerun checks. Preserve the live navigation, explain controls, constellation, and scripts.
3. Review the final page copy against current EASA/FAA/EUROCAE status. Recheck whether Part 108 has final text before adding any UAS autonomy claim. Review aviation legal and export-control boundaries with a qualified human before any certification or defense-related claim.
4. Local responsive, keyboard, reduced-motion, and static-asset checks are recorded above. The hosted route and security headers were checked after upload; repeat them after any future edit.
5. For a later manual release, back up the exact live destination files and hashes. This release uploaded only `/verticals/aerospace/index.html`, `/verticals/aerospace/aerospace.css`, `/verticals/index.html`, and `/verticals/vertical.css`, followed by a two-HTML-file cache hotfix. `style.css` and `verticals-constellation.js` were imported live baselines and were not uploaded. Do not whole-tree sync.
6. Fetch each uploaded URL and verify status, headers, links, content, and hashes, including the stylesheet URL as loaded by the HTML. The executed rollback restored the saved previous files and confirmed their original hashes. The two new aerospace files had no previous version; the tested rollback moved that new directory into the private release backup rather than deleting it.

No new infrastructure, credentials, or analytics were added for this static draft. Real aviation data, buyer review, certification acceptance, and the aviation MCP private Glama gate remain outside this site release. The browser pass used the in-app Chromium browser; other browser engines were not verified.
