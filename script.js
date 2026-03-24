(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    setupMobileNav();
    setupReveal();
    setupNavScrollSpy();
    setupSmoothScroll();
    setFooterYear();
  });

  function setupReveal() {
    var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.querySelectorAll(".reveal").forEach(function (el) {
        el.classList.add("is-visible");
      });
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

  function setupMobileNav() {
    var toggleBtn = document.getElementById("menuToggle");
    var menuOverlay = document.getElementById("mobileMenu");

    if (!toggleBtn || !menuOverlay) return;

    var closeBtn = menuOverlay.querySelector(".menu-close");
    var backdrop = menuOverlay.querySelector(".menu-backdrop");
    var links = menuOverlay.querySelectorAll("a");

    function toggleMenu(isOpen) {
      if (isOpen) {
        menuOverlay.classList.add("is-open");
        document.body.classList.add("menu-open");
        toggleBtn.setAttribute("aria-expanded", "true");
        menuOverlay.setAttribute("aria-hidden", "false");
      } else {
        menuOverlay.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        menuOverlay.setAttribute("aria-hidden", "true");
      }
    }

    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMenu(!menuOverlay.classList.contains("is-open"));
    });

    if (closeBtn) closeBtn.addEventListener("click", function () { toggleMenu(false); });
    if (backdrop) backdrop.addEventListener("click", function () { toggleMenu(false); });

    links.forEach(function (link) {
      link.addEventListener("click", function () { toggleMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuOverlay.classList.contains("is-open")) {
        toggleMenu(false);
      }
    });
  }

  function setFooterYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  function setupNavScrollSpy() {
    var sections = document.querySelectorAll("section[id]");
    var navLinks = document.querySelectorAll(".nav a");

    window.addEventListener("scroll", function () {
      var current = "";
      sections.forEach(function (section) {
        if (window.pageYOffset >= section.offsetTop - 150) {
          current = section.getAttribute("id");
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove("active");
        if (current && link.getAttribute("href").includes(current)) {
          link.classList.add("active");
        }
      });
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var targetId = this.getAttribute("href").substring(1);
        if (!targetId) return;
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
          history.pushState(null, null, "#" + targetId);
        }
      });
    });
  }

})();
