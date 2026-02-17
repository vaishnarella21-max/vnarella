(function () {
  "use strict";

  // Removed Dark Mode Logic

  document.addEventListener("DOMContentLoaded", function () {
    // initTheme(); // Removed
    setupMobileNav();
    setupReveal();
    // setupThemeToggle(); // Removed
  });

  /* ... rest of existing code ... */

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


  /* Mobile Menu Logic - Robust & Polished */
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
        document.body.classList.add("menu-open"); // Lock scroll
        toggleBtn.setAttribute("aria-expanded", "true");
        menuOverlay.setAttribute("aria-hidden", "false");
      } else {
        menuOverlay.classList.remove("is-open");
        document.body.classList.remove("menu-open"); // Unlock scroll
        toggleBtn.setAttribute("aria-expanded", "false");
        menuOverlay.setAttribute("aria-hidden", "true");
      }
    }

    // Toggle Button Click
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = menuOverlay.classList.contains("is-open");
      toggleMenu(!isOpen);
    });

    // Close Button Click
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        toggleMenu(false);
      });
    }

    // Backdrop Click (Close)
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        toggleMenu(false);
      });
    }

    // Link Click (Close & Navigate)
    links.forEach(function (link) {
      link.addEventListener("click", function () {
        toggleMenu(false);
      });
    });

    // Escape Key (Close)
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
    var sections = document.querySelectorAll("section");
    var navLinks = document.querySelectorAll(".nav a");

    window.addEventListener("scroll", function () {
      var current = "";
      sections.forEach(function (section) {
        var sectionTop = section.offsetTop;
        var sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
          current = section.getAttribute("id");
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(current) && current !== "") {
          link.classList.add("active");
        }
      });
    });
  }

  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        var targetId = this.getAttribute('href').substring(1);
        var target = document.getElementById(targetId);
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80, // Offset for fixed header
            behavior: 'smooth'
          });
          // Update URL without jump
          history.pushState(null, null, '#' + targetId);
        }
      });
    });
  }

  initTheme();
  setupThemeToggle();
  setupReveal();
  setupPrintResume();
  setupMobileNav();
  setupNavScrollSpy();
  setupSmoothScroll();
  setFooterYear();
})();
