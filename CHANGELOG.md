# Changelog

All notable changes to this project are documented here.

## [2.0.0] - 2026-08-06

### Migrated
- Repo replaces `kinetic-gain-suite-landing` as the deploy source. That repo's `main` had drifted three months stale (every fix since May shipped by direct SSH edit to production, because its FTPS GitHub Actions deploy silently failed against Hostinger's WAF), and a separate feature branch was mid-merge with an unresolved conflict. Seeded fresh from the live file tree instead of reconciling three divergent copies.

### Fixed / Changed (carried over from the live-edit period this migration captures)
- Hero rebuilt problem-first: leads with the buyer outcome in plain language before any spec/repo naming, two ranked CTAs (validator, specs), a persona-card row (buyer / vendor / agent-builder) replacing the prior 6-link CTA wall.
- The 12/11/75/172 stat tiles and the 11-vertical list relocated out of the hero into "The suite at a glance" -- hero no longer front-loads the full inventory.
- `fx-shine` (diagonal hover sweep, visible at rest on a grid of cards) replaced with `fx-glow` (pointer-follow soft glow, hover-only) on all "Two front doors" and "Suite x Implementations" cards.
- `#audit-stream` / `#nist` sections narrowed from a 1180px column to 760px with prose filling edge-to-edge, removing a wide empty right column.
- Reconciled number drift against `kinetic-gain-canonical.json`: title/meta/og "17 open specifications" -> "twelve JSON governance specs" (canonical: the Suite hub uses the 12-spec scope, never labeled "open specifications"); audit spine "nine producers" -> "ten" (matches the 10 diagram nodes); constellation "twelve spec surfaces" -> "eleven" (matches the 11 listed); "DefenseTech 8-pack" -> "DefenseTech 8-tool pack" (disambiguated from the unrelated vertical 6-packs); stale "158 tests" -> "172".
- Fixed a container-width regression: `.hero-inner` had drifted to `max-width:1080px` while every other section (header, personas, at-a-glance) uses the shared 1180px rail (`--maxw`), leaving the hero card's whole box indented 50px further right than the rest of the page. Tied to `var(--maxw)` so it can't drift again.


## [1.1.1] - 2026-05-15

### Fixed
- Audit-stream fan-in diagram updated to reflect actual wired event kinds (the earlier 1.1.0 labels were aspirational and didn't match the code in some places — `procurement-decision-api` only emits `decision_card_drafted`, not three kinds; `aeo-validator-service` emits `watch_created` / `watch_drifted` / `watch_validity_flipped`, not `aeo_validation_*`).
- Producer count corrected to **seven** (added `hash-attestation` and `aeo-graph-explorer` which were already in the implementation stack but missing from the fan-in diagram). Event-kind count now 17.
- `<meta description>`, `llms.txt`, and the fan-in caption all updated to match.

## [1.1.0] - 2026-05-15

### Added
- New **"Audit-stream spine"** section between Implementations and NIST: explains the shared hash-chained log every governance moment in the portfolio writes to, plus a Mermaid fan-in diagram showing all 5 producers (4 Python FastAPI services + 1 Rust library) and the 13 event kinds they emit. Mermaid runtime is loaded async at end-of-body so it never blocks first paint.
- Nav link "Audit spine" between Implementations and NIST.
- `llms.txt` gains a dedicated "Audit-stream spine" section enumerating producers, event kinds, and language ecosystems for LLM consumers.

### Changed
- `<meta name="description">` and `og:description` now mention the audit-stream spine and the 5-producer/Python+Rust footprint, so SERP snippets and link unfurls reflect the architectural story, not just the spec count.

## [1.0.0] - 2026-05-12

### Released
- Published **kinetic-gain-suite-landing** as a public, portfolio-grade system focused on platform governance.
- Packaged the current implementation, documentation, validation flow, and proof surfaces into a repo that can be reviewed by technical and operating stakeholders.
- Clarified the core problem the project is addressing: policy drift, observability blind spots, and fragmented evidence during incident or review pressure.

### Why this mattered
- Existing approaches in SIEMs, monitoring platforms, governance workflows, and static policy tools were useful for parts of the workflow.
- They still left out a cleaner operator view tying evidence, control posture, and next action together.
- This release made the repo read like an operational capability rather than a narrow technical demo.

## [0.1.0] - 2026-01-09

### Shipped
- Cut the first coherent internal version of **kinetic-gain-suite-landing** with stable domain objects, review surfaces, and decision outputs.
- Established the first reviewable version of the architecture described as: Canonical front-door landing for the Kinetic Gain Protocol Suite. 10 open governance specs across 2 regulated verticals. Deploys to suite.kineticgain.com.
- Focused the repo around actionability instead of passive reporting.

## [Prototype] - 2025-06-12

### Built
- Built the first runnable prototype for the repo's main workflow and decision model.
- Validated the concept against pressure points such as policy drift, observability blind spots, latency pressure, and fragmented control evidence.
- Used the prototype phase to test whether the project could drive action, not just present information.

## [Design Phase] - 2022-07-10

### Designed
- Defined the system around operator-first and decision-legible outputs.
- Chose interfaces and examples that made sense for platform, security, reliability, and governance teams.
- Avoided reducing the project to a generic dashboard, CRUD app, or fashionable wrapper around the stack.

## [Idea Origin] - 2022-01-10

### Observed
- The original idea surfaced while looking at how teams were handling policy drift, observability blind spots, and fragmented evidence during incident or review pressure.
- The recurring pattern was that teams had data and tools, but still lacked a usable operating layer for the hardest decisions.

## [Background Signals] - 2022-08-09

### Context
- Earlier platform, governance, and operator-tooling work made one pattern hard to ignore: the systems that create the most drag are often the ones with partial controls and weak operational coherence, not the ones with no controls at all.
- That pattern shaped the thinking behind this repo well before the public version existed.