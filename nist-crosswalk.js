/* NIST AI RMF crosswalk, visualized. Small, purpose-built diagram for /specs/#nist —
   NOT a reuse of the specs-constellation radial engine, which is a 12-spec /
   6-vertical dataset. This is 4 implementation repos -> 3 NIST subcategories,
   the 3 historical mappings Crosswalk v0.2 Section 7 names (and that used to
   sit here as flat prose in a <ul>). Every repo name, subcategory code, and
   URL below is copied from docs/nist-rmf-crosswalk.md (section 7.2) and from
   the real GitHub links already used on this site in /implementations/.
   No invented stats, no invented repos.

   Repo names are long (up to 22 chars), so nodes on that side carry a plain
   index number (1-4) rather than the full string crammed next to a small
   circle at mobile widths -- the full name is always available three ways
   that don't depend on hover: the always-visible legend line under the
   diagram, this node's aria-label, and the caption panel's text. NIST
   subcategory codes are short enough (<=11 chars) to sit next to their node
   unabbreviated. */
(function () {
  "use strict";

  var REPOS = [
    {
      id: "r1", n: 1,
      name: "policy-as-code-engine",
      url: "https://github.com/mizcausevic-dev/policy-as-code-engine",
      to: "c1",
      detail: "POST /bundles/from-decision-card proposes policy rules from Decision Card conditions. A proposed bundle does not establish that a hosted handler checks or denies every request.",
    },
    {
      id: "r2", n: 2,
      name: "audit-stream-py",
      url: "https://github.com/mizcausevic-dev/audit-stream-py",
      to: "c2",
      detail: "A hash-chained stream can show continuity of accepted events. Complete capture of Decision Card, policy, and incident activity requires verified producer paths and an independently held checkpoint.",
    },
    {
      id: "r3", n: 3,
      name: "aeo-validator-service",
      url: "https://github.com/mizcausevic-dev/aeo-validator-service",
      to: "c3",
      detail: "A watched document can produce a structured drift report on recheck. Continuous hosted coverage and timely detection depend on the configured schedule, reachability, and operations.",
    },
    {
      id: "r4", n: 4,
      name: "slo-budget-tracker",
      url: "https://github.com/mizcausevic-dev/slo-budget-tracker",
      to: "c3",
      detail: "SLO and error-budget calculations can support burn-rate alerts. A live monitoring claim needs real telemetry, alert routing, and an observed response process.",
    },
  ];

  var SUBCATS = [
    {
      id: "c1", code: "MANAGE 1.3", title: "Plan responses to risks", x: 268, y: 30,
      detail: "A Decision Card can record conditions. MANAGE 1.3 implementation and live enforcement need buyer process evidence and a tested request boundary.",
    },
    {
      id: "c2", code: "GOVERN 1.5", title: "Record-keeping", x: 268, y: 90,
      detail: "An audit stream could support record-keeping. The hash chain proves accepted-record continuity only; capture completeness and independent custody need separate checks.",
    },
    {
      id: "c3", code: "MEASURE 3.1", title: "Deployment monitoring", x: 268, y: 180,
      detail: "Validator drift reports and SLO alerts could support monitoring. This design mapping does not establish continuous hosted monitoring or NIST conformance.",
    },
  ];

  var REPO_Y = { r1: 30, r2: 90, r3: 150, r4: 210 };
  var REPO_X = 70;

  var byId = {};
  REPOS.forEach(function (r) { byId[r.id] = r; });
  SUBCATS.forEach(function (c) { byId[c.id] = c; });

  var svg = document.getElementById("nist-cw-graph");
  var caption = document.getElementById("nist-cw-caption");
  if (!svg || !caption) return;

  var svgns = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    var e = document.createElementNS(svgns, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  var DEFAULT_CAPTION = caption.innerHTML;
  var pinned = null; /* id of the pinned node, or null */
  var nodeEls = {};   /* id -> <g> */
  var edgeEls = [];    /* {from, to, path} */

  function edgePath(x1, y1, x2, y2) {
    var midX = (x1 + x2) / 2;
    return "M " + x1 + " " + y1 + " C " + midX + " " + y1 + " " + midX + " " + y2 + " " + x2 + " " + y2;
  }

  /* ---- edges (drawn first, so nodes paint on top) ---- */
  REPOS.forEach(function (r) {
    var c = byId[r.to];
    var path = el("path", {
      class: "nist-cw-edge",
      d: edgePath(REPO_X, REPO_Y[r.id], c.x, c.y),
      "data-from": r.id, "data-to": c.id,
    });
    svg.appendChild(path);
    edgeEls.push({ from: r.id, to: c.id, path: path });
  });

  /* ---- repo nodes (numbered) ---- */
  REPOS.forEach(function (r) {
    var cy = REPO_Y[r.id];
    var g = el("g", {
      class: "nist-cw-node repo", tabindex: "0", role: "button",
      "aria-pressed": "false",
      "aria-label": r.name + " — implementation repo " + r.n + " of 4. Closes NIST " + byId[r.to].code + ". Press Enter for detail and a link to the repo.",
      "data-id": r.id,
    });
    var title = el("title", {}); title.textContent = r.name + " → " + byId[r.to].code;
    g.appendChild(title);
    g.appendChild(el("circle", { class: "core", cx: REPO_X, cy: cy, r: 12 }));
    var num = el("text", { class: "idx", x: REPO_X, y: cy });
    num.textContent = String(r.n);
    g.appendChild(num);
    svg.appendChild(g);
    nodeEls[r.id] = g;
  });

  /* ---- subcategory nodes (real, unabbreviated codes) ---- */
  SUBCATS.forEach(function (c) {
    var fromRepos = REPOS.filter(function (r) { return r.to === c.id; });
    var closers = fromRepos.map(function (r) { return r.name; }).join(" + ");
    var g = el("g", {
      class: "nist-cw-node subcat", tabindex: "0", role: "button",
      "aria-pressed": "false",
      "aria-label": "NIST " + c.code + ", " + c.title + " — closed by " + closers + ". Press Enter for detail.",
      "data-id": c.id,
    });
    var title = el("title", {}); title.textContent = c.code + " ← " + closers;
    g.appendChild(title);
    g.appendChild(el("circle", { class: "core", cx: c.x, cy: c.y, r: 12 }));
    g.appendChild(el("circle", { class: "dot", cx: c.x, cy: c.y, r: 3 }));
    var lbl = el("text", { class: "code", x: c.x + 18, y: c.y - 3 });
    lbl.textContent = c.code;
    g.appendChild(lbl);
    var sub = el("text", { class: "sub", x: c.x + 18, y: c.y + 10 });
    sub.textContent = c.title;
    g.appendChild(sub);
    svg.appendChild(g);
    nodeEls[c.id] = g;
  });

  /* ---- highlight + caption logic ---- */
  function relatedIds(id) {
    var set = {};
    set[id] = true;
    edgeEls.forEach(function (e) {
      if (e.from === id) set[e.to] = true;
      if (e.to === id) set[e.from] = true;
    });
    return set;
  }

  function paint(id) {
    var rel = id ? relatedIds(id) : null;
    edgeEls.forEach(function (e) {
      var active = rel && (e.from === id || e.to === id);
      e.path.classList.toggle("active", !!active);
      e.path.classList.toggle("nist-cw-dim", !!rel && !active);
    });
    Object.keys(nodeEls).forEach(function (k) {
      nodeEls[k].classList.toggle("nist-cw-dim", !!rel && !rel[k]);
    });
  }

  function renderRepo(r) {
    var c = byId[r.to];
    caption.innerHTML =
      '<span class="kind">Implementation repo &middot; ' + r.n + ' of 4</span>' +
      "<strong>" + r.name + "</strong> closes <strong>" + c.code + "</strong> (" + c.title + ")<br>" +
      r.detail + "<br>" +
      '<a href="' + r.url + '" target="_blank" rel="noreferrer">View on GitHub →</a>';
  }
  function renderSubcat(c) {
    var closers = REPOS.filter(function (r) { return r.to === c.id; }).map(function (r) { return r.name; }).join(" + ");
    caption.innerHTML =
      '<span class="kind">NIST AI RMF subcategory</span>' +
      "<strong>" + c.code + "</strong> — " + c.title + "<br>" +
      c.detail + "<br>" +
      '<span class="closer">Closed by ' + closers + "</span>";
  }
  function render(id) {
    if (byId[id].url) renderRepo(byId[id]); else renderSubcat(byId[id]);
  }
  function clearAll() {
    pinned = null;
    paint(null);
    caption.innerHTML = DEFAULT_CAPTION;
    Object.keys(nodeEls).forEach(function (k) { nodeEls[k].setAttribute("aria-pressed", "false"); });
  }

  function preview(id) {
    if (pinned) return; /* a click/Enter selection wins over hover/focus previews */
    paint(id);
    render(id);
  }
  function clearPreview() {
    if (pinned) return;
    paint(null);
    caption.innerHTML = DEFAULT_CAPTION;
  }
  function togglePin(id) {
    if (pinned === id) { clearAll(); return; }
    pinned = id;
    paint(id);
    render(id);
    Object.keys(nodeEls).forEach(function (k) { nodeEls[k].setAttribute("aria-pressed", k === id ? "true" : "false"); });
  }

  Object.keys(nodeEls).forEach(function (id) {
    var g = nodeEls[id];
    g.addEventListener("mouseenter", function () { preview(id); });
    g.addEventListener("mouseleave", function () { clearPreview(); });
    g.addEventListener("focus", function () { preview(id); });
    g.addEventListener("blur", function () { clearPreview(); });
    g.addEventListener("click", function () { togglePin(id); });
    g.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        togglePin(id);
      } else if (e.key === "Escape") {
        clearAll();
      }
    });
  });
  svg.addEventListener("click", function (e) { if (e.target === svg) clearAll(); });
})();
