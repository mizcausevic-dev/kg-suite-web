/* suite.kineticgain.com — shared page effects (fx-glow pointer-follow +
   scroll-in reveal). External same-origin script (CSP: script-src 'self').
   No dependencies. The old #section-nav sticky scrollspy this file used to
   gate everything behind is gone (retired with the single-page layout —
   primary nav is now nav-toggle.js); these effects run unconditionally. */
(function () {
  "use strict";

  /* fx-glow pointer-follow: the soft glow tracks the cursor on hovered cards.
     Calm single radial, the deliberate opposite of the old fx-shine sweep. */
  document.addEventListener(
    "pointermove",
    function (e) {
      var el = e.target && e.target.closest ? e.target.closest(".fx-glow") : null;
      if (!el) return;
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
      el.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
    },
    { passive: true }
  );

  /* Scroll-in reveal: section kickers/headers + cards fade and rise into view.
     Progressive enhancement all the way down — `.reveal-on-scroll` and
     `.js-reveal` are both added here, never present in the raw HTML, so a
     no-JS visitor simply sees every element at full opacity in its normal
     position (see the "Scroll-in reveal" block in style.css). Reduced-motion
     users are opted out before the observer is even created — no
     IntersectionObserver is instantiated for them at all. */
  var prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var revealTargets = [].slice.call(
    document.querySelectorAll(
      ".section-kicker, .block-inner > h2, .card-feature, .card, .layer-card, .persona-card, .stat"
    )
  );

  if (!prefersReducedMotion && "IntersectionObserver" in window && revealTargets.length) {
    revealTargets.forEach(function (el) { el.classList.add("reveal-on-scroll"); });
    document.body.classList.add("js-reveal");

    var reveal = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach(function (el) { reveal.observe(el); });
  }
})();

/* ============================================================================
   Hero chooser deep-links + at-a-glance count-up (2026-08-07)
   Both features degrade to their working no-JS state: the persona secondary
   link is a real href="#id" anchor (native fragment navigation, no JS
   required), and the stat numbers are already the correct final values in
   the DOM. Everything below is additive enhancement only.
   ============================================================================ */
(function () {
  "use strict";

  var reduceMotion = !!(
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* ---- Persona card 3 deep-link: highlight the #tooling MCP card on jump.
     No preventDefault — the browser's native "scroll to #id" still runs;
     this only layers a temporary highlight on top of that jump. ---- */
  var jumpLinks = [].slice.call(document.querySelectorAll(".persona-link-secondary"));
  jumpLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      var id = (link.getAttribute("href") || "").replace(/^#/, "");
      var target = id && document.getElementById(id);
      if (!target) return;
      target.classList.remove("chooser-highlight");
      void target.offsetWidth; // restart the animation if clicked twice in a row
      target.classList.add("chooser-highlight");
      window.setTimeout(function () {
        target.classList.remove("chooser-highlight");
      }, 1800);
    });
  });

  /* ---- At-a-glance stat band: count up from 0 once, the first time each
     number scrolls into view. Skipped entirely under reduced motion or
     without IntersectionObserver — the static final number (already in the
     markup) is what those visitors see, with zero extra work. ---- */
  var glanceNums = [].slice.call(document.querySelectorAll(".stat-band .stat-num"));
  if (glanceNums.length && !reduceMotion && "IntersectionObserver" in window && "requestAnimationFrame" in window) {
    var duration = 900;
    var glanceObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          observer.unobserve(el); // once per page load
          var target = parseInt(el.getAttribute("data-count-target") || el.textContent, 10);
          if (!isFinite(target)) return;
          var start = null;
          el.textContent = "0";
          function step(ts) {
            if (start === null) start = ts;
            var progress = Math.min((ts - start) / duration, 1);
            if (progress >= 1) {
              el.textContent = String(target);
              return;
            }
            el.textContent = String(Math.round(progress * target));
            window.requestAnimationFrame(step);
          }
          window.requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    glanceNums.forEach(function (el) {
      glanceObserver.observe(el);
    });
  }
})();

/* #specs filter chips — pure show/hide, addEventListener only (CSP:
   script-src 'self', no inline handlers). Progressive enhancement over a
   no-JS baseline where every <tr> is already visible: if this never runs,
   the table is still complete and readable. No row is ever removed from
   the DOM — only its inline display is toggled — so print and in-page
   find still see the full table whenever "All" is the active filter. */
(function () {
  "use strict";

  var chipGroup = document.querySelector(".spec-filter-chips");
  if (!chipGroup) return;

  var chips = [].slice.call(chipGroup.querySelectorAll(".spec-filter-chip"));
  var rows = [].slice.call(document.querySelectorAll(".spec-table tbody tr[data-vertical]"));
  if (!chips.length || !rows.length) return;

  function applyFilter(value) {
    rows.forEach(function (row) {
      var show = value === "all" || row.getAttribute("data-vertical") === value;
      row.style.display = show ? "" : "none";
    });
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      applyFilter(chip.getAttribute("data-filter") || "all");
    });
  });
})();

/* #audit-stream runtime filter chips — same pure show/hide discipline as
   the #specs filter above, scoped separately (id, not the shared class)
   since this one dims producer nodes and their connector lines instead of
   hiding table rows. No node is ever removed from the DOM, only dimmed via
   a class, and real connector geometry (audit-connectors.js) is untouched
   by this script — it only reports the active filter through the public
   window.__auditStreamSetFilter hook so redrawn paths pick up the same
   dim state. If audit-connectors.js never loads, producer nodes still dim
   correctly; only the connector-line dimming is skipped. */
(function () {
  "use strict";

  var chipGroup = document.getElementById("ad-runtime-filter");
  if (!chipGroup) return;

  var chips = [].slice.call(chipGroup.querySelectorAll(".spec-filter-chip"));
  var nodes = [].slice.call(document.querySelectorAll("#audit-stream .ad-node[data-runtime]"));
  if (!chips.length || !nodes.length) return;

  function applyFilter(value) {
    nodes.forEach(function (node) {
      var show = value === "all" || node.getAttribute("data-runtime") === value;
      node.classList.toggle("ad-dim", !show);
    });
    if (typeof window.__auditStreamSetFilter === "function") {
      window.__auditStreamSetFilter(value);
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) {
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      applyFilter(chip.getAttribute("data-filter") || "all");
    });
  });
})();
