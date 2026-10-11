/* MCP tool surface, visualized. Same radial hub/leaf engine PATTERN as the
   homepage's suite-constellation.js and /specs/'s specs-constellation.js
   (polar layout, hub/leaf/glow/sweep mechanics, dossier panel, filter
   pills) -- adapted, not cloned, because this page's real data shape is
   different. specs-constellation.js groups several specs under one
   vertical hub (vertical -> specs). Here every hub IS one spec (or the
   DefenseTech extension) in its own right, sized by that spec's real MCP
   tool count, with real tool code names as leaves -- there is no
   "vertical" grouping level to reuse, so the hub loop is one level
   shallower than the specs-page version.

   ADDITIVE: sits above the existing spec-grid / ext-card on this page,
   which stay the default, untouched, zero-click reference surface -- this
   is a second, exploratory way to reach the same real data, not a
   replacement. Every hub label, tool count, description string and tool
   code name below is copied verbatim from the spec-grid/ext-card markup
   already in mcp/index.html; nothing here is invented. "Example tools"
   in the dossier intentionally shows only the 2 (4 for DefenseTech) real
   code names already printed on the card -- the full per-spec tool lists
   aren't published anywhere on this page, so this file doesn't guess at
   the rest.

   Registry-status (2-row table) and the implementation-preview 4-layer
   stack (4-card grid) were deliberately left alone -- see the "what did
   NOT get the treatment" note in the session report. Both are already
   fully scannable at their real size; a radial diagram would add
   interaction cost without adding legibility for 4 items.

   Accessibility (hard requirement, not decoration): every interactive hub
   and leaf carries a real tabindex="0", role="button" and a descriptive
   aria-label; Enter/Space fire the same handler as a click; keyboard focus
   mirrors mouse hover for the dossier preview; every tool count rendered
   is real visible SVG text next to the node, never size- or color-only;
   all animation is wrapped in prefers-reduced-motion (see the page's
   <style> block for the actual @media rule). */
