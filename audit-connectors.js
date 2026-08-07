/* suite.kineticgain.com — audit-stream fan-in connector overlay.
   Progressive enhancement ONLY. Draws real SVG lines between the audit-stream
   diagram's actual rendered node positions, measured live via
   getBoundingClientRect() -- never hardcoded coordinates -- so it holds up at
   any viewport width and any column count the .ad-grid auto-fit produces.

   If this script never runs (JS off, an error, an old browser), the static
   HTML/CSS diagram already shipped in index.html -- .ad-grid, .ad-spine,
   .ad-consumers, the "hash-chained fan-in ↓" / "verifiable replay ↓" text --
   is already the complete, readable, keyboard/AT-accessible diagram. Nothing
   here is required for that content to exist or be understood; this only
   layers real connector lines on top of it.

   External same-origin script (CSP: script-src 'self'). No dependencies. */
(function () {
  "use strict";

  var SVG_NS = "http://www.w3.org/2000/svg";

  var diagram = document.querySelector("#audit-stream .audit-diagram");
  if (!diagram || !window.SVGSVGElement) return;

  var grid = diagram.querySelector(".ad-grid");
  var spine = diagram.querySelector(".ad-spine");
  var consumers = diagram.querySelector(".ad-consumers");
  if (!grid || !spine || !consumers) return;

  var reduceMotion =
    !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- build the overlay once; redraw just repositions/recreates its paths ----
  var svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("class", "ad-connectors");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  var defs = document.createElementNS(SVG_NS, "defs");
  var grad = document.createElementNS(SVG_NS, "linearGradient");
  grad.setAttribute("id", "ad-connector-grad");
  grad.setAttribute("x1", "0");
  grad.setAttribute("y1", "0");
  grad.setAttribute("x2", "0");
  grad.setAttribute("y2", "1");
  var stop1 = document.createElementNS(SVG_NS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#45A29E");
  var stop2 = document.createElementNS(SVG_NS, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#66FCF1");
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);

  var linesGroup = document.createElementNS(SVG_NS, "g");
  linesGroup.setAttribute("class", "ad-connector-lines");
  var dotsGroup = document.createElementNS(SVG_NS, "g");
  dotsGroup.setAttribute("class", "ad-connector-dots");

  svg.appendChild(defs);
  svg.appendChild(linesGroup);
  svg.appendChild(dotsGroup);
  diagram.insertBefore(svg, diagram.firstChild);

  // ---- geometry helpers ----
  function anchorPoint(el, edge, baseRect) {
    var r = el.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - baseRect.left,
      y: (edge === "top" ? r.top : r.bottom) - baseRect.top
    };
  }

  function curvePath(x1, y1, x2, y2) {
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

  // Draw-in reveal (skipped entirely under reduced motion -- lines just appear).
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
  }

  var firstDraw = true;
  var pendingFrame = null;

  function draw() {
    pendingFrame = null;

    var baseRect = diagram.getBoundingClientRect();
    var w = baseRect.width;
    var h = baseRect.height;
    if (!w || !h) return;

    svg.setAttribute("viewBox", "0 0 " + w.toFixed(1) + " " + h.toFixed(1));
    svg.setAttribute("width", w.toFixed(1));
    svg.setAttribute("height", h.toFixed(1));

    while (linesGroup.firstChild) linesGroup.removeChild(linesGroup.firstChild);
    while (dotsGroup.firstChild) dotsGroup.removeChild(dotsGroup.firstChild);

    var producers = [].slice.call(grid.querySelectorAll(".ad-node"));
    var producerAnchors = producers.map(function (node) {
      return anchorPoint(node, "bottom", baseRect);
    });

    // Below the width where .ad-grid collapses to a single column, every
    // producer anchor shares the same x as the spine -- the fan-in curves
    // degenerate into coincident vertical lines that read as disconnected
    // tick marks, not a diagram. The static HTML/CSS diagram underneath
    // (.ad-grid/.ad-spine/.ad-consumers plus the "hash-chained fan-in ↓" /
    // "verifiable replay ↓" text) is already complete and accessible on its
    // own, so when there's no real fan-in geometry to draw, leave the
    // overlay empty instead of drawing something misleading. A variance
    // check (rather than a hardcoded viewport-width breakpoint) self-heals
    // correctly if .ad-grid's own CSS minmax value ever changes.
    var producerXs = producerAnchors.map(function (a) { return a.x; });
    var xSpread = producerXs.length
      ? Math.max.apply(null, producerXs) - Math.min.apply(null, producerXs)
      : 0;
    if (xSpread < 24) {
      firstDraw = false;
      return;
    }

    var spineTop = anchorPoint(spine, "top", baseRect);
    var spineBottom = anchorPoint(spine, "bottom", baseRect);

    producerAnchors.forEach(function (a, i) {
      var path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", curvePath(a.x, a.y, spineTop.x, spineTop.y));
      path.setAttribute("class", "ad-connector-line");
      linesGroup.appendChild(path);
      dotsGroup.appendChild(makeDot(a.x, a.y, false));
      if (firstDraw) animateIn(path, i * 35);
    });

    dotsGroup.appendChild(makeDot(spineTop.x, spineTop.y, true));
    dotsGroup.appendChild(makeDot(spineBottom.x, spineBottom.y, true));

    var cnodes = [].slice.call(consumers.querySelectorAll(".ad-cnode"));
    cnodes.forEach(function (node, i) {
      var a = anchorPoint(node, "top", baseRect);
      var path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", curvePath(spineBottom.x, spineBottom.y, a.x, a.y));
      path.setAttribute("class", "ad-connector-line");
      linesGroup.appendChild(path);
      dotsGroup.appendChild(makeDot(a.x, a.y, false));
      if (firstDraw) animateIn(path, producers.length * 35 + i * 35);
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

  // requestAnimationFrame (which scheduleDraw uses) is throttled or fully
  // paused while the tab is backgrounded -- a real path on mobile when an
  // orientation change or resize happens right as the tab loses focus. A
  // redraw queued during that window can sit stale until something else
  // triggers scheduleDraw again. Catch up explicitly the moment the tab
  // becomes visible so the overlay never ships permanently stale geometry.
  document.addEventListener(
    "visibilitychange",
    function () {
      if (!document.hidden) scheduleDraw();
    },
    { passive: true }
  );
})();
