# kg-suite-web

The landing site for the **[Kinetic Gain Protocol Suite](https://github.com/mizcausevic-dev/kinetic-gain-protocol-suite)** — twelve open JSON governance specs for the answer-engine and agent era, plus eleven regulated-vertical extensions.

Live at **[suite.kineticgain.com](https://suite.kineticgain.com)**.

## What's here

```
.
├── index.html                    # the landing page (hero, specs, implementations, audit spine, NIST crosswalk, constellation)
├── style.css                     # BERT dark-cyan theme + canonical FX effect library
├── suite-nav.js                  # sticky section nav + scrollspy + fx-glow pointer-follow
├── mcp/                          # suite.kineticgain.com/mcp/ — MCP server tool inventory + registry status
├── verticals/                    # the 11 regulated-vertical landing pages (HealthTech, EdTech, FinTech, ...)
├── docs/nist-rmf-crosswalk.md    # OMB M-24-10 / NIST AI RMF crosswalk, linked from the NIST section
├── assets/fonts.css, assets/fonts/*.woff2   # self-hosted Space Grotesk / Inter / JetBrains Mono
├── .htaccess                     # security headers (CSP, HSTS, etc.)
├── .well-known/security.txt
├── robots.txt, sitemap.xml, llms.txt
└── CHANGELOG.md
```

No build step. Static HTML/CSS/JS, self-hosted fonts, strict CSP (`script-src 'self'`, no `unsafe-inline`/`unsafe-eval`).

## Provenance

This repo replaces **`kinetic-gain-suite-landing`** as the deploy source (2026-08-06). That repo's `main` branch had drifted three months stale behind the live site — every fix since May shipped by editing the production files directly over SSH — and a second, unrelated feature branch was mid-merge with an unresolved conflict. Rather than reconcile three divergent copies, this repo was seeded fresh from the exact file tree live on `suite.kineticgain.com` at time of migration, which is the only copy that was actually current. `kinetic-gain-suite-landing` is retired; do not deploy from it.

## Local preview

```bash
python3 -m http.server 8080
```

## Deployment

**Manual, not CI.** The old repo's GitHub Actions workflow deployed over FTPS (port 21) — Hostinger's WAF blocks GitHub Actions runners on FTP/SFTP, so that workflow was silently unreliable, which is the root cause of the drift above. Every real deploy in this estate goes over SSH-key SFTP (port 65002) run manually, typically via Claude Code:

```bash
tar -czf - -C . . | ssh -i ~/.ssh/kineticgain_ed25519 -p 65002 u815783393@82.25.89.47 \
  "tar --overwrite -xzf - -C ~/domains/kineticgain.com/public_html/suite"
```

Upload-only. Never chain a delete step onto a deploy.

## License

Apache-2.0.
