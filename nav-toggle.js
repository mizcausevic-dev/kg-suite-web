(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".site-nav-links");
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  function open() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    if (nav.classList.contains("is-open")) close();
    else open();
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") close();
  });
  document.addEventListener("click", function (e) {
    if (nav.classList.contains("is-open") && !nav.contains(e.target) && e.target !== toggle) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
  window.addEventListener("resize", function () {
    if (window.innerWidth > 720) close();
  });
})();
