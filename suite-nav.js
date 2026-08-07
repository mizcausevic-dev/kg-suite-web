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
})();
