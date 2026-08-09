/* suite.kineticgain.com — audit-stream connector overlays.
   Progressive enhancement ONLY. Draws real SVG lines between actual rendered
   node positions, measured live via getBoundingClientRect() -- never
   hardcoded coordinates -- so it holds up at any viewport width and any
   column count a diagram's own CSS produces. Drives two independent
   diagrams (the Flow tab's spacious node-mesh, and the Full detail tab's
   dense producer grid) off one shared, generic connector-set factory.

   If this script never runs (JS off, an error, an old browser), the static
   HTML/CSS underneath each diagram is already the complete, readable,
   keyboard/AT-accessible content. Nothing here is required for that
   content to exist or be understood; this only layers connector lines
   and continuous-flow animation on top of it.

   External same-origin script (CSP: script-src 'self'). No dependencies. */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";
  if (!window.SVGSVGElement) return;

  var reduceMotion =
    !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- geometry helpers (shared by every connector set) ----
  function anchorPoint(el, edge, baseRect) {
    var r = el.getBoundingClientRect();
    if (edge === "left" || edge === "right") {
      return {
        x: (edge === "left" ? r.left : r.right) - baseRect.left,
        y: r.top + r.height / 2 - baseRect.top
      };
    }
    return {
      x: r.left + r.width / 2 - baseRect.left,
      y: (edge === "top" ? r.top : r.bottom) - baseRect.top
    };
  }

  // Vertical sets (top/bottom anchors) curve through a shared midpoint Y;
  // horizontal sets (left/right anchors, the flow-mesh) curve through a
  // shared midpoint X instead. `horizontal` picks which axis the S-curve
  // bends through.
  function curvePath(x1, y1, x2, y2, horizontal) {
    if (horizontal) {
      var midX = (x1 + x2) / 2;
      return "M" + x1 + "," + y1 + " C" + midX + "," + y1 + " " + midX + "," + y2 + " " + x2 + "," + y2;
    }
    var midY = (y1 + y2) / 2;
    return "M" + x1 + "," + y1 + " C" + x1 + "," + midY + " " + x2 + "," + midY + " " + x2 + "," + y2;
  }

  function makeDot(cx, cy, isHub) {
    var c = document.createElementNS(SVG_NS, "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", isHub ? 4.5 : 3);
    c.setAttribute("class", isHub ? "ad-connector-dot ad-connector-dot--hub" : "ad-connector-dot");
    return c;
  }

  // Draw-in reveal (skipped entirely under reduced motion -- lines just
  // appear). Once the reveal transition finishes, the inline styles it
  // used are cleared and .ad-connector-flow takes over -- that class' own
  // CSS @keyframes drives an ongoing marching-dash animation. Inline
  // styles have higher specificity than a class rule, so leaving them in
  // place would permanently block the ambient flow from ever appearing.
  function animateIn(path, delayMs) {
    if (reduceMotion) return;
    var len;
    try {
      len = path.getTotalLength();
    } catch (e) {
      return;
    }
    path.style.strokeDasharray = len + " " + len;
    path.style.strokeDashoffset = String(len);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        path.style.transition = "stroke-dashoffset 700ms ease " + delayMs + "ms";
        path.style.strokeDashoffset = "0";
      });
    });
    path.addEventListener("transitionend", function handler() {
      path.removeEventListener("transitionend", handler);
      path.style.transition = "";
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "";
      path.classList.add("ad-connector-flow");
    });
  }

  /* Generic connector-set: fans a list of "from" nodes into one hub, then
     fans the hub out to a list of "to" nodes. Each connector set owns its
     own SVG overlay, its own firstDraw/activeFilter state, and its own
     resize/redraw wiring -- fully independent of any other set on the
     page, so the Flow tab and the Full detail tab never interfere. */
  function createConnectorSet(opts) {
    var diagram = opts.diagram;
    var getFromNodes = opts.getFromNodes;
    var getHub = opts.getHub;
    var getToNodes = opts.getToNodes;
    var fromEdge = opts.fromEdge || "bottom";
    var toEdge = opts.toEdge || "top";
    var horizontal = fromEdge === "left" || fromEdge === "right";
    var opposite = { top: "bottom", bottom: "top", left: "right", right: "left" };
    var minSpread = opts.minSpread == null ? 24 : opts.minSpread;

    if (!diagram) return null;

    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "ad-connectors");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");

    var linesGroup = document.createElementNS(SVG_NS, "g");
    linesGroup.setAttribute("class", "ad-connector-lines");
    var dotsGroup = document.createElementNS(SVG_NS, "g");
    dotsGroup.setAttribute("class", "ad-connector-dots");
    svg.appendChild(linesGroup);
    svg.appendChild(dotsGroup);
    diagram.insertBefore(svg, diagram.firstChild);

    var firstDraw = true;
    var pendingFrame = null;
    var activeFilter = "all";

    function draw() {
      pendingFrame = null;

      // A hidden panel (display:none, e.g. an inactive tab) reports a
      // zero-size bounding rect -- skip the draw rather than building a
      // degenerate 0x0 SVG. The tab switcher calls scheduleDraw() again
      // the moment its panel becomes visible.
      var baseRect = diagram.getBoundingClientRect();
      var w = baseRect.width;
      var h = baseRect.height;
      if (!w || !h) return;

      svg.setAttribute("viewBox", "0 0 " + w.toFixed(1) + " " + h.toFixed(1));
      svg.setAttribute("width", w.toFixed(1));
      svg.setAttribute("height", h.toFixed(1));

      while (linesGroup.firstChild) linesGroup.removeChild(linesGroup.firstChild);
      while (dotsGroup.firstChild) dotsGroup.removeChild(dotsGroup.firstChild);

      var fromNodes = getFromNodes();
      var hub = getHub();
      var toNodes = getToNodes();
      if (!fromNodes.length || !hub || !toNodes.length) return;

      var fromAnchors = fromNodes.map(function (node) {
        return anchorPoint(node, fromEdge, baseRect);
      });

      // Below the width where a vertical layout's grid collapses to a
      // single column, every anchor shares the same x as the hub -- the
      // fan-in curves degenerate into coincident lines that read as
      // disconnected tick marks, not a diagram. (A horizontal set's
      // "from" nodes are stacked in a fixed column, not an auto-fit grid
      // that can collapse, so this guard only applies to vertical sets;
      // horizontal sets pass minSpread: 0 to disable it entirely.) The
      // static HTML/CSS underneath is already complete and accessible on
      // its own, so when there's no real fan-in geometry to draw, leave
      // the overlay empty instead of drawing something misleading. A
      // variance check (rather than a hardcoded viewport breakpoint)
      // self-heals if the layout's own CSS ever changes.
      var coords = fromAnchors.map(function (a) { return horizontal ? a.y : a.x; });
      var spread = coords.length ? Math.max.apply(null, coords) - Math.min.apply(null, coords) : 0;
      if (spread < minSpread) {
        firstDraw = false;
        return;
      }

      var hubIn = anchorPoint(hub, opposite[fromEdge], baseRect);
      var hubOut = anchorPoint(hub, opposite[toEdge], baseRect);

      fromAnchors.forEach(function (a, i) {
        var runtime = fromNodes[i].getAttribute("data-runtime") || "";
        var path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", curvePath(a.x, a.y, hubIn.x, hubIn.y, horizontal));
        path.setAttribute("class", "ad-connector-line");
        if (runtime) path.setAttribute("data-runtime", runtime);
        linesGroup.appendChild(path);
        var dot = makeDot(a.x, a.y, false);
        if (runtime) dot.setAttribute("data-runtime", runtime);
        dotsGroup.appendChild(dot);
        if (firstDraw) {
          animateIn(path, i * 35);
        } else if (!reduceMotion) {
          path.classList.add("ad-connector-flow");
        }
        if (activeFilter && activeFilter !== "all" && runtime !== activeFilter) {
          path.classList.add("ad-dim");
          dot.classList.add("ad-dim");
        }
      });

      dotsGroup.appendChild(makeDot(hubIn.x, hubIn.y, true));
      dotsGroup.appendChild(makeDot(hubOut.x, hubOut.y, true));

      toNodes.forEach(function (node, i) {
        var a = anchorPoint(node, toEdge, baseRect);
        var path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", curvePath(hubOut.x, hubOut.y, a.x, a.y, horizontal));
        path.setAttribute("class", "ad-connector-line");
        linesGroup.appendChild(path);
        dotsGroup.appendChild(makeDot(a.x, a.y, false));
        if (firstDraw) {
          animateIn(path, fromNodes.length * 35 + i * 35);
        } else if (!reduceMotion) {
          path.classList.add("ad-connector-flow");
        }
      });

      firstDraw = false;
    }

    function scheduleDraw() {
      if (pendingFrame) return;
      pendingFrame = requestAnimationFrame(draw);
    }

    draw();
    window.addEventListener("resize", scheduleDraw, { passive: true });
    window.addEventListener("orientationchange", scheduleDraw, { passive: true });

    if (window.ResizeObserver) {
      new ResizeObserver(scheduleDraw).observe(diagram);
    }
    if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
      document.fonts.ready.then(scheduleDraw);
    }

    // requestAnimationFrame (which scheduleDraw uses) is throttled or
    // fully paused while the tab is backgrounded -- a real path on mobile
    // when an orientation change or resize happens right as the tab loses
    // focus. Catch up explicitly the moment the tab becomes visible so
    // the overlay never ships permanently stale geometry.
    document.addEventListener(
      "visibilitychange",
      function () {
        if (!document.hidden) scheduleDraw();
      },
      { passive: true }
    );

    return {
      scheduleDraw: scheduleDraw,
      setFilter: function (filter) {
        activeFilter = filter || "all";
        firstDraw = false;
        draw();
      }
    };
  }

  // ---- Full detail diagram: 10 real producers -> audit-stream-py -> 3 consumers ----
  var detailDiagram = document.querySelector("#audit-stream .audit-diagram");
  var detailSet = null;
  if (detailDiagram) {
    var detailGrid = detailDiagram.querySelector(".ad-grid");
    var detailSpine = detailDiagram.querySelector(".ad-spine");
    var detailConsumers = detailDiagram.querySelector(".ad-consumers");
    if (detailGrid && detailSpine && detailConsumers) {
      detailSet = createConnectorSet({
        diagram: detailDiagram,
        getFromNodes: function () { return [].slice.call(detailGrid.querySelectorAll(".ad-node")); },
        getHub: function () { return detailSpine; },
        getToNodes: function () { return [].slice.call(detailConsumers.querySelectorAll(".ad-cnode")); },
        fromEdge: "bottom",
        toEdge: "top"
      });
    }
  }

  // ---- Flow diagram: 3 real producer-category nodes -> audit-stream-py -> 3 consumers ----
  var flowMesh = document.querySelector("#audit-stream .ad-flow-mesh");
  var flowSet = null;
  if (flowMesh) {
    var flowLeft = flowMesh.querySelector(".ad-flow-col-in");
    var flowHub = flowMesh.querySelector(".ad-flow-hub-node");
    var flowRight = flowMesh.querySelector(".ad-flow-col-out");
    if (flowLeft && flowHub && flowRight) {
      flowSet = createConnectorSet({
        diagram: flowMesh,
        getFromNodes: function () { return [].slice.call(flowLeft.querySelectorAll(".ad-flow-node")); },
        getHub: function () { return flowHub; },
        getToNodes: function () { return [].slice.call(flowRight.querySelectorAll(".ad-flow-node")); },
        fromEdge: "right",
        toEdge: "left",
        minSpread: 0
      });
      // The flow layout is a fixed 3-column row (not an auto-fit grid that
      // can collapse to one column), so unlike the detail diagram there is
      // no meaningful "degenerate geometry" to guard against -- minSpread:
      // 0 above disables that guard entirely. anchorPoint() and curvePath()
      // both branch on the edge/horizontal argument, so the same
      // createConnectorSet() factory drives this left-to-right layout and
      // the detail diagram's top-to-bottom one without any per-instance
      // patching.
    }
  }

  // Public hooks for the runtime filter chips (suite-nav.js owns the chip
  // UI and dims/undims .ad-node elements directly; these only need to know
  // the active filter so redrawn connector paths/dots pick up .ad-dim too,
  // since draw() fully recreates them on every call rather than patching
  // existing elements in place).
  window.__auditStreamSetFilter = function (filter) {
    if (detailSet) detailSet.setFilter(filter);
  };

  // Public hook the tab switcher calls right after un-hiding a panel, so
  // a diagram that drew nothing while its tab was hidden (zero-size rect)
  // gets a real geometry pass the instant it becomes visible.
  window.__auditStreamRedraw = function () {
    if (detailSet) detailSet.scheduleDraw();
    if (flowSet) flowSet.scheduleDraw();
  };
})();
