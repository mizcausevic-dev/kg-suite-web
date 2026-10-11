/* The suite, visualized. Ported from kineticgain-com-apex/constellation's
   proven radial engine (same polar math, same hub/leaf/dossier mechanics),
   re-pointed at suite.kineticgain.com's own content. Counts and links
   below are editorial snapshots and must be checked on each release.
   Vanilla JS + SVG, no dependencies, respects prefers-reduced-motion via the
   CSS side (the only animation is the decorative conic sweep). */
(function () {
  "use strict";

  var SECTIONS = [
    { code: "SPECS", name: "Governance specs", count: 12, href: "/specs/",
      desc: "Open JSON specifications for the answer-engine and agent era: entity declaration, prompt provenance, agent capability disclosure, evidence citation, and per-tool MCP disclosure.",
      items: [
        { l: "AEO Protocol", u: "https://github.com/mizcausevic-dev/aeo-protocol-spec" },
        { l: "Agent Cards", u: "https://github.com/mizcausevic-dev/agent-cards-spec" },
        { l: "AI Evidence Format", u: "https://github.com/mizcausevic-dev/ai-evidence-format-spec" },
      ] },
    { code: "VERTICALS", name: "Vertical 6-packs", count: 11, href: "/verticals/",
      desc: "The same six canonical artifact shapes, fanned across eleven regulated verticals: HealthTech, EdTech, PropTech, InsurTech, HR Tech, FinTech, GovTech, LegalTech, EnergyTech, DefenseTech, RetailTech.",
      items: [
        { l: "HealthTech", u: "/verticals/healthtech/" },
        { l: "FinTech", u: "/verticals/fintech/" },
        { l: "GovTech", u: "/verticals/govtech/" },
      ] },
    { code: "MCP", name: "MCP Server", count: 75, href: "/mcp/",
      desc: "Published mcp-kinetic-gain v0.10.0 offers 75 tools across 12 specs, including the DefenseTech extension. Its local stdio previews do not enforce buyer policy on downstream handlers.",
      items: [
        { l: "npm v0.10.0", u: "https://www.npmjs.com/package/mcp-kinetic-gain/v/0.10.0" },
        { l: "Official MCP Registry", u: "https://registry.modelcontextprotocol.io/v0/servers?search=mcp-kinetic-gain" },
        { l: "Source", u: "https://github.com/mizcausevic-dev/mcp-kinetic-gain" },
      ] },
    { code: "IMPLEMENTATIONS", name: "Implementation stack", count: 23, href: "/implementations/",
      desc: "Selected implementation repositories span procurement, AEO, data tooling, reliability, MCP integration, and candidate runtime gates. Review each repository for current status.",
      items: [
        { l: "rag-sentinel", u: "https://github.com/mizcausevic-dev/rag-sentinel" },
        { l: "deal-desk-workspace", u: "https://github.com/mizcausevic-dev/deal-desk-workspace" },
        { l: "kg-skyyflow-klaviyo-bridge", u: "https://github.com/mizcausevic-dev/kg-skyyflow-klaviyo-bridge" },
      ] },
    { code: "AUDIT SPINE", name: "Audit-stream spine", count: 10, href: "/audit-stream/",
      desc: "An audit-stream reference with hash-chained accepted events and producer integrations. Completeness and an independent checkpoint require a hosted boundary test.",
      items: [
        { l: "Python producers", u: "/audit-stream/" },
        { l: "Rust producers", u: "/audit-stream/" },
        { l: "plpgsql producer", u: "/audit-stream/" },
      ] },
    { code: "PROPERTIES", name: "Featured properties", count: 17, href: "/properties/",
      desc: "A selected set of operator surfaces linked from the property index: validators, visualizers, tutor cards, clinical AI disclosure, a red-team bench, and more. Check each surface for its own status.",
      items: [
        { l: "AEO Visualizer", u: "https://aeo.kineticgain.com" },
        { l: "AI Procurement Pulse", u: "https://pulse.kineticgain.com" },
        { l: "Amor del Fato", u: "https://amordelfato.app" },
      ] },
    { code: "CERTIFIED", name: "KG Certified", count: 1, href: "/certified/",
      desc: "KG Certified source and badge-verification reference. Review current certificate evidence and issuance status before relying on a badge.",
      items: [
        { l: "Reference validator", u: "https://github.com/mizcausevic-dev/kg-certified" },
        { l: "Verify a badge", u: "/certified/" },
        { l: "agent-cards-spec", u: "https://github.com/mizcausevic-dev/agent-cards-spec" },
      ] },
  ];

  var svg = document.getElementById("sconst-graph");
  if (!svg) return;

  // Shared with showDossierForSection's own display text, so the aria-label
  // below never drifts from what a sighted/mouse user already sees.
  function unitFor(s) {
    return s.code === "MCP" ? "tools" : s.code === "AUDIT SPINE" ? "producers" : s.code === "CERTIFIED" ? "badge issued" : "total";
  }

  var TOTAL = SECTIONS.reduce(function (a, s) { return a + s.count; }, 0);
  var N = SECTIONS.length;
  var CX = 500, CY = 500;
  var HUB_R = 230, LEAF_R = 372, ARC_R = 452, CENTER_R = 46;

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

  var activeCode = null;
  var hubEls = {}, leafEls = [];

  SECTIONS.forEach(function (s, i) {
    var angle = (360 / N) * i;
    var hubPos = polar(CX, CY, HUB_R, angle);
    var col = colorFor(i);

    var arcSpan = (360 / N) * 0.72;
    var a0 = angle - arcSpan / 2, a1 = angle + arcSpan / 2;
    var p0 = polar(CX, CY, ARC_R, a0), p1 = polar(CX, CY, ARC_R, a1);
    var largeArc = arcSpan > 180 ? 1 : 0;
    var arcPath = "M " + p0.x.toFixed(1) + " " + p0.y.toFixed(1) +
      " A " + ARC_R + " " + ARC_R + " 0 " + largeArc + " 1 " + p1.x.toFixed(1) + " " + p1.y.toFixed(1);
    svg.appendChild(el("path", { class: "arc", d: arcPath, stroke: col, "data-pod": s.code }));

    var spokeStart = polar(CX, CY, CENTER_R, angle);
    var spoke = el("line", { class: "spoke", x1: spokeStart.x, y1: spokeStart.y, x2: hubPos.x, y2: hubPos.y, stroke: col, "data-pod": s.code });
    svg.appendChild(spoke);

    var hubR = 13 + Math.min(14, s.count / 6);
    var hubGroup = el("g", {
      class: "node-hub hoverable", "data-pod": s.code, "data-kind": "hub",
      tabindex: "0", role: "button",
      "aria-label": s.name + ", " + s.count + " " + unitFor(s) + ". Activate to see details and browse the linked items."
    });
    hubGroup.appendChild(el("circle", { class: "ring", cx: hubPos.x, cy: hubPos.y, r: hubR + 6, stroke: colorFaint(i) }));
    hubGroup.appendChild(el("circle", { class: "core", cx: hubPos.x, cy: hubPos.y, r: hubR, fill: "var(--bg)", stroke: col }));
    hubGroup.appendChild(el("circle", { cx: hubPos.x, cy: hubPos.y, r: 3.2, fill: col }));
    var lblPos = polar(CX, CY, HUB_R + hubR + 22, angle);
    var hubLbl = el("text", { class: "lbl-hub", x: lblPos.x, y: lblPos.y, "font-size": 11.5, fill: col, "text-anchor": anchorFor(lblPos.x) });
    hubLbl.textContent = s.code;
    svg.appendChild(hubGroup);
    svg.appendChild(hubLbl);
    hubEls[s.code] = [hubGroup, hubLbl, spoke];

    var fan = Math.min(15, (360 / N) * 0.62);
    s.items.forEach(function (item, j) {
      var leafAngle = angle - fan / 2 + (fan / (s.items.length - 1 || 1)) * j;
      if (s.items.length === 1) leafAngle = angle;
      var leafPos = polar(CX, CY, LEAF_R, leafAngle);
      var branch = el("path", {
        class: "branch", "data-pod": s.code, stroke: colorFaint(i),
        d: "M " + hubPos.x.toFixed(1) + " " + hubPos.y.toFixed(1) + " L " + leafPos.x.toFixed(1) + " " + leafPos.y.toFixed(1),
      });
      svg.appendChild(branch);

      var leafGroup = el("g", {
        class: "node-leaf hoverable", "data-pod": s.code, "data-kind": "leaf", "data-idx": j,
        tabindex: "0", role: "button",
        "aria-label": item.l + ", linked item in the " + s.name + " section. Activate to open."
      });
      leafGroup.appendChild(el("circle", { cx: leafPos.x, cy: leafPos.y, r: 6, fill: "var(--bg)", stroke: col }));
      svg.appendChild(leafGroup);

      var lp = polar(CX, CY, LEAF_R + 14, leafAngle);
      var leafLbl = el("text", { class: "lbl-leaf", x: lp.x, y: lp.y, "font-size": 8.2, fill: "var(--muted-2)", "text-anchor": anchorFor(lp.x) });
      leafLbl.textContent = item.l.length > 24 ? item.l.slice(0, 22) + "…" : item.l;
      svg.appendChild(leafLbl);

      leafEls.push({ pod: s.code, group: leafGroup, item: item, section: s });
    });
  });

  svg.appendChild(el("circle", { class: "center-ring", cx: CX, cy: CY, r: 64 }));
  svg.appendChild(el("circle", { class: "center-core", cx: CX, cy: CY, r: CENTER_R }));
  var centerLbl = el("text", { class: "center-lbl", x: CX, y: CY - 2, "text-anchor": "middle", "font-size": 13 });
  centerLbl.textContent = "SUITE";
  svg.appendChild(centerLbl);
  var centerSub = el("text", { class: "center-sub", x: CX, y: CY + 14, "text-anchor": "middle", "font-size": 8.5 });
  centerSub.textContent = "SUITE / MCP v0.10.0";
  svg.appendChild(centerSub);

  var dossier = document.getElementById("sconst-dossier");
  var dKind = document.getElementById("sconst-dKind"), dTitle = document.getElementById("sconst-dTitle"),
    dDesc = document.getElementById("sconst-dDesc"), dMeta = document.getElementById("sconst-dMeta"), dLink = document.getElementById("sconst-dLink");

  function showDossierForSection(s) {
    dKind.textContent = "Section";
    dTitle.textContent = s.name;
    dDesc.textContent = s.desc;
    dMeta.innerHTML = "";
    var c1 = document.createElement("span"); c1.textContent = s.count + (s.code === "MCP" ? " tools" : s.code === "AUDIT SPINE" ? " producers" : s.code === "CERTIFIED" ? " badge issued" : " total"); dMeta.appendChild(c1);
    dLink.textContent = "Open " + s.href + " →";
    dLink.href = s.href;
    dLink.target = "";
    dossier.classList.add("show");
  }
  function showDossierForItem(item, s) {
    dKind.textContent = "In " + s.name;
    dTitle.textContent = item.l;
    dDesc.textContent = "One real, linked item in the " + s.name + " section.";
    dMeta.innerHTML = "";
    var c1 = document.createElement("span"); c1.textContent = s.code; dMeta.appendChild(c1);
    dLink.textContent = "Open →";
    dLink.href = item.u;
    dLink.target = item.u.indexOf("http") === 0 ? "_blank" : "";
    dossier.classList.add("show");
  }
  document.getElementById("sconst-dossierClose").addEventListener("click", function () { dossier.classList.remove("show"); });

  function applyFilter(code) {
    activeCode = code;
    svg.querySelectorAll("[data-pod]").forEach(function (node) {
      if (!code || node.getAttribute("data-pod") === code) node.classList.remove("dim");
      else node.classList.add("dim");
    });
    document.querySelectorAll(".sconst-pill[data-pod]").forEach(function (pill, idx) {
      var isActive = pill.getAttribute("data-pod") === code;
      pill.classList.toggle("active", isActive);
      if (isActive) { pill.style.background = colorFor(SECTIONS.findIndex(function (s) { return s.code === code; })); pill.style.color = "var(--bg)"; }
      else if (!pill.classList.contains("active")) { pill.style.background = ""; pill.style.color = ""; }
    });
    var resetPill = document.querySelector(".sconst-pill.reset");
    if (resetPill) resetPill.classList.toggle("active", !code);
  }

  SECTIONS.forEach(function (s) {
    var g = hubEls[s.code][0];
    g.addEventListener("mouseenter", function () { if (!activeCode) applyFilter(s.code); showDossierForSection(s); });
    g.addEventListener("mouseleave", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("focus", function () { if (!activeCode) applyFilter(s.code); showDossierForSection(s); });
    g.addEventListener("blur", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("click", function () { applyFilter(activeCode === s.code ? null : s.code); showDossierForSection(s); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        applyFilter(activeCode === s.code ? null : s.code); showDossierForSection(s);
      }
    });
  });
  leafEls.forEach(function (leaf) {
    leaf.group.addEventListener("mouseenter", function () { showDossierForItem(leaf.item, leaf.section); });
    leaf.group.addEventListener("focus", function () { showDossierForItem(leaf.item, leaf.section); });
    leaf.group.addEventListener("click", function (e) { e.stopPropagation(); showDossierForItem(leaf.item, leaf.section); });
    leaf.group.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); showDossierForItem(leaf.item, leaf.section); }
    });
  });
  svg.addEventListener("click", function (e) { if (e.target === svg) applyFilter(null); });

  var pillbar = document.getElementById("sconst-pillbar");
  var resetPill = document.createElement("span");
  resetPill.className = "sconst-pill reset active";
  resetPill.textContent = "SHOW ALL " + N;
  resetPill.addEventListener("click", function () { applyFilter(null); dossier.classList.remove("show"); });
  pillbar.appendChild(resetPill);

  SECTIONS.forEach(function (s, i) {
    var pill = document.createElement("span");
    pill.className = "sconst-pill";
    pill.setAttribute("data-pod", s.code);
    pill.style.borderColor = colorFaint(i);
    pill.textContent = s.code + " · " + s.count;
    pill.addEventListener("mouseenter", function () { if (activeCode !== s.code) { pill.style.background = colorFor(i); pill.style.color = "var(--bg)"; } });
    pill.addEventListener("mouseleave", function () { if (activeCode !== s.code) { pill.style.background = ""; pill.style.color = ""; } });
    pill.addEventListener("click", function () { applyFilter(activeCode === s.code ? null : s.code); showDossierForSection(s); });
    pillbar.appendChild(pill);
  });

  var statsEl = document.getElementById("sconst-stats");
  [
    [12, "governance specs"],
    [TOTAL, "classified items"],
    [75, "mcp tools (v0.10.0)"],
    [2, "verified distribution channels"],
  ].forEach(function (pair) {
    var s = document.createElement("div");
    s.className = "s";
    var b = document.createElement("b"); b.textContent = pair[0];
    var span = document.createElement("span"); span.textContent = pair[1];
    s.appendChild(b); s.appendChild(span);
    statsEl.appendChild(s);
  });
})();