(function () {
  "use strict";

  var CAT_LABELS = {
    core: "CORE",
    edtech: "EDTECH",
    healthtech: "HEALTHTECH",
    cross: "CROSS-CUTTING",
    insurtech: "INSURTECH",
    defensetech: "DEFENSETECH"
  };

  // Every field below is copied verbatim from the spec-grid / ext-card
  // markup in mcp/index.html (tool counts, descriptions, and the 2-4
  // example tool code names already printed on each card).
  var HUBS = [
    { code: "aeo", cat: "core", badge: "Spec 01", label: "AEO Protocol", tools: 4,
      desc: "Entity declaration at /.well-known/aeo.json. Fetch, inspect, extract a claim, compute the well-known URL.",
      codes: ["aeo_fetch", "aeo_inspect"] },
    { code: "provenance", cat: "core", badge: "Spec 02", label: "Prompt Provenance", tools: 3,
      desc: "Validate Prompt Provenance documents against the v0.1 schema. Inspect, evaluate result.",
      codes: ["prompt_provenance_validate", "prompt_provenance_eval_result"] },
    { code: "agent-cards", cat: "core", badge: "Spec 03", label: "Agent Cards", tools: 4,
      desc: "Inspect or validate Agent Cards. Probe the tool disclosure surface. Resolve well-known URL.",
      codes: ["agent_card_validate", "agent_card_tool_disclosure"] },
    { code: "evidence", cat: "core", badge: "Spec 04", label: "AI Evidence Format", tools: 3,
      desc: "Validate, inspect, and verify the content hash of an AI Evidence object.",
      codes: ["ai_evidence_validate", "ai_evidence_verify_hash"] },
    { code: "tool-cards", cat: "core", badge: "Spec 05", label: "MCP Tool Cards", tools: 4,
      desc: "Inspect or validate MCP Tool Cards. Check tested-with declarations. Resolve well-known URL.",
      codes: ["tool_card_validate", "tool_card_tested_with"] },
    { code: "tutor-cards", cat: "edtech", badge: "Spec 06 · EdTech", label: "AI Tutor Cards", tools: 6,
      desc: "Fetch, inspect, validate, check COPPA applicability, check subject coverage, well-known.",
      codes: ["tutor_card_coppa_check", "tutor_card_subject_check"] },
    { code: "student-disclosure", cat: "edtech", badge: "Spec 07 · EdTech", label: "Student AI Disclosure", tools: 5,
      desc: "Validate, inspect, check against AUP, verify prompt hash, verify artifact hash.",
      codes: ["disclosure_aup_check", "disclosure_verify_prompt_hash"] },
    { code: "classroom-aup", cat: "edtech", badge: "Spec 08 · EdTech", label: "Classroom AI AUP", tools: 5,
      desc: "Fetch, inspect, validate, check compliance against a student disclosure, well-known URL.",
      codes: ["aup_check_compliance", "aup_validate"] },
    { code: "clinical-ai", cat: "healthtech", badge: "Spec 09 · HealthTech", label: "Clinical AI Disclosure", tools: 4,
      desc: "Fetch, inspect, validate, well-known. Clinical-AI vocabulary aligned with FDA SaMD + IMDRF.",
      codes: ["clinical_ai_validate", "clinical_ai_inspect"] },
    { code: "incident-card", cat: "cross", badge: "Spec 10 · Cross-cutting", label: "AI Incident Card", tools: 5,
      desc: "Fetch, inspect, validate, index, well-known.",
      codes: ["incident_validate", "incident_inspect"] },
    { code: "procurement-decision", cat: "cross", badge: "Spec 11 · Cross-cutting", label: "AI Procurement Decision Card", tools: 4,
      desc: "Fetch, inspect, validate, well-known.",
      codes: ["decision_card_validate", "decision_card_inspect"] },
    { code: "claims-card", cat: "insurtech", badge: "Spec 12 · InsurTech", label: "AI Claims Decision Card", tools: 4,
      desc: "Validate and inspect an insurer/adjudicator claims record. Sign the canonical hash, chain a new card to its predecessor.",
      codes: ["claims_card_validate", "claims_card_sign"] },
    { code: "defensetech", cat: "defensetech", badge: "Vertical extension", label: "DefenseTech 8-pack", tools: 8,
      desc: "Beyond the 12 horizontal specs, the DefenseTech 8-pack adds a vertical-specific tool family: 3-axis vault contract resolver (CUI tier × export-control × foreign-person), CUI distribution-statement invariant (DoDI 5230.24), ITAR us-person check (22 CFR 120.62 + deemed-export rule), DFARS 72-hour wall-clock, CMMC evidence-bundle summarizer, Incident Card event-type classifier, cross-binding consistency check.",
      codes: ["defensetech_vault_resolve_3axis", "defensetech_audit_event_check_invariants", "defensetech_check_dfars_72h_clock", "defensetech_summarize_cmmc_evidence_bundle"] }
  ];

  var svg = document.getElementById("mcpc-graph");
  if (!svg) return;

  var N = HUBS.length;
  var CX = 500, CY = 500;
  var HUB_R = 230, LEAF_R = 340, ARC_R = 420, CENTER_R = 46;

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

  var activeCat = null;
  var hubEls = {}, leafEls = [];

  HUBS.forEach(function (h, i) {
    var angle = (360 / N) * i;
    var hubPos = polar(CX, CY, HUB_R, angle);
    var col = colorFor(i);

    var arcSpan = (360 / N) * 0.74;
    var a0 = angle - arcSpan / 2, a1 = angle + arcSpan / 2;
    var p0 = polar(CX, CY, ARC_R, a0), p1 = polar(CX, CY, ARC_R, a1);
    var arcPath = "M " + p0.x.toFixed(1) + " " + p0.y.toFixed(1) +
      " A " + ARC_R + " " + ARC_R + " 0 0 1 " + p1.x.toFixed(1) + " " + p1.y.toFixed(1);
    svg.appendChild(el("path", { class: "arc", d: arcPath, stroke: col, "data-cat": h.cat }));

    var spokeStart = polar(CX, CY, CENTER_R, angle);
    var spoke = el("line", { class: "spoke", x1: spokeStart.x, y1: spokeStart.y, x2: hubPos.x, y2: hubPos.y, stroke: col, "data-cat": h.cat, "data-hub": h.code });
    svg.appendChild(spoke);

    // Hub radius scales with the spec's REAL tool count -- this is the
    // "12-specs-to-tool-counts relationship" the task called out as the
    // natural candidate for a diagram; size here is a direct, unfabricated
    // encoding of the number already printed on the card. The same number
    // is also rendered as literal text in the hub label two lines down,
    // so the fact never depends on size/color alone (accessibility rule).
    var hubR = 11 + Math.min(14, h.tools * 1.7);
    var hubGroup = el("g", {
      class: "node-hub hoverable", "data-cat": h.cat, "data-hub": h.code, "data-kind": "hub",
      tabindex: "0", role: "button",
      "aria-label": h.label + ", " + h.badge + ", " + h.tools + " MCP tools. Activate to see details and example tool names."
    });
    hubGroup.appendChild(el("circle", { class: "ring", cx: hubPos.x, cy: hubPos.y, r: hubR + 6, stroke: colorFaint(i) }));
    hubGroup.appendChild(el("circle", { class: "core", cx: hubPos.x, cy: hubPos.y, r: hubR, fill: "var(--slate-900)", stroke: col }));
    hubGroup.appendChild(el("circle", { cx: hubPos.x, cy: hubPos.y, r: 3.2, fill: col }));
    var lblPos = polar(CX, CY, HUB_R + hubR + 24, angle);
    var hubLbl = el("text", { class: "lbl-hub", x: lblPos.x, y: lblPos.y, "font-size": 10, fill: col, "text-anchor": anchorFor(lblPos.x) });
    hubLbl.textContent = truncate(h.label.toUpperCase(), 24) + " · " + h.tools;
    svg.appendChild(hubGroup);
    svg.appendChild(hubLbl);
    hubEls[h.code] = { group: hubGroup, lbl: hubLbl, spoke: spoke, hub: h };

    var fan = Math.min((360 / N) * 0.85, (h.codes.length - 1) * 13);
    h.codes.forEach(function (code, j) {
      var leafAngle = angle - fan / 2 + (fan / (h.codes.length - 1 || 1)) * j;
      if (h.codes.length === 1) leafAngle = angle;
      var leafPos = polar(CX, CY, LEAF_R, leafAngle);
      var branch = el("path", {
        class: "branch", "data-cat": h.cat, "data-hub": h.code, stroke: colorFaint(i),
        d: "M " + hubPos.x.toFixed(1) + " " + hubPos.y.toFixed(1) + " L " + leafPos.x.toFixed(1) + " " + leafPos.y.toFixed(1)
      });
      svg.appendChild(branch);

      var leafGroup = el("g", {
        class: "node-leaf hoverable", "data-cat": h.cat, "data-hub": h.code, "data-kind": "leaf",
        tabindex: "0", role: "button",
        "aria-label": "Tool " + code + ", part of the " + h.label + " family, " + h.tools + " tools total. Activate to see details."
      });
      leafGroup.appendChild(el("circle", { cx: leafPos.x, cy: leafPos.y, r: 5.5, fill: "var(--slate-900)", stroke: col }));
      leafGroup.appendChild(el("circle", { class: "beacon", cx: leafPos.x, cy: leafPos.y, r: 2, fill: col }));
      svg.appendChild(leafGroup);

      var lp = polar(CX, CY, LEAF_R + 13, leafAngle);
      var leafLbl = el("text", { class: "lbl-leaf", x: lp.x, y: lp.y, "font-size": 7.2, fill: "var(--slate-400)", "text-anchor": anchorFor(lp.x) });
      leafLbl.textContent = truncate(code, 20);
      svg.appendChild(leafLbl);

      leafEls.push({ hub: h, group: leafGroup, code: code });
    });
  });

  svg.appendChild(el("circle", { class: "center-ring", cx: CX, cy: CY, r: 64 }));
  svg.appendChild(el("circle", { class: "center-core", cx: CX, cy: CY, r: CENTER_R }));
  var centerLbl = el("text", { class: "center-lbl", x: CX, y: CY - 4, "text-anchor": "middle", "font-size": 12 });
  centerLbl.textContent = "MCP SERVER";
  svg.appendChild(centerLbl);
  var centerSub1 = el("text", { class: "center-sub", x: CX, y: CY + 12, "text-anchor": "middle", "font-size": 8 });
  centerSub1.textContent = "12 SPECS";
  svg.appendChild(centerSub1);
  var centerSub2 = el("text", { class: "center-sub", x: CX, y: CY + 24, "text-anchor": "middle", "font-size": 8 });
  centerSub2.textContent = "+ DEFENSETECH EXT.";
  svg.appendChild(centerSub2);

  var dossier = document.getElementById("mcpc-dossier");
  var dKind = document.getElementById("mcpc-dKind"), dTitle = document.getElementById("mcpc-dTitle"),
    dDesc = document.getElementById("mcpc-dDesc"), dFields = document.getElementById("mcpc-dFields"),
    dLink = document.getElementById("mcpc-dLink");

  function showDossierForHub(h) {
    dKind.textContent = h.badge;
    dTitle.textContent = h.label;
    dDesc.textContent = h.desc;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>MCP tools</span><strong>" + h.tools + "</strong>";
    dFields.appendChild(f1);
    var f2 = document.createElement("div"); f2.className = "field";
    var codesHtml = h.codes.map(function (c) { return "<code>" + c + "</code>"; }).join("");
    f2.innerHTML = "<span>Example tools</span><span class=\"codes\">" + codesHtml + "</span>";
    dFields.appendChild(f2);
    dLink.textContent = "Jump to card ↓";
    dLink.href = "#" + h.code;
    dossier.classList.add("show");
  }
  function showDossierForLeaf(h, code) {
    dKind.textContent = h.badge + " · tool";
    dTitle.textContent = code;
    dDesc.textContent = "One of " + h.tools + " real tools in the " + h.label + " family: " + h.desc;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>Parent spec</span><strong>" + h.label + "</strong>";
    dFields.appendChild(f1);
    dLink.textContent = "Jump to card ↓";
    dLink.href = "#" + h.code;
    dossier.classList.add("show");
  }
  document.getElementById("mcpc-dossierClose").addEventListener("click", function () { dossier.classList.remove("show"); });

  function applyFilter(cat) {
    activeCat = cat;
    svg.querySelectorAll("[data-cat]").forEach(function (node) {
      if (!cat || node.getAttribute("data-cat") === cat) node.classList.remove("dim");
      else node.classList.add("dim");
    });
    document.querySelectorAll(".mcpc-pill[data-cat]").forEach(function (pill) {
      var isActive = pill.getAttribute("data-cat") === cat;
      pill.classList.toggle("active", isActive);
      if (isActive) { pill.style.background = pill.getAttribute("data-color"); pill.style.color = "var(--slate-900)"; }
      else { pill.style.background = ""; pill.style.color = ""; }
    });
    var resetPill = document.querySelector(".mcpc-pill.reset");
    if (resetPill) resetPill.classList.toggle("active", !cat);
  }

  Object.keys(hubEls).forEach(function (code) {
    var rec = hubEls[code], h = rec.hub, g = rec.group;
    g.addEventListener("mouseenter", function () { if (!activeCat) applyFilter(h.cat); showDossierForHub(h); });
    g.addEventListener("mouseleave", function () { if (!activeCat) applyFilter(null); });
    g.addEventListener("focus", function () { if (!activeCat) applyFilter(h.cat); showDossierForHub(h); });
    g.addEventListener("blur", function () { if (!activeCat) applyFilter(null); });
    g.addEventListener("click", function () { applyFilter(activeCat === h.cat ? null : h.cat); showDossierForHub(h); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        applyFilter(activeCat === h.cat ? null : h.cat);
        showDossierForHub(h);
      }
    });
  });

  leafEls.forEach(function (leaf) {
    function activate(e) { if (e) e.stopPropagation(); showDossierForLeaf(leaf.hub, leaf.code); }
    leaf.group.addEventListener("mouseenter", function () { showDossierForLeaf(leaf.hub, leaf.code); });
    leaf.group.addEventListener("focus", function () { showDossierForLeaf(leaf.hub, leaf.code); });
    leaf.group.addEventListener("click", activate);
    leaf.group.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); activate(e); }
    });
  });

  svg.addEventListener("click", function (e) { if (e.target === svg) applyFilter(null); });

  var pillbar = document.getElementById("mcpc-pillbar");
  var resetPill = document.createElement("button");
  resetPill.type = "button";
  resetPill.className = "mcpc-pill reset active";
  resetPill.textContent = "ALL " + N;
  resetPill.addEventListener("click", function () { applyFilter(null); dossier.classList.remove("show"); });
  pillbar.appendChild(resetPill);

  // Category pill counts are computed from HUBS. Recheck HUBS against the
  // published inventory on each release.
  var catOrder = [], catCount = {}, catColorIdx = {};
  HUBS.forEach(function (h, i) {
    if (!(h.cat in catCount)) { catOrder.push(h.cat); catCount[h.cat] = 0; catColorIdx[h.cat] = i; }
    catCount[h.cat]++;
  });
  catOrder.forEach(function (cat) {
    var pill = document.createElement("button");
    pill.type = "button";
    pill.className = "mcpc-pill";
    pill.setAttribute("data-cat", cat);
    var col = colorFor(catColorIdx[cat]);
    pill.setAttribute("data-color", col);
    pill.style.borderColor = colorFaint(catColorIdx[cat]);
    pill.textContent = CAT_LABELS[cat] + " · " + catCount[cat];
    pill.addEventListener("mouseenter", function () { if (activeCat !== cat) { pill.style.background = col; pill.style.color = "var(--slate-900)"; } });
    pill.addEventListener("mouseleave", function () { if (activeCat !== cat) { pill.style.background = ""; pill.style.color = ""; } });
    pill.addEventListener("click", function () { applyFilter(activeCat === cat ? null : cat); dossier.classList.remove("show"); });
    pillbar.appendChild(pill);
  });
})();
