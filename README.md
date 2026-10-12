# kg-suite-web

The landing site for the **[Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite)** — twelve open JSON governance specs, eleven regulated six-pack extensions, and a separately shaped aerospace extension in draft.

Live at **[suite.kineticgain.com](https://suite.kineticgain.com)**.

## What's here

```
.
├── index.html                    # the landing page (hero, specs, implementations, audit spine, NIST crosswalk, constellation)
├── style.css                     # live theme and interaction styles
├── suite-nav.js                  # sticky section nav + scrollspy + fx-glow pointer-follow
├── *-constellation.js            # visual maps for Suite, specs, MCP, and implementations
├── nist-crosswalk.js, send-to-llm.js # historical mapping visual and click-initiated link sharing
├── mcp/                          # suite.kineticgain.com/mcp/ — MCP server tool inventory + registry status
├── mcp-domain/                   # separate mcp.kineticgain.com docroot source; deploy independently
├── verticals/                    # 11 six-pack landings plus a draft aerospace page (not a six-pack)
├── docs/nist-rmf-crosswalk.md    # historical eleven-spec NIST AI RMF mapping, not conformance evidence
├── assets/fonts.css, assets/fonts/*.woff2   # self-hosted Space Grotesk / Inter / JetBrains Mono
├── .htaccess                     # security headers (CSP, HSTS, etc.)
├── .well-known/security.txt
├── robots.txt, sitemap.xml, llms.txt
└── CHANGELOG.md
```

No build step. The Suite docroot is static HTML/CSS/JS with self-hosted fonts and its own strict CSP (`script-src 'self'`, no `unsafe-inline`/`unsafe-eval`). The separately hosted MCP candidate removes the current page's GTM bootstrap and serves its fonts from its own docroot; its live header policy must be reviewed independently before upload.

The aerospace page is a noindex draft at `verticals/aerospace/`. Its cards and tool have not been published, so the page links only to existing Suite routes and primary public sources. It is not one of the eleven six-packs. The legacy `verticals/_generate.mjs` script requires an explicit overwrite flag because it would replace live-synced content; it must not be used to produce aerospace pages.

## Provenance

This repo replaces **`kinetic-gain-suite-landing`** as the deploy source (2026-08-06). That repo's `main` branch had drifted three months stale behind the live site — every fix since May shipped by editing the production files directly over SSH — and a second, unrelated feature branch was mid-merge with an unresolved conflict. Rather than reconcile three divergent copies, this repo was seeded fresh from the exact file tree live on `suite.kineticgain.com` at time of migration, which is the only copy that was actually current. `kinetic-gain-suite-landing` is retired; do not deploy from it.

On 2026-10-10, the live Suite site had again advanced beyond this repository's `main` branch. The review branch reimported the exact live baselines for the five edited HTML routes, their referenced JavaScript/CSS, and fifteen referenced screenshots before making content corrections. The separate standalone MCP domain was imported on 2026-10-11 UTC. See [site sync review](docs/SITE_SYNC_REVIEW_2026-10-10.md) and [standalone MCP provenance](mcp-domain/README.md). Other routes and assets were not reconciled, so this checkout is **not approved for a whole-tree upload**.

## Local preview

```bash
python3 -m http.server 8080
```

## Deployment

**Manual, not CI.** The old repo's GitHub Actions workflow deployed over FTPS (port 21) and was unreliable. This checkout still differs from unedited live routes. A whole-tree upload could replace newer live files with older source versions.

For this review branch, first make an independently recoverable remote backup of the exact destination files and confirm their hashes still match the live baselines in the [site sync review](docs/SITE_SYNC_REVIEW_2026-10-10.md) and [standalone MCP provenance](mcp-domain/README.md). Upload only the listed paths over the existing SSH-key channel. The standalone domain has its own `/public_html/mcp/` target and must be transferred independently of the Suite `/public_html/suite/mcp/` route. Recheck every edited route, its referenced assets, and the external npm/Registry links. Prove rollback by restoring the saved files and observing the prior hashes before calling the procedure ready. No delete step is part of this transfer.

For the aerospace draft, see [the dated site release gate](docs/AEROSPACE_SITE_RELEASE_2026-10-12.md). It records live baselines, exact paths, unresolved repo-link gates, and selective rollback steps. Do not upload the draft while its linked source repositories and MCP tool status are unverified.

## License

Apache-2.0.
