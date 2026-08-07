/* suite.kineticgain.com — on-this-page sticky section nav + scrollspy.
   External same-origin script (CSP: script-src 'self'). No dependencies.
   - Mobile: the links collapse behind a toggle (vertical list, never a
     horizontal-scroll pill row).
   - Scrollspy: highlights the link for the section nearest the top via
     IntersectionObserver, matching the estate's pillar-page pattern. */
(function () {
  "use strict";

  var nav = document.getElementById("section-nav");
  if (!nav) return;

  var toggle = document.getElementById("section-nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  var links = [].slice.call(document.querySelectorAll(".section-nav-links a"));
  var map = {};

  links.forEach(function (a) {
    var id = (a.getAttribute("href") || "").replace(/^#/, "");
    var target = id && document.getElementById(id);
    if (target) map[id] = a;
    // Collapse the mobile menu after a jump so the target is visible.
    a.addEventListener("click", function () {
      if (nav.classList.contains("open")) {
        nav.classList.remove("open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  function setActive(a) {
    links.forEach(function (l) {
      l.classList.remove("active");
      l.removeAttribute("aria-current");
    });
    if (a) {
      a.classList.add("active");
      a.setAttribute("aria-current", "true");
    }
  }

  if ("IntersectionObserver" in window) {
    // Active band sits just under the two sticky bars (site header + this nav).
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActive(map[en.target.id]);
        });
      },
      { rootMargin: "-15% 0px -75% 0px" }
    );
    Object.keys(map).forEach(function (id) {
      spy.observe(document.getElementById(id));
    });
  }

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
