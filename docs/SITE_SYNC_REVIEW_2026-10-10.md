# Suite site sync review — 2026-10-10

## Decision

**Review branch only. Do not upload the whole checkout.** The public site had newer page structure and assets than `kg-suite-web/main`. Five edited HTML routes were rebuilt from their exact live HTTP response bodies before copy changes. Unedited routes have not been reconciled. A selected-file upload is a candidate only after a remote backup, pre-upload hash comparison, and a tested restore procedure.

`kinetic-gain-suite-landing` is retired and must not be used as a deployment source.

## Content changes

- Pin published `mcp-kinetic-gain@0.10.0` and link npm and the official MCP Registry; describe its 75 local stdio tools as previews, not a buyer-policy gateway.
- Label the signed-card one-tool HTTP pilot as draft PR #48 and remove claims of hosted Broker, Azure, SQL, complete audit, or independent checkpoint proof.
- Link the public repository index; distinguish the visualizer's 11 supported document types from the MCP server's 12 specs.
- Mark the May 2026 NIST crosswalk as an eleven-spec historical document and the implementation mappings as design examples, not conformance findings. Point `/specs/` to the current source repo.
- Remove an unverified estate property count and stale distribution counts.
- Remove the `/properties/` card's v0.1 Bench screenshot, which contradicted the verified v0.2 public page. The card now describes the current synthetic heuristic screen without a stale image.
- Make “Send to LLM” share only origin and pathname on click; query parameters and fragments are excluded.
- Repair the Suite `/mcp/` registry table's narrow-screen overflow with a labeled keyboard-scrollable region and add a main landmark.
- Import the separately hosted `mcp.kineticgain.com` page, retain its design, update its v0.10.0 claims and pinned install command, remove pre-interaction GTM, and serve the same font families locally. See [`mcp-domain/README.md`](../mcp-domain/README.md).

`bench.kineticgain.com` was inspected separately. Its public `release.json` matched `prompt-injection-bench-web` `origin/main` at `ea5d8501d29dea481ab80f9fe3cc15d9b536f0ab`; the 30-case synthetic corpus and heuristic-result limits were already stated. No Bench source edit was needed.

## Live HTTP baselines

The following SHA-256 values describe the public response bodies fetched on 2026-10-10, before this branch's edits. The copies are in `C:\Users\chaus\Documents\Codex\repos\_kg_suite_live_compare`. An HTTP-body copy is review evidence; make a separate byte-exact remote backup before any upload. Recheck these hashes because live files may change after this review.

| Destination relative to Suite docroot | Live SHA-256 |
|---|---|
| `index.html` | `80F41AE8675321F137F2B51B4D7597B1C4567E67192D5E0DF063B02E18C210AB` |
| `mcp/index.html` | `A7D0E8800252EA06A619EB28C2F0EE76C797F5A6832C3486EC782125386432AF` |
| `implementations/index.html` | `B9DAEB0F26E2E9B1FE4E7361EE4C00FDA3F12EBC5F70BEC017DF018B335DEEFA` |
| `properties/index.html` | `F90133EB2967F95E218ACCF80264638751CDA23316265264EB2A5F3B1CAAB015` |
| `specs/index.html` | `53B3066057297A163EF45FE1938229512319AE9755CFAB21275C3B0F68192D33` |
| `llms.txt` | `5FBD33AD7B414B8D3BCBA8B298084E490CC9FEA48CCC02B05D5B24DD326BA8F7` |
| `docs/nist-rmf-crosswalk.md` | `037968790F6013C08C2085EDB68A19940714C0A6E20EC07D7D74732A931D2049` |
| `suite-constellation.js` | `0208D9A9CF190CE4E640D37026DE89A28626A050041A4D804F1EB7D373E8A258` |
| `implementations-constellation.js` | `3D383D2A66822E8E9970C7753FE757FB6CB89DB28CB745C051340A1456CDF39B` |
| `nist-crosswalk.js` | `8A4FE7F62EB1FA96B08A90D0CD8C8518235843F09FC40A79500A7E2EB54A6BC2` |
| `send-to-llm.js` | `6A46CB8ED58B9BA91507C1DEA7622DD98033F307CB9BB88EBD0D065B4B1056E3` |

`style.css`, `mcp-constellation.js`, and `specs-constellation.js` were also imported from live to make the source-controlled preview complete. The first two differ from live only in comments; the last is identical. Fifteen screenshots referenced by `/properties/` were imported from the public site into source; none was newly designed or verified as current. The removed Bench image was not retained in the branch. These source-sync assets need no upload for this content release.

