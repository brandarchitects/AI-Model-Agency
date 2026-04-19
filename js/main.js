/* ============================================
   VISARI — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Language Auto-Detection (runs before anything else) ---
  // Detects browser language and redirects on first visit.
  // Respects user choice (stored in localStorage) after explicit switching.
  (function autoLang() {
    try {
      var saved = localStorage.getItem('visari_lang');
      var path = window.location.pathname;
      var isEN = path.indexOf('/en/') === 0 || path === '/en';
      var isES = path.indexOf('/es/') === 0 || path === '/es';
      var currentLang = isEN ? 'en' : (isES ? 'es' : 'de');

      // If user has a saved preference, honour it only on root (/)
      if (saved && saved !== currentLang) {
        // Redirect to saved language version
        var rawFile = path.split('/').pop();
        var filename = (rawFile && rawFile !== 'en' && rawFile !== 'es') ? rawFile : 'index.html';
        if (saved === 'de' && (isEN || isES)) {
          window.location.replace('/' + filename);
          return;
        } else if (saved === 'en' && !isEN) {
          window.location.replace('/en/' + filename);
          return;
        } else if (saved === 'es' && !isES) {
          window.location.replace('/es/' + filename);
          return;
        }
      }

      // First visit: auto-detect from browser (only on DE root)
      if (!saved && currentLang === 'de') {
        var lang = (navigator.language || navigator.userLanguage || 'de').toLowerCase();
        var rawFile2 = path.split('/').pop();
        var filename2 = (rawFile2 && rawFile2 !== 'en' && rawFile2 !== 'es') ? rawFile2 : 'index.html';
        if (lang.indexOf('es') === 0) {
          localStorage.setItem('visari_lang', 'es');
          window.location.replace('/es/' + filename2);
          return;
        } else if (lang.indexOf('de') !== 0 && lang.indexOf('fr') !== 0 && lang.indexOf('it') !== 0) {
          // Non-DACH, non-ES → English
          localStorage.setItem('visari_lang', 'en');
          window.location.replace('/en/' + filename2);
          return;
        }
        // DE/FR/IT → stay on German
        localStorage.setItem('visari_lang', 'de');
      }

      // Store current language if on a language-specific URL without saved pref
      if (!saved) {
        localStorage.setItem('visari_lang', currentLang);
      }
    } catch (e) {
      // Fail silently if localStorage unavailable
    }
  })();

  // --- Language Switcher: save choice on click ---
  function initLangSwitcher() {
    document.querySelectorAll('.lang-switcher a').forEach(function (link) {
      link.addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        if (lang) {
          try { localStorage.setItem('visari_lang', lang); } catch (e) {}
        }
      });
    });
  }

  // --- Scroll Reveal via IntersectionObserver ---
  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    els.forEach(function (el) { observer.observe(el); });
  }

  // --- Navigation: scroll background ---
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var ribbon = document.querySelector('.ribbon');
    var scrollThreshold = ribbon ? 100 : 60;

    function update() {
      if (window.scrollY > scrollThreshold) {
        nav.classList.add('scrolled');
        if (ribbon) ribbon.style.transform = 'translateY(-100%)';
      } else {
        nav.classList.remove('scrolled');
        if (ribbon) ribbon.style.transform = 'translateY(0)';
      }
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  // --- Mobile Navigation ---
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    // Build fullscreen overlay menu from nav-links content
    var menu = document.createElement('div');
    menu.className = 'mobile-menu';
    menu.setAttribute('id', 'mobile-menu');

    // Clone links into the overlay
    var allLinks = navLinks.querySelectorAll('a');
    allLinks.forEach(function (a) {
      var clone = document.createElement('a');
      clone.href = a.href;
      clone.textContent = a.textContent;
      if (a.classList.contains('nav-cta') || a.classList.contains('btn-primary')) {
        clone.className = 'mobile-menu-cta';
      }
      menu.appendChild(clone);
    });

    document.body.appendChild(menu);

    var isOpen = false;

    function openMenu() {
      isOpen = true;
      menu.classList.add('open');
      toggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      isOpen = false;
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Toggle button
    toggle.addEventListener('click', function () {
      if (isOpen) { closeMenu(); } else { openMenu(); }
    });

    // Click any link in the menu
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');

        // Close menu immediately
        closeMenu();

        // If it's an anchor link on the same page, scroll to it
        if (href && href.indexOf('#') === 0 && href.length > 1) {
          e.preventDefault();
          var target = document.querySelector(href);
          if (target) {
            setTimeout(function () {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          }
        }
        // External links (models.html, etc.) — browser handles normally
      });
    });

    // Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { closeMenu(); }
    });
  }

  // --- FAQ Accordion ---
  function initFaqAccordion() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-question');
      if (!btn) return;

      btn.addEventListener('click', function () {
        var wasOpen = item.classList.contains('open');

        // Close all
        items.forEach(function (i) { i.classList.remove('open'); });

        // Toggle current
        if (!wasOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // --- Hero Slideshow Crossfade ---
  function initSlideshow() {
    var slideshows = document.querySelectorAll('.hero-slideshow');
    slideshows.forEach(function (slideshow) {
      var slides = slideshow.querySelectorAll('.hero-slide');
      if (slides.length < 2) return;

      var current = 0;
      slides[0].classList.add('active');

      setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 4500);
    });
  }

  // --- Image-Break Slideshow Crossfade ---
  function initImageBreakSlideshow() {
    var breaks = document.querySelectorAll('.image-break');
    breaks.forEach(function (ib) {
      var slides = ib.querySelectorAll('.ib-slide');
      if (slides.length < 2) return;

      var current = 0;
      slides[0].classList.add('active');

      setInterval(function () {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
      }, 5000);
    });
  }

  // --- Smooth Scroll for anchor links (desktop nav + footer) ---
  function initSmoothScroll() {
    document.querySelectorAll('.nav-links a[href^="#"], .footer a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initNavScroll();
    initMobileNav();
    initFaqAccordion();
    initSlideshow();
    initImageBreakSlideshow();
    initSmoothScroll();
    initLangSwitcher();
  });
})();
