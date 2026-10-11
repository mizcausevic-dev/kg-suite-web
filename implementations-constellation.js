/* Suite x Implementations, visualized. Same radial hub/leaf engine PATTERN as
   the homepage's suite-constellation.js, /specs/'s specs-constellation.js and
   /mcp/'s mcp-constellation.js (polar layout, hub/leaf/glow/sweep mechanics,
   dossier panel, filter pills) -- adapted, not cloned, for this page's real
   data shape. Closest structural relative is specs-constellation.js: hub =
   group, leaf = item inside that group (there, vertical -> specs; here,
   buyer persona -> repo).

   ADDITIVE: sits above the existing .impl-accordion on this page, which
   stays the default, untouched, zero-click reference surface -- this is a
   second, exploratory way to reach the same real data, not a replacement.
   Hub labels, repo names, language tags, URLs, and descriptions are
   editorial summaries of the .impl-group / .impl-repo markup in
   implementations/index.html; synchronize both surfaces on each edit. Hub
   sizing uses the REAL total repo count per persona group (leaves actually
   drawn), which for "SRE / Platform reliability" is 9 -- 5 individually
   described plus the 4 "grouped predecessor" repos that only appear as a
   collective row with real GitHub links, no individual write-up (that
   distinction is preserved in the shared description text for those 4
   leaves, not smoothed over). The literal "N repos" / "5 repos + 4 grouped
   predecessors" badge text printed on each accordion card is reused verbatim
   as the dossier "kind" line, so the two surfaces can never show
   contradictory counts for the same group.

   The Vault Contract Pattern's 4-surface .vault-accordion deliberately did
   NOT get a second diagram -- same call mcp-constellation.js made for its
   own two small, already-scannable 4-item sections (see that file's header
   comment). Four items in a single flat list is legible at its real size;
   a radial map would add interaction cost without adding legibility.

   "Jump to card" (hub) opens the target .impl-group <details> (closed by
   default on this page, unlike mcp/index.html's always-open spec-grid) and
   scrolls to it -- modern browsers auto-expand a closed <details> on anchor
   navigation into it, and the explicit .open = true below makes that
   non-optional rather than relying on that behavior alone. "Open repo"
   (leaf) links straight to the real GitHub URL already printed on the card.

   Accessibility (hard requirement, not decoration): every interactive hub
   and leaf carries a real tabindex="0", role="button" and a descriptive
   aria-label; Enter/Space fire the same handler as a click; keyboard focus
   mirrors mouse hover for the dossier preview; every repo count rendered is
   real visible SVG text next to the node, never size- or color-only; all
   animation is wrapped in prefers-reduced-motion (see the page's <style>
   block in <head> for the actual @media rule). */