The standalone `mcp.kineticgain.com` domain is mapped by Hostinger to `/home/u815783393/domains/kineticgain.com/public_html/mcp`, separate from the Suite docroot. Its observed public `index.html` body had SHA-256 `D19214C1C5E3B268F5AD87851398CCAA0AA57554B1222D0556C48C08520F79A0` on 2026-10-11 UTC. Its `favicon.svg` remains unchanged in the candidate; the observed live `gtm-init.js` is intentionally excluded because the updated HTML no longer requests it. Exact hashes and font provenance are in [`mcp-domain/README.md`](../mcp-domain/README.md). An HTTP response hash is review evidence, not a remote-file backup.

## Selective release candidate

Only these destination files have user-visible or privacy-relevant changes:

Suite docroot (`/public_html/suite/`):

```text
index.html
mcp/index.html
implementations/index.html
properties/index.html
specs/index.html
llms.txt
docs/nist-rmf-crosswalk.md
suite-constellation.js
implementations-constellation.js
nist-crosswalk.js
send-to-llm.js
```

Standalone MCP docroot (`/public_html/mcp/`), as a separate transfer. Stage fonts and their licenses before replacing `index.html`:

```text
fonts/inter-latin.woff2
fonts/jetbrains-mono-latin.woff2
fonts/space-grotesk-latin.woff2
fonts/inter-OFL.txt
fonts/jetbrainsmono-OFL.txt
fonts/spacegrotesk-OFL.txt
index.html
```

Before upload, compare each remote destination hash with its own docroot baseline and save the exact remote bytes outside the served docroot. Confirm the six standalone font paths still do not exist; they returned public HTTP 404 on 2026-10-11 UTC. Abort and rebase if any destination changed. Upload only the relevant list through the established authenticated channel. Then request Suite `/`, `/mcp/`, `/implementations/`, `/properties/`, `/specs/`, `/llms.txt`, the crosswalk Markdown, and all four changed scripts; request standalone MCP `/` and all six new font paths separately. Check linked npm and Registry records, keyboard interactions, narrow-screen overflow, third-party requests, and security headers. Test restoration from each saved remote file and verify the former hashes; remove only the six newly introduced standalone font paths after checking their candidate hashes, then verify 404 again. No remote backup, upload, hosted smoke, or rollback was executed as part of this branch.

## Checks and limits

- `git diff --check`: exit 0.
- `node --check` on six imported/edited constellation, crosswalk, and LLM scripts: exit 0.
- A Node VM check generated all four “Send to LLM” links from a URL containing `?token=SECRET#private`: exit 0; the links included the public `/mcp/` path and excluded query and fragment content.
- A Python `html.parser` pass over the five edited HTML routes: all local CSS/JS and image references resolve in this checkout; no duplicate IDs, image elements without alt text, or unsafe blank-target links; MCP JSON-LD parses.
- A PNG-signature/IHDR pass confirmed all fifteen imported screenshots have valid PNG headers and plausible dimensions. Their visual currency was not established. The stale Bench v0.1 image was removed from the page.
- The earlier in-app browser could not reach the local preview (`ERR_CONNECTION_TIMED_OUT`). A later Chrome run route-mapped the candidate files locally and checked all five Suite routes at 390px and 1440px; every route had a main landmark and no document-width overflow. The Suite `/mcp/` table itself remains horizontally scrollable at narrow widths by design.
- A second Chrome route-mapped check of the standalone `mcp-domain/` page passed at 320px, 390px, 768px, and 1440px after the privacy fix: one main landmark, no document-width overflow, v0.10.0 badge, pinned install text, preview disclosure, no duplicate IDs or broken fragment links, successful favicon and three first-party font responses, and no third-party request hosts.
- The three proposed WOFF2 files passed a `wOF2` signature check. Official `ofl/inter`, `ofl/jetbrainsmono`, and `ofl/spacegrotesk` SIL OFL notices are included with the fonts. `git diff --check`: exit 0.
- A local manifest check recomputed SHA-256 for `mcp-domain/index.html` and all six proposed font/notice files; every value appeared in `mcp-domain/README.md`.
- `npm.cmd view mcp-kinetic-gain@0.10.0 version dist.attestations --json`: exit 0; version 0.10.0 and an npm provenance attestation URL were returned. The official MCP Registry latest endpoint returned active server/package version 0.10.0, stdio transport, and optional `AUDIT_STREAM_URL`/`AUDIT_STREAM_TOKEN` variables. GitHub Actions release CI run `37852575630` was successful at release commit `a0f368ce9152dc5854ed1755f90c2e64b987860d`; its Node 20 and 22 logs each reported 222 passing tests.
- The currently live standalone page loads GTM and Google Fonts before interaction; the candidate removes those requests. The existing live CSP still permits Google endpoints. Hosted post-change behavior and tag configuration remain unverified until a deployment smoke test.
- No check here verifies live buyer authentication, policy interception, revocation, hosted audit completeness, physical infrastructure, or NIST conformance.
