# Standalone MCP domain

This directory is the source for `https://mcp.kineticgain.com/`. Hostinger maps that hostname to `/home/u815783393/domains/kineticgain.com/public_html/mcp`. It is separate from `https://suite.kineticgain.com/mcp/`, which lives under the Suite docroot at `/home/u815783393/domains/kineticgain.com/public_html/suite/mcp`. Updating one address does not update the other.

`index.html`, `favicon.svg`, and `gtm-init.js` were inspected from exact public HTTP response bodies on 2026-10-11 UTC before editing the page. The HTML preserves the live design and updates the published MCP version, test count, pinned install command, and local-preview boundary. Its pre-interaction GTM script and noscript iframe were removed because this static page has no functional dependency on them. The existing remote `gtm-init.js` is not part of this candidate or its upload. `favicon.svg` remains byte-identical to live and needs no upload.

The page now loads only first-party fonts. Inter and JetBrains Mono Latin WOFF2 files were copied from this repository's Suite assets. Space Grotesk Latin WOFF2 came from the [Google Fonts v22 stylesheet](https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap) at `https://fonts.gstatic.com/s/spacegrotesk/v22/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2`. Each font's [SIL Open Font License notice](fonts/) is included beside it; the notices were taken from the official Google Fonts repository (`ofl/inter`, `ofl/jetbrainsmono`, and `ofl/spacegrotesk`).

For a local preview that resolves the page's root-relative asset paths, run `python -m http.server 8080` from this directory and open `http://localhost:8080/`.

| Public response body before edits | SHA-256 |
|---|---|
| `/` (`index.html`) | `D19214C1C5E3B268F5AD87851398CCAA0AA57554B1222D0556C48C08520F79A0` |
| `/favicon.svg` | `FF2A231379993B1E9EAB273BFE031A11734E34B1C7D9887AD58E84EC380A501C` |
| `/gtm-init.js` (observed, excluded from candidate) | `0008AF59D3F7A7BB8C2E6C204ECBF29ECCBAD4F1B85565898FDD95BCE0E7BBE5` |

All six proposed `/fonts/` paths returned public HTTP 404 before this candidate. The candidate files have these SHA-256 hashes:

`index.html` candidate SHA-256: `F675AB3A68325BE21E08FDC2E6F9AEB75AEE3126EF310184838E50594D9D6852`.

| New file under `/fonts/` | SHA-256 |
|---|---|
| `inter-latin.woff2` | `3100E775E8616CD2611BEECFA23A4263D7037586789B43F035236A2E6FBD4C62` |
| `jetbrains-mono-latin.woff2` | `83C005D49D8A6A50474C73A5A36AC0468076E9C4A29DA7BDB14995D80560A5BE` |
| `space-grotesk-latin.woff2` | `0640890476FC1198AB4DE571FB658DE443C4D85B66466EC09534A8737AB1CE9D` |
| `inter-OFL.txt` | `5DD548D31A85F756E01D63E00D7FAF1E324103ED3E9102FCBBABF2CC2DB6DD39` |
| `jetbrainsmono-OFL.txt` | `B2FE5E8987594E9FFD1D2CA52A2F5D73EB8335243893C5D6254B5AD69269591D` |
| `spacegrotesk-OFL.txt` | `18A4DE52385F6B988782639D5D0CC1326E5A8C2DE9A7F01D7B20D9AEDCC60943` |

## Selective release and restore

This review changes `index.html` and adds the six `/fonts/` files above at the standalone domain. Before any upload, save the exact remote `/public_html/mcp/index.html` bytes outside the served docroot. Compare its SHA-256 with the baseline above, and stop if it changed. Confirm the six new destination paths are still absent. Upload only the six fonts and notices first, verify their hashes and public HTTP 200 responses, then upload this directory's `index.html` to that exact target using the established authenticated channel. Do not copy this whole directory into the Suite docroot or replace the whole standalone docroot.

Check public HTTPS, the pinned install text, npm and official MCP Registry links, mobile layout, keyboard navigation, current security headers, and that initial page load requests only this hostname. To prove rollback, restore the saved original `index.html` to the same target, fetch the public page again, and confirm the former hash. Then remove only the six newly introduced font/notice files after checking they retain the candidate hashes, and confirm those paths return 404 again. The preexisting remote GTM file is left untouched to keep the saved old page restorable. Redeploy the reviewed candidate only if the restoration drill succeeded. None of the remote backup, upload, hosted smoke, or restore steps has been executed by this review branch.

The candidate's local Chrome network trace showed only `mcp.kineticgain.com` requests at 320px, 390px, 768px, and 1440px, including all three font files. The live page still makes third-party requests until the candidate is deployed. Its current CSP permits Google endpoints; tightening that live policy requires a separately reviewed server-header change.
