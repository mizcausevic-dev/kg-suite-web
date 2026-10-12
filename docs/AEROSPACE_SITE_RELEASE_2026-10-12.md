# Aerospace Suite site release gate — 2026-10-12

## State

**Site draft only. No Suite-site merge or upload has been performed for this change.** The five linked aerospace repositories are now public drafts. The Incident Card profile and aviation MCP tools remain review candidates; the public MCP package does not yet include aviation tools. The new page is `noindex,nofollow` and is absent from `sitemap.xml` and `llms.txt`.

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

- `py -3 -m unittest discover -s tests -v`: 5/5 passed, including local links, route separation, noindex, and public-draft source links.
- `node --check nav-toggle.js`: exit 0.
- `git -c core.whitespace=cr-at-eol diff --check`: exit 0.
- Local HTTP preview in the in-app browser: on the new page, at 390 px and 1440 px viewport widths, document scroll width equalled client width; the four cards became one column on phone and two on desktop. At 768 px the page was visually checked with no horizontal overflow. Mobile menu opened by button, Tab reached its first link, Escape closed it. With `prefers-reduced-motion: reduce`, computed transition and animation durations on the primary button were `0s`. The edited `/verticals/` index also had no horizontal overflow at 390 px and its menu button now precedes the links in keyboard order; after opening it, Tab reached Overview. This checks the local candidate, not Hostinger behavior.

## Release gates

1. The five aerospace source repositories exist remotely and are linked as public drafts. The Rust implementation has hosted CI. Keep the aviation MCP tools labelled unreleased until their private Glama and package release gates pass.
2. Re-fetch the exact live destination paths and compare hashes before upload. If the live files changed from the baselines above, rebase the affected files on the new live versions and rerun checks. The page must preserve the live navigation, explain controls, constellation, and scripts.
3. Review the final page copy against current EASA/FAA/EUROCAE status. Recheck whether Part 108 has final text before adding any UAS autonomy claim. Review aviation legal and export-control boundaries with a qualified human before any certification or defense-related claim.
4. Local responsive, keyboard, reduced-motion, and static-asset checks are recorded above. After upload, repeat link, header, and route checks against the hosted boundary.
5. For an authorized manual release, back up the exact live destination files and hashes. Upload only `/verticals/aerospace/index.html`, `/verticals/aerospace/aerospace.css`, `/verticals/index.html`, and `/verticals/vertical.css` to the Suite docroot. `style.css` and `verticals-constellation.js` in this branch are imported live baselines and need no upload if their live hashes still match. Do not whole-tree sync.
6. Fetch each uploaded URL and verify status, headers, links, content, and hashes. Test rollback by restoring the saved previous files and confirming their original hashes. The two new aerospace files have no previous version; reverting that route would require deleting only those new files, with a deliberate approval at release time.

No new infrastructure, credentials, or analytics are required for this static draft. Existing Suite privacy and security headers must still be checked at the live boundary after an authorized upload.
