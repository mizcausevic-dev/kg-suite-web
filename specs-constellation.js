/* Specs, visualized. Same radial engine as the homepage's suite-constellation.js
   (identical polar math, identical hub/leaf/glow/sweep mechanics), adapted for
   this page's real job. Two differences from the homepage version, both
   deliberate, not oversights:
   1. This is ADDITIVE, above the existing filter/table, which stays the
      default, untouched, zero-click reference surface. The map is a second,
      exploratory way to reach the same real data, not a replacement.
   2. The dossier panel is docked and sized to real content (a full technical
      description + two code fields + real linked consumer repos where they
      exist) instead of the homepage's compact floating box, which would
      truncate that content.
   Filter state is shared with the existing table: clicking a hub or the
   existing .spec-filter-chip buttons drives both views from one state. */
(function () {
  "use strict";

  var HUBS = [
    { code: "core", label: "CORE", href: "/specs/#specs",
      items: [
        { l: "AEO Protocol", u: "https://github.com/mizcausevic-dev/aeo-protocol-spec", desc: "Entity declaration · authoritative claims · citation preferences", detect: "aeo_version", path: "/.well-known/aeo.json" },
        { l: "Prompt Provenance", u: "https://github.com/mizcausevic-dev/prompt-provenance-spec", desc: "Versioned, lineaged, reviewable LLM prompt records", detect: "provenance_version", path: null },
        { l: "Agent Cards", u: "https://github.com/mizcausevic-dev/agent-cards-spec", desc: "Declarative agent capability + refusal disclosure", detect: "agent_card_version", path: "/.well-known/agents/<id>.json" },
        { l: "AI Evidence Format", u: "https://github.com/mizcausevic-dev/ai-evidence-format-spec", desc: "Structured citations for LLM-generated claims", detect: "evidence_version", path: null },
        { l: "MCP Tool Cards", u: "https://github.com/mizcausevic-dev/mcp-tool-card-spec", desc: "Per-tool disclosure for MCP servers", detect: "tool_card_version", path: "/.well-known/mcp-tools/<name>.json" },
      ] },
    { code: "edtech", label: "EDTECH", href: "/specs/#specs",
      items: [
        { l: "AI Tutor Cards", u: "https://github.com/mizcausevic-dev/ai-tutor-card-spec", desc: "EdTech vendor-side · pedagogy · FERPA/COPPA/GDPR posture", detect: "tutor_card_version", path: "/.well-known/tutors/<id>.json" },
        { l: "Student AI Disclosure", u: "https://github.com/mizcausevic-dev/student-ai-disclosure-spec", desc: "Student-side · roles · prompt evidence · artifact-hash binding", detect: "disclosure_version", path: null },
        { l: "Classroom AI AUP", u: "https://github.com/mizcausevic-dev/classroom-ai-aup-spec", desc: "District / school / course AI policy", detect: "aup_version", path: "/.well-known/ai-aup.json" },
      ] },
    { code: "healthtech", label: "HEALTHTECH", href: "/specs/#specs",
      items: [
        { l: "Clinical AI Disclosure", u: "https://github.com/mizcausevic-dev/clinical-ai-disclosure-spec", desc: "HIPAA / FDA / SaMD posture · bias audits · EHR integration", detect: "clinical_ai_card_version", path: "/.well-known/clinical-ai/<id>.json" },
      ] },
    { code: "cross-vendor", label: "CROSS · VENDOR", href: "/specs/#specs",
      items: [
        { l: "AI Incident Card", u: "https://github.com/mizcausevic-dev/ai-incident-card-spec", desc: "“CVE for AI agents” · references every other affected document", detect: "incident_card_version", path: "/.well-known/ai-incidents/<id>.json" },
      ] },
    { code: "cross-buyer", label: "CROSS · BUYER", href: "/specs/#specs",
      items: [
        { l: "AI Procurement Decision Card", u: "https://github.com/mizcausevic-dev/ai-procurement-decision-spec", desc: "Buyer's procurement review outcome · documents reviewed · conditions · rationale. v0.2 added data_vault_targets[] (field-level vault contract). v0.3 added retention_envelope[] (per-field TTL + signed deletion-proof).", detect: "decision_card_version", path: "/.well-known/decisions/<id>.json",
          consumers: [
            { l: "rag-sentinel", u: "https://github.com/mizcausevic-dev/rag-sentinel" },
            { l: "deal-desk-workspace", u: "https://github.com/mizcausevic-dev/deal-desk-workspace" },
            { l: "kg-skyyflow-klaviyo-bridge", u: "https://github.com/mizcausevic-dev/kg-skyyflow-klaviyo-bridge" },
            { l: "bridge console", u: "https://github.com/mizcausevic-dev/skyyflow-klaviyo-bridge-console" },
          ] },
      ] },
    { code: "insurtech", label: "INSURTECH", href: "/specs/#specs",
      items: [
        { l: "AI Claims Decision Card", u: "https://github.com/mizcausevic-dev/ai-claims-decision-card-spec", desc: "Insurer/adjudicator record that an AI system decided an insurance claim · outcome · underwriting rules applied · content-hashed evidence bundle · human-in-loop · ed25519-signed, hash-chained", detect: "claims_card_version", path: null },
      ] },
  ];

  var svg = document.getElementById("specsc-graph");
  if (!svg) return;

  var N = HUBS.length;
  var CX = 500, CY = 500;
  var HUB_R = 220, LEAF_R = 350, ARC_R = 430, CENTER_R = 44;

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

  HUBS.forEach(function (h, i) {
    var angle = (360 / N) * i;
    var hubPos = polar(CX, CY, HUB_R, angle);
    var col = colorFor(i);

    var arcSpan = (360 / N) * 0.72;
    var a0 = angle - arcSpan / 2, a1 = angle + arcSpan / 2;
    var p0 = polar(CX, CY, ARC_R, a0), p1 = polar(CX, CY, ARC_R, a1);
    var largeArc = arcSpan > 180 ? 1 : 0;
    var arcPath = "M " + p0.x.toFixed(1) + " " + p0.y.toFixed(1) +
      " A " + ARC_R + " " + ARC_R + " 0 " + largeArc + " 1 " + p1.x.toFixed(1) + " " + p1.y.toFixed(1);
    svg.appendChild(el("path", { class: "arc", d: arcPath, stroke: col, "data-pod": h.code }));

    var spokeStart = polar(CX, CY, CENTER_R, angle);
    var spoke = el("line", { class: "spoke", x1: spokeStart.x, y1: spokeStart.y, x2: hubPos.x, y2: hubPos.y, stroke: col, "data-pod": h.code });
    svg.appendChild(spoke);

    var hubR = 13 + Math.min(12, h.items.length * 2.2);
    var hubGroup = el("g", {
      class: "node-hub hoverable", "data-pod": h.code, "data-kind": "hub",
      tabindex: "0", role: "button",
      "aria-label": h.label + ", " + h.items.length + (h.items.length === 1 ? " spec" : " specs") + ". Activate to see details and browse the specs."
    });
    hubGroup.appendChild(el("circle", { class: "ring", cx: hubPos.x, cy: hubPos.y, r: hubR + 6, stroke: colorFaint(i) }));
    hubGroup.appendChild(el("circle", { class: "core", cx: hubPos.x, cy: hubPos.y, r: hubR, fill: "var(--bg)", stroke: col }));
    hubGroup.appendChild(el("circle", { cx: hubPos.x, cy: hubPos.y, r: 3.2, fill: col }));
    var lblPos = polar(CX, CY, HUB_R + hubR + 22, angle);
    var hubLbl = el("text", { class: "lbl-hub", x: lblPos.x, y: lblPos.y, "font-size": 10.5, fill: col, "text-anchor": anchorFor(lblPos.x) });
    hubLbl.textContent = h.label;
    svg.appendChild(hubGroup);
    svg.appendChild(hubLbl);
    hubEls[h.code] = [hubGroup, hubLbl, spoke];

    var fan = Math.min((360 / N) * 0.8, (h.items.length - 1) * 12);
    h.items.forEach(function (item, j) {
      var leafAngle = angle - fan / 2 + (fan / (h.items.length - 1 || 1)) * j;
      if (h.items.length === 1) leafAngle = angle;
      var leafPos = polar(CX, CY, LEAF_R, leafAngle);
      var branch = el("path", {
        class: "branch", "data-pod": h.code, stroke: colorFaint(i),
        d: "M " + hubPos.x.toFixed(1) + " " + hubPos.y.toFixed(1) + " L " + leafPos.x.toFixed(1) + " " + leafPos.y.toFixed(1),
      });
      svg.appendChild(branch);

      var leafGroup = el("g", {
        class: "node-leaf hoverable", "data-pod": h.code, "data-kind": "leaf", "data-idx": j,
        tabindex: "0", role: "button",
        "aria-label": item.l + ", spec in the " + h.label + " vertical. Activate to see details."
      });
      leafGroup.appendChild(el("circle", { cx: leafPos.x, cy: leafPos.y, r: 6, fill: "var(--bg)", stroke: col }));
      if (item.path) {
        leafGroup.appendChild(el("circle", { class: "beacon", cx: leafPos.x, cy: leafPos.y, r: 2, fill: col }));
      }
      svg.appendChild(leafGroup);

      var lp = polar(CX, CY, LEAF_R + 14, leafAngle);
      var leafLbl = el("text", { class: "lbl-leaf", x: lp.x, y: lp.y, "font-size": 7.8, fill: "var(--muted-2)", "text-anchor": anchorFor(lp.x) });
      leafLbl.textContent = item.l.length > 22 ? item.l.slice(0, 20) + "…" : item.l;
      svg.appendChild(leafLbl);

      leafEls.push({ pod: h.code, group: leafGroup, item: item, hub: h });
    });
  });

  svg.appendChild(el("circle", { class: "center-ring", cx: CX, cy: CY, r: 62 }));
  svg.appendChild(el("circle", { class: "center-core", cx: CX, cy: CY, r: CENTER_R }));
  var centerLbl = el("text", { class: "center-lbl", x: CX, y: CY - 2, "text-anchor": "middle", "font-size": 12 });
  centerLbl.textContent = "SPECS";
  svg.appendChild(centerLbl);
  var centerSub = el("text", { class: "center-sub", x: CX, y: CY + 14, "text-anchor": "middle", "font-size": 8 });
  centerSub.textContent = "12 GOVERNANCE SPECS";
  svg.appendChild(centerSub);

  var dossier = document.getElementById("specsc-dossier");
  var dKind = document.getElementById("specsc-dKind"), dTitle = document.getElementById("specsc-dTitle"),
    dDesc = document.getElementById("specsc-dDesc"), dFields = document.getElementById("specsc-dFields"),
    dConsumers = document.getElementById("specsc-dConsumers"), dLink = document.getElementById("specsc-dLink");

  function showDossierForHub(h) {
    dKind.textContent = "Vertical · " + h.items.length + (h.items.length === 1 ? " spec" : " specs");
    dTitle.textContent = h.label;
    dDesc.textContent = h.items.map(function (it) { return it.l; }).join(" · ");
    dFields.innerHTML = "";
    dConsumers.innerHTML = "";
    dConsumers.hidden = true;
    dLink.textContent = "Filter the table →";
    dLink.href = h.href;
    dLink.target = "";
    dossier.classList.add("show");
  }
  function showDossierForItem(item) {
    dKind.textContent = "Spec";
    dTitle.textContent = item.l;
    dDesc.textContent = item.desc;
    dFields.innerHTML = "";
    var f1 = document.createElement("div"); f1.className = "field";
    f1.innerHTML = "<span>Detect via</span><code>" + item.detect + "</code>";
    dFields.appendChild(f1);
    var f2 = document.createElement("div"); f2.className = "field";
    f2.innerHTML = "<span>Well-known path</span><code>" + (item.path ? item.path.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "—") + "</code>";
    dFields.appendChild(f2);
    dConsumers.innerHTML = "";
    if (item.consumers && item.consumers.length) {
      dConsumers.hidden = false;
      var label = document.createElement("div"); label.className = "consumers-label"; label.textContent = "Consumed by";
      dConsumers.appendChild(label);
      item.consumers.forEach(function (c) {
        var a = document.createElement("a");
        a.href = c.u; a.textContent = c.l; a.target = "_blank"; a.rel = "noreferrer";
        dConsumers.appendChild(a);
      });
    } else {
      dConsumers.hidden = true;
    }
    dLink.textContent = "Open repo →";
    dLink.href = item.u;
    dLink.target = "_blank";
    dossier.classList.add("show");
  }
  document.getElementById("specsc-dossierClose").addEventListener("click", function () { dossier.classList.remove("show"); });

  function applyFilter(code, fromChip) {
    activeCode = code;
    svg.querySelectorAll("[data-pod]").forEach(function (node) {
      if (!code || node.getAttribute("data-pod") === code) node.classList.remove("dim");
      else node.classList.add("dim");
    });
    document.querySelectorAll(".specsc-pill[data-pod]").forEach(function (pill) {
      var isActive = pill.getAttribute("data-pod") === code;
      pill.classList.toggle("active", isActive);
      if (isActive) { pill.style.background = colorFor(HUBS.findIndex(function (h) { return h.code === code; })); pill.style.color = "var(--bg)"; }
      else { pill.style.background = ""; pill.style.color = ""; }
    });
    var resetPill = document.querySelector(".specsc-pill.reset");
    if (resetPill) resetPill.classList.toggle("active", !code);
    if (!fromChip) {
      var chip = document.querySelector('.spec-filter-chip[data-filter="' + (code || "all") + '"]');
      if (chip && chip.getAttribute("aria-pressed") !== "true") chip.click();
    }
  }

  HUBS.forEach(function (h) {
    var g = hubEls[h.code][0];
    g.addEventListener("mouseenter", function () { if (!activeCode) applyFilter(h.code); showDossierForHub(h); });
    g.addEventListener("mouseleave", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("focus", function () { if (!activeCode) applyFilter(h.code); showDossierForHub(h); });
    g.addEventListener("blur", function () { if (!activeCode) applyFilter(null); });
    g.addEventListener("click", function () { applyFilter(activeCode === h.code ? null : h.code); showDossierForHub(h); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        applyFilter(activeCode === h.code ? null : h.code); showDossierForHub(h);
      }
    });
  });
  leafEls.forEach(function (leaf) {
    leaf.group.addEventListener("mouseenter", function () { showDossierForItem(leaf.item); });
    leaf.group.addEventListener("focus", function () { showDossierForItem(leaf.item); });
    leaf.group.addEventListener("click", function (e) { e.stopPropagation(); showDossierForItem(leaf.item); });
    leaf.group.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") { e.preventDefault(); showDossierForItem(leaf.item); }
    });
  });
  svg.addEventListener("click", function (e) { if (e.target === svg) applyFilter(null); });

  var pillbar = document.getElementById("specsc-pillbar");
  var resetPill = document.createElement("span");
  resetPill.className = "specsc-pill reset active";
  resetPill.textContent = "ALL 12";
  resetPill.addEventListener("click", function () { applyFilter(null); dossier.classList.remove("show"); });
  pillbar.appendChild(resetPill);

  HUBS.forEach(function (h, i) {
    var pill = document.createElement("span");
    pill.className = "specsc-pill";
    pill.setAttribute("data-pod", h.code);
    pill.style.borderColor = colorFaint(i);
    pill.textContent = h.label + " · " + h.items.length;
    pill.addEventListener("mouseenter", function () { if (activeCode !== h.code) { pill.style.background = colorFor(i); pill.style.color = "var(--bg)"; } });
    pill.addEventListener("mouseleave", function () { if (activeCode !== h.code) { pill.style.background = ""; pill.style.color = ""; } });
    pill.addEventListener("click", function () { applyFilter(activeCode === h.code ? null : h.code); showDossierForHub(h); });
    pillbar.appendChild(pill);
  });

  /* Sync FROM the existing table filter chips, so a table-chip click also
     drives the map (the reverse direction, applyFilter -> chip.click(), is
     wired above). Two listeners on the same buttons, suite-nav.js's own
     handler is untouched. */
  document.querySelectorAll(".spec-filter-chip[data-filter]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var code = chip.getAttribute("data-filter");
      applyFilter(code === "all" ? null : code, true);
    });
  });

  /* Discovery-beacon pulse on the existing table: a real, data-driven signal
     (does this row have a real well-known path or not), not decoration. */
  document.querySelectorAll(".spec-table tbody tr").forEach(function (row) {
    var pathCell = row.querySelectorAll("td")[3];
    if (!pathCell) return;
    var hasPath = !!pathCell.querySelector("code");
    var dot = document.createElement("span");
    dot.className = hasPath ? "specsc-beacon" : "specsc-beacon specsc-beacon-off";
    dot.setAttribute("aria-hidden", "true");
    pathCell.insertBefore(dot, pathCell.firstChild);
  });
})();
