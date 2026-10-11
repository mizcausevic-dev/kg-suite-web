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

## Selective release candidate

Only these destination files have user-visible or privacy-relevant changes:

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

Before upload, compare the remote destination hashes with the baselines above and save the exact remote bytes outside the served docroot. Abort and rebase if any destination changed. Upload only this list through the established authenticated channel. Then request `/`, `/mcp/`, `/implementations/`, `/properties/`, `/specs/`, `/llms.txt`, the crosswalk Markdown, and all four changed scripts from the public host. Check linked npm and Registry records, keyboard interactions, narrow-screen overflow, and security headers. Test restoration from the saved remote files and verify the former hashes before describing rollback as proven. No remote backup, upload, hosted smoke, or rollback was executed as part of this branch.

## Checks and limits

- `git diff --check`: exit 0.
- `node --check` on six imported/edited constellation, crosswalk, and LLM scripts: exit 0.
- A Node VM check generated all four “Send to LLM” links from a URL containing `?token=SECRET#private`: exit 0; the links included the public `/mcp/` path and excluded query and fragment content.
- A Python `html.parser` pass over the five edited HTML routes: all local CSS/JS and image references resolve in this checkout; no duplicate IDs, image elements without alt text, or unsafe blank-target links; MCP JSON-LD parses.
- A PNG-signature/IHDR pass confirmed all fifteen imported screenshots have valid PNG headers and plausible dimensions. Their visual currency was not established. The stale Bench v0.1 image was removed from the page.
- Browser rendering and responsive interaction were **not** verified locally. The in-app browser could not reach the local preview (`ERR_CONNECTION_TIMED_OUT`), and a loopback request was blocked/timed out in this environment.
- No check here verifies live buyer authentication, policy interception, revocation, hosted audit completeness, physical infrastructure, or NIST conformance.
