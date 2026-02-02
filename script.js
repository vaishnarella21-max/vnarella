(function () {
  "use strict";

  var STORAGE_KEY = "theme";

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setStoredTheme(value) {
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value);
      else localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  }

  function getSystemDark() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function applyTheme(dark) {
    var root = document.documentElement;
    if (dark) {
      root.dataset.theme = "dark";
    } else {
      delete root.dataset.theme;
    }
  }

  function initTheme() {
    var stored = getStoredTheme();
    var dark = stored === "dark";
    applyTheme(dark);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      updateThemeLabel(btn, dark);
    }
  }

  function updateThemeLabel(btn, isDark) {
    var label = btn && btn.querySelector(".theme-toggle-label");
    if (label) label.textContent = isDark ? "Light" : "Dark";
  }

  function setupThemeToggle() {
    var btn = document.querySelector(".theme-toggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isDark = document.documentElement.dataset.theme === "dark";
      var next = !isDark;
      applyTheme(next);
      setStoredTheme(next ? "dark" : "light");
      btn.setAttribute("aria-pressed", next ? "true" : "false");
      updateThemeLabel(btn, next);
    });
  }

  function setupReveal() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      var els = document.querySelectorAll(".reveal");
      for (var i = 0; i < els.length; i++) els[i].classList.add("is-visible");
      return;
    }
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.01 }
    );
    document.querySelectorAll(".reveal").forEach(function (el) {
      observer.observe(el);
    });
  }

  function setupPrintResume() {
    var btn = document.getElementById("print-resume");
    if (btn) {
      btn.addEventListener("click", function () {
        window.print();
      });
    }
  }

  function setupMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var expanded = toggle.getAttribute("aria-expanded") === "true";
      var next = !expanded;
      toggle.setAttribute("aria-expanded", next ? "true" : "false");
      nav.classList.toggle("is-open", next);
      document.body.style.overflow = next ? "hidden" : "";
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.style.overflow = "";
      }
    });
  }

  function setFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  initTheme();
  setupThemeToggle();
  setupReveal();
  setupPrintResume();
  setupMobileNav();
  setFooterYear();
})();