(function () {
  "use strict";

  var HUBS = [
    {
      code: "procurement", label: "Procurement reviewer", groupId: "group-procurement",
      badge: "2 repos",
      intro: "Five reference handoffs connect Decision Card drafting, policy-bundle proposals, contract metadata, CSV validation, and DDL generation. A hosted buyer decision and downstream enforcement remain unverified.",
      items: [
        { l: "procurement-decision-api", lang: "Python (FastAPI)", u: "https://github.com/mizcausevic-dev/procurement-decision-api",
          desc: "FastAPI service that drafts AI Procurement Decision Cards from a buyer rubric and a set of vendor Suite documents (AEO + agent-card + tool-card + ai-evidence + …). The first cross-ecosystem bridge in the portfolio — Suite × Decision Intelligence." },
        { l: "policy-as-code-engine", lang: "Python (FastAPI)", u: "https://github.com/mizcausevic-dev/policy-as-code-engine",
          desc: "Declarative policy evaluator. POST /bundles/from-decision-card proposes a PolicyBundle from Decision Card conditions. A generated bundle is not evidence that a live request was gated." },
      ]
    },
    {
      code: "aeo", label: "AEO consumer / spec implementer", groupId: "group-aeo",
      badge: "4 repos",
      intro: "The 5-layer AEO Reference Stack, in order: SDKs → CLI → Crawler → aeo-validator-service (Layer 4) → aeo-graph-explorer-rs (Layer 5, below).",
      items: [
        { l: "aeo-validator-service", lang: "Python (FastAPI)", u: "https://github.com/mizcausevic-dev/aeo-validator-service",
          desc: "HTTP validator reference for AEO and Suite documents. It can identify a spec, compute a canonical hash, and compare watch rechecks; hosted availability and complete coverage require separate verification." },
        { l: "aeo-graph-explorer-rs", lang: "Rust (axum, petgraph)", u: "https://github.com/mizcausevic-dev/aeo-graph-explorer-rs",
          desc: "HTTP graph-query service over aeo-crawler JSON-Lines output. axum + petgraph, atomic POST /ingest, exposes /nodes · /neighbors · /shortest-path · /find-by-claim. The fifth layer of the AEO Reference Stack — 3→5 layers gap closed." },
        { l: "incident-correlation-rs", lang: "Rust (petgraph)", u: "https://github.com/mizcausevic-dev/incident-correlation-rs",
          desc: "Walks the Suite graph from an IncidentCard and emits a structured remediation plan: DecisionCard → RecheckPolicy, Vendor → RequestReview, AEO/agent/tool → Revalidate." },
        { l: "hash-attestation-rs", lang: "Rust (ed25519)", u: "https://github.com/mizcausevic-dev/hash-attestation-rs",
          desc: "Ed25519 signing and verification reference for canonical Suite documents. A valid signature verifies a key and document binding; vendor identity requires an independently trusted key-to-vendor binding." },
      ]
    },
    {
      code: "data", label: "Data team", groupId: "group-data",
      badge: "3 repos",
      intro: "One contract can feed CSV validation and proposed database DDL. Generated DDL does not establish that a production database applied it.",
      items: [
        { l: "data-contract-registry", lang: "Python (FastAPI)", u: "https://github.com/mizcausevic-dev/data-contract-registry",
          desc: "Schema registry with semver versioning, compatibility checks (backward / forward / full), declared owners, freshness SLAs. POST /contracts/owners/from-decision-card pulls Owner records out of a Procurement Decision Card. Cross-ecosystem hook #3." },
        { l: "csv-data-quality-rs", lang: "Rust (tokio, csv)", u: "https://github.com/mizcausevic-dev/csv-data-quality-rs",
          desc: "Streaming CSV validator against a data-contract-registry contract. Async, row-by-row, structured violation report (required / bad_type / enum_mismatch / column_count_mismatch / invalid_json). Cross-ecosystem hook #4." },
        { l: "sql-contract-enforcer", lang: "Python (SQL)", u: "https://github.com/mizcausevic-dev/sql-contract-enforcer",
          desc: "Generates dialect-aware DDL proposals and a contract-vs-schema checker for CI. Database execution, migration safety, and rollback need a real target test; BigQuery does not enforce several generated constraints." },
      ]
    },
    {
      code: "sre", label: "SRE / Platform reliability", groupId: "group-sre",
      badge: "5 repos + 4 grouped predecessors",
      intro: "The README claims “Ten repos” here; the table only names 9 — 5 described below (including audit-stream-py, the spine this stack writes to) plus 4 more grouped under “Plus 5 earlier reliability repos” (itself claims 5, names 4). Two count mismatches, carried here rather than rounded off.",
      items: [
        { l: "slo-budget-tracker", lang: "Python (FastAPI, Prometheus)", u: "https://github.com/mizcausevic-dev/slo-budget-tracker",
          desc: "SLO + error-budget library, multi-window burn-rate alerts (SRE workbook threshold 14.4)." },
        { l: "reliability-toolkit-rs", lang: "Rust (Tokio)", u: "https://github.com/mizcausevic-dev/reliability-toolkit-rs",
          desc: "Token-bucket rate limiter · 3-state circuit breaker · exponential-backoff retry with jitter · bulkhead." },
        { l: "feature-flag-rs", lang: "Rust (Tokio)", u: "https://github.com/mizcausevic-dev/feature-flag-rs",
          desc: "Server-side flag eval — targeting rules, sticky percentage rollouts (SHA-256 bucketing, no RNG), hot reload." },
        { l: "request-shadow-rs", lang: "Rust (Tokio)", u: "https://github.com/mizcausevic-dev/request-shadow-rs",
          desc: "Async request mirroring with sampling + divergence detection. The SRE primitive for safe migrations." },
        { l: "audit-stream-py", lang: "Python · SSE", u: "https://github.com/mizcausevic-dev/audit-stream-py",
          desc: "Hash-chained audit-stream reference with REST and Server-Sent Events. It can show continuity of accepted records; complete capture and an independently held checkpoint require separate hosted proof." },
        { l: "rate-limit-shield", lang: "Python", u: "https://github.com/mizcausevic-dev/rate-limit-shield", grouped: true,
          desc: "One of 4 “defense-in-depth predecessors” — the README's own collective description for this row; no individual write-up exists. Confirmed to exist (GitHub API returns HTTP 200), but not individually hyperlinked in the README — this URL follows the org's github.com/mizcausevic-dev/<repo-name> pattern used by every other repo on this page: pattern-inferred, not source-confirmed." },
        { l: "identity-mesh", lang: "Python", u: "https://github.com/mizcausevic-dev/identity-mesh", grouped: true,
          desc: "One of 4 “defense-in-depth predecessors” — the README's own collective description for this row; no individual write-up exists. Confirmed to exist (GitHub API returns HTTP 200), but not individually hyperlinked in the README — this URL follows the org's github.com/mizcausevic-dev/<repo-name> pattern used by every other repo on this page: pattern-inferred, not source-confirmed." },
        { l: "agent-canary", lang: "Python", u: "https://github.com/mizcausevic-dev/agent-canary", grouped: true,
          desc: "One of 4 “defense-in-depth predecessors” — the README's own collective description for this row; no individual write-up exists. Confirmed to exist (GitHub API returns HTTP 200), but not individually hyperlinked in the README — this URL follows the org's github.com/mizcausevic-dev/<repo-name> pattern used by every other repo on this page: pattern-inferred, not source-confirmed." },
        { l: "model-registry-pro", lang: "Python", u: "https://github.com/mizcausevic-dev/model-registry-pro", grouped: true,
          desc: "One of 4 “defense-in-depth predecessors” — the README's own collective description for this row; no individual write-up exists. Confirmed to exist (GitHub API returns HTTP 200), but not individually hyperlinked in the README — this URL follows the org's github.com/mizcausevic-dev/<repo-name> pattern used by every other repo on this page: pattern-inferred, not source-confirmed." },
      ]
    },
    {
      code: "mcp", label: "MCP / Claude integrator", groupId: "group-mcp",
      badge: "3 repos",
      intro: "Three MCP servers for three integration surfaces — the README calls the latter two “sibling MCP servers … for narrower use cases” alongside the unified mcp-kinetic-gain.",
      items: [
        { l: "mcp-kinetic-gain", lang: "TypeScript", u: "https://github.com/mizcausevic-dev/mcp-kinetic-gain",
          desc: "Published Suite MCP server v0.10.0: 75 tools across 12 specs, including DefenseTech. It provides local previews such as aup_check_compliance, decision_card_validate, and defensetech_vault_resolve_3axis; the published stdio package does not enforce a buyer decision on downstream handlers." },
        { l: "mcp-reliability-toolkit", lang: "TypeScript", u: "https://github.com/mizcausevic-dev/mcp-reliability-toolkit",
          desc: "Reliability MCP server — compute_slo_burn, design_rate_limiter, design_circuit_breaker, compose_reliability_pattern. Same math as slo-budget-tracker; emits Python + Rust configs." },
        { l: "mcp-decision-intelligence", lang: "TypeScript", u: "https://github.com/mizcausevic-dev/mcp-decision-intelligence",
          desc: "Decision Intelligence MCP server with read-only validation and policy previews. Compare output with the corresponding service repository; this is not proof of a hosted decision path." },
      ]
    },
    {
      code: "runtime", label: "Runtime gate candidates", groupId: "group-runtime",
      badge: "2 repos",
      intro: "Broker, Azure bridge, and SQL DDL repositories describe possible enforcement boundaries. The signed-card one-tool MCP pilot is a draft PR; hosted interception, private routing, audit custody, and rollback remain unverified.",
      items: [
        { l: "mcp-permission-broker", lang: "Python", u: "https://github.com/mizcausevic-dev/mcp-permission-broker",
          desc: "Policy broker reference for a Decision Card and MCP tool call. Draft signed-card one-tool interception work is unmerged; a production handler path and durable audit are not yet proven." },
        { l: "azure-openai-governance-bridge", lang: "Python (Azure Functions, Bicep)", u: "https://github.com/mizcausevic-dev/azure-openai-governance-bridge",
          desc: "Azure Function and Bicep reference for evaluating policy at an Azure OpenAI route. Private routing and per-call hosted denial remain unverified." },
      ]
    }
  ];

  var svg = document.getElementById("implc-graph");
  if (!svg) return;

  var N = HUBS.length;
  var TOTAL_REPOS = HUBS.reduce(function (sum, h) { return sum + h.items.length; }, 0);
  var CX = 500, CY = 500;
  var HUB_R = 210, LEAF_R = 350, ARC_R = 430, CENTER_R = 48;

  function hue(i) { return Math.round((360 / N) * i); }
  function colorFor(i) { return "hsl(" + hue(i) + ",72%,62%)"; }
  function colorFaint(i) { return "hsl(" + hue(i) + ",55%,42%)"; }
  function polar(cx, cy, r, deg) {
    var rad = (deg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function anchorFor(px) {
    var dx = px - CX;
    if (Math.abs(dx) < 9) return "middle";
    return dx > 0 ? "start" : "end";
  }
  var svgns = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    var e = document.createElementNS(svgns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  var activeCode = null;
  var hubEls = {}, leafEls = [];

  HUBS.forEach(function (h, i) {
    var angle = (360 / N) * i;
    var hubPos = polar(CX, CY, HUB_R, angle);
    var col = colorFor(i);

    var arcSpan = (360 / N) * 0.74;
    var a0 = angle - arcSpan / 2, a1 = angle + arcSpan / 2;
    var p0 = polar(CX, CY, ARC_R, a0), p1 = polar(CX, CY, ARC_R, a1);
    var largeArc = arcSpan > 180 ? 1 : 0;
    var arcPath = "M " + p0.x.toFixed(1) + " " + p0.y.toFixed(1) +
      " A " + ARC_R + " " + ARC_R + " 0 " + largeArc + " 1 " + p1.x.toFixed(1) + " " + p1.y.toFixed(1);
    svg.appendChild(el("path", { class: "arc", d: arcPath, stroke: col, "data-persona": h.code }));

    var spokeStart = polar(CX, CY, CENTER_R, angle);
    var spoke = el("line", { class: "spoke", x1: spokeStart.x, y1: spokeStart.y, x2: hubPos.x, y2: hubPos.y, stroke: col, "data-persona": h.code });
    svg.appendChild(spoke);

    // Hub radius scales with the REAL repo count for this persona group
    // (h.items.length -- every leaf actually drawn, including the 4 grouped
    // SRE predecessors). Never size-only: the same number is also rendered
    // as literal SVG text in the hub label two lines down.
    var hubR = 13 + Math.min(15, h.items.length * 1.6);
    var hubGroup = el("g", {
      class: "node-hub hoverable", "data-persona": h.code, "data-kind": "hub",
      tabindex: "0", role: "button",
      "aria-label": h.label + ", " + h.items.length + (h.items.length === 1 ? " real repo" : " real repos") + " (" + h.badge + "). Activate to see details and browse the repos."
    });
    hubGroup.appendChild(el("circle", { class: "ring", cx: hubPos.x, cy: hubPos.y, r: hubR + 6, stroke: colorFaint(i) }));
    hubGroup.appendChild(el("circle", { class: "core", cx: hubPos.x, cy: hubPos.y, r: hubR, fill: "var(--bg)", stroke: col }));
    hubGroup.appendChild(el("circle", { cx: hubPos.x, cy: hubPos.y, r: 3.2, fill: col }));
    var lblPos = polar(CX, CY, HUB_R + hubR + 24, angle);
    var hubLbl = el("text", { class: "lbl-hub", x: lblPos.x, y: lblPos.y, "font-size": 10, fill: col, "text-anchor": anchorFor(lblPos.x) });
    hubLbl.textContent = truncate(h.label.toUpperCase(), 30) + " · " + h.items.length;
    svg.appendChild(hubGroup);
    svg.appendChild(hubLbl);
    hubEls[h.code] = { group: hubGroup, lbl: hubLbl, spoke: spoke, hub: h };

    var fan = Math.min((360 / N) * 0.86, (h.items.length - 1) * 11);
    h.items.forEach(function (item, j) {
      var leafAngle = angle - fan / 2 + (fan / (h.items.length - 1 || 1)) * j;
      if (h.items.length === 1) leafAngle = angle;
      var leafPos = polar(CX, CY, LEAF_R, leafAngle);
      var branch = el("path", {
        class: "branch", "data-persona": h.code, stroke: colorFaint(i),
        d: "M " + hubPos.x.toFixed(1) + " " + hubPos.y.toFixed(1) + " L " + leafPos.x.toFixed(1) + " " + leafPos.y.toFixed(1)
      });
      svg.appendChild(branch);

      var leafGroup = el("g", {
        class: "node-leaf hoverable", "data-persona": h.code, "data-kind": "leaf",
        tabindex: "0", role: "button",
        "aria-label": "Repo " + item.l + ", part of the " + h.label + " group" + (item.grouped ? ", one of the 4 grouped predecessors with no individual write-up" : "") + ". Activate to see details."
      });
      leafGroup.appendChild(el("circle", { cx: leafPos.x, cy: leafPos.y, r: 5.5, fill: "var(--bg)", stroke: col }));
      leafGroup.appendChild(el("circle", { class: "beacon", cx: leafPos.x, cy: leafPos.y, r: 2, fill: item.grouped ? colorFaint(i) : col }));
      svg.appendChild(leafGroup);

      var lp = polar(CX, CY, LEAF_R + 13, leafAngle);
      var leafLbl = el("text", { class: "lbl-leaf", x: lp.x, y: lp.y, "font-size": 7.2, fill: "var(--muted-2)", "text-anchor": anchorFor(lp.x) });
      leafLbl.textContent = truncate(item.l, 24);
      svg.appendChild(leafLbl);

      leafEls.push({ hub: h, group: leafGroup, item: item });
    });
  });

  svg.appendChild(el("circle", { class: "center-ring", cx: CX, cy: CY, r: 66 }));
  svg.appendChild(el("circle", { class: "center-core", cx: CX, cy: CY, r: CENTER_R }));
  var centerLbl = el("text", { class: "center-lbl", x: CX, y: CY - 4, "text-anchor": "middle", "font-size": 12 });
  centerLbl.textContent = "IMPLEMENTATIONS";
  svg.appendChild(centerLbl);
  var centerSub = el("text", { class: "center-sub", x: CX, y: CY + 14, "text-anchor": "middle", "font-size": 8 });
  centerSub.textContent = TOTAL_REPOS + " REPOS · " + N + " PERSONAS";
  svg.appendChild(centerSub);

  var dossier = document.getElementById("implc-dossier");
  var dKind = document.getElementById("implc-dKind"), dTitle = document.getElementById("implc-dTitle"),
    dDesc = document.getElementById("implc-dDesc"), dFields = document.getElementById("implc-dFields"),
    dLink = document.getElementById("implc-dLink");

  function showDossierForHub(h) {
    dKind.textContent = "Buyer persona · " + h.badge;
    dTitle.textContent = h.label;
    dDesc.textContent = h.intro;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>Repos in this group</span><strong>" + h.items.length + "</strong>";
    dFields.appendChild(f1);
    dLink.textContent = "Open persona group ↓";
    dLink.href = "#" + h.groupId;
    dLink.target = "";
    dLink.setAttribute("data-open-details", h.groupId);
    dossier.classList.add("show");
  }
  function showDossierForItem(hub, item) {
    dKind.textContent = "Repo · " + hub.label + (item.grouped ? " · grouped predecessor" : "");
    dTitle.textContent = item.l;
    dDesc.textContent = item.desc;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>Language</span><strong>" + item.lang + "</strong>";
    dFields.appendChild(f1);
    var f2 = document.createElement("div"); f2.className = "field";
    f2.innerHTML = "<span>Persona group</span><strong>" + hub.label + "</strong>";
    dFields.appendChild(f2);
    dLink.textContent = "Open repo →";
    dLink.href = item.u;
    dLink.target = "_blank";
    dLink.removeAttribute("data-open-details");
    dossier.classList.add("show");
  }
  document.getElementById("implc-dossierClose").addEventListener("click", function () { dossier.classList.remove("show"); });

  // "Open persona group" forces the target (closed-by-default on this page)
  // <details> open before the anchor jump lands, rather than relying on
  // browsers' native closed-details-anchor-expansion behavior alone.
  dLink.addEventListener("click", function () {
    var targetId = dLink.getAttribute("data-open-details");
    if (!targetId) return;
    var target = document.getElementById(targetId);
    if (target && "open" in target) target.open = true;
  });

  function applyFilter(code) {
    activeCode = code;
    svg.querySelectorAll("[data-persona]").forEach(function (node) {
      if (!code || node.getAttribute("data-persona") === code) node.classList.remove("dim");
      else node.classList.add("dim");
    });
    document.querySelectorAll(".implc-pill[data-persona]").forEach(function (pill) {
      var isActive = pill.getAttribute("data-persona") === code;
      pill.classList.toggle("active", isActive);
      if (isActive) { pill.style.background = pill.getAttribute("data-color"); pill.style.color = "var(--bg)"; }
      else { pill.style.background = ""; pill.style.color = ""; }
    });
    var resetPill = document.querySelector(".implc-pill.reset");
    if (resetPill) resetPill.classList.toggle("active", !code);
  }

  Object.keys(hubEls).forEach(function (code) {
    var rec = hubEls[code], h = rec.hub, g = rec.group;
    g.addEventListener("mouseenter", function () { if (!activeCode) applyFilter(h.code); showDossierForHub(h); });
    g.addEventListener("mouseleave", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("focus", function () { if (!activeCode) applyFilter(h.code); showDossierForHub(h); });
    g.addEventListener("blur", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("click", function () { applyFilter(activeCode === h.code ? null : h.code); showDossierForHub(h); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        applyFilter(activeCode === h.code ? null : h.code);
        showDossierForHub(h);
      }
    });
  });

  leafEls.forEach(function (leaf) {
    function activate(e) { if (e) e.stopPropagation(); showDossierForItem(leaf.hub, leaf.item); }
    leaf.group.addEventListener("mouseenter", function () { showDossierForItem(leaf.hub, leaf.item); });
    leaf.group.addEventListener("focus", function () { showDossierForItem(leaf.hub, leaf.item); });
    leaf.group.addEventListener("click", activate);
    leaf.group.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); activate(e); }
    });
  });

  svg.addEventListener("click", function (e) { if (e.target === svg) applyFilter(null); });

  var pillbar = document.getElementById("implc-pillbar");
  var resetPill = document.createElement("button");
  resetPill.type = "button";
  resetPill.className = "implc-pill reset active";
  resetPill.textContent = "ALL " + TOTAL_REPOS;
  resetPill.addEventListener("click", function () { applyFilter(null); dossier.classList.remove("show"); });
  pillbar.appendChild(resetPill);

  HUBS.forEach(function (h, i) {
    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "implc-pill";
    pill.setAttribute("data-persona", h.code);
    var col = colorFor(i);
    pill.setAttribute("data-color", col);
    pill.style.borderColor = colorFaint(i);
    pill.textContent = h.label + " · " + h.items.length;
    pill.addEventListener("mouseenter", function () { if (activeCode !== h.code) { pill.style.background = col; pill.style.color = "var(--bg)"; } });
    pill.addEventListener("mouseleave", function () { if (activeCode !== h.code) { pill.style.background = ""; pill.style.color = ""; } });
    pill.addEventListener("click", function () { applyFilter(activeCode === h.code ? null : h.code); showDossierForHub(h); });
    pillbar.appendChild(pill);
  });
})();
