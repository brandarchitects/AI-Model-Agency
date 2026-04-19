/* ============================================
   VISARI — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Language Dropdown ---
  function initLangDropdown() {
    document.querySelectorAll('.lang-dropdown').forEach(function (dd) {
      var toggle = dd.querySelector('.lang-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dd.classList.toggle('open');
        toggle.setAttribute('aria-expanded', open);
      });

      dd.querySelectorAll('.lang-menu a').forEach(function (link) {
        link.addEventListener('click', function () {
          dd.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    });

    document.addEventListener('click', function () {
      document.querySelectorAll('.lang-dropdown.open').forEach(function (dd) {
        dd.classList.remove('open');
        dd.querySelector('.lang-toggle').setAttribute('aria-expanded', 'false');
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

    // Clone nav links into overlay (skip lang-dropdown)
    var allLinks = navLinks.querySelectorAll(':scope > a, :scope > .nav-link');
    navLinks.querySelectorAll('.nav-link, .btn').forEach(function (a) {
      var clone = document.createElement('a');
      clone.href = a.href;
      clone.textContent = a.textContent;
      if (a.classList.contains('nav-cta') || a.classList.contains('btn-primary')) {
        clone.className = 'mobile-menu-cta';
      }
      menu.appendChild(clone);
    });

    // Add language links at bottom of mobile menu
    var langMenu = navLinks.querySelector('.lang-menu');
    if (langMenu) {
      var langSection = document.createElement('div');
      langSection.className = 'mobile-menu-lang';
      langMenu.querySelectorAll('a').forEach(function (a) {
        var lnk = document.createElement('a');
        lnk.href = a.href;
        lnk.textContent = a.textContent;
        if (a.classList.contains('active')) lnk.classList.add('active');
        langSection.appendChild(lnk);
      });
      menu.appendChild(langSection);
    }

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

  // --- Waitlist Popup ---
  function initWaitlistPopup() {
    try { if (localStorage.getItem('visari_popup_done')) return; } catch(e) {}

    var lang = document.documentElement.lang || 'de';
    var isModel = !!document.querySelector('link[href*="models.css"]');

    var strings = {
      client: {
        de: {
          eyebrow: 'Limitierter Frühzugang',
          headline: 'Sichern Sie sich exklusiven Zugang.',
          body: 'Visari ist in der Aufbauphase. Unternehmen auf der Warteliste erhalten Einführungskonditionen und bevorzugte Bearbeitung.',
          perks: ['Einführungskonditionen', 'Bevorzugte Bearbeitung', 'Persönliche Beratung'],
          cta: 'Jetzt auf Warteliste eintragen →',
          mailto: 'mailto:info@visari.ch?subject=Warteliste%20%E2%80%93%20Visari%20Fr%C3%BChzugang',
          privacy: 'Kein Spam. Jederzeit abmeldbar.'
        },
        en: {
          eyebrow: 'Limited Early Access',
          headline: 'Secure your exclusive access.',
          body: 'Visari is in early access. Companies on the waitlist receive introductory pricing and priority onboarding.',
          perks: ['Introductory pricing', 'Priority processing', 'Personal consultation'],
          cta: 'Join the waitlist →',
          mailto: 'mailto:info@visari.ch?subject=Waitlist%20%E2%80%93%20Visari%20Early%20Access',
          privacy: 'No spam. Unsubscribe anytime.'
        },
        es: {
          eyebrow: 'Acceso anticipado limitado',
          headline: 'Asegure su acceso exclusivo.',
          body: 'Visari está en fase de lanzamiento. Las empresas en la lista de espera reciben condiciones de introducción y atención prioritaria.',
          perks: ['Condiciones de introducción', 'Atención prioritaria', 'Consulta personal'],
          cta: 'Unirse a la lista de espera →',
          mailto: 'mailto:info@visari.ch?subject=Lista%20de%20espera%20%E2%80%93%20Visari',
          privacy: 'Sin spam. Cancelable en cualquier momento.'
        }
      },
      model: {
        de: {
          eyebrow: 'Jetzt bewerben',
          headline: 'Ihr Gesicht. Passive Einnahmen.',
          body: 'Nur 30 Minuten Aufwand — einmalig. Sichern Sie Ihren Platz im Visari Model-Pool und verdienen Sie mit Ihrem Erscheinungsbild.',
          perks: ['Bis CHF 3\'250 pro Kampagne', 'Keine Shootings, kein Aufwand', 'Volle Kontrolle über Ihr Bild'],
          cta: 'Jetzt als Model bewerben →',
          mailto: 'mailto:info@visari.ch?subject=Bewerbung%20als%20Visari%20AI%20Model',
          privacy: 'Sicher. Vertraulich. Schweizer Recht.'
        },
        en: {
          eyebrow: 'Apply now',
          headline: 'Your face. Passive income.',
          body: 'Just 30 minutes, once. Secure your spot in the Visari model pool and earn with your appearance.',
          perks: ['Up to CHF 3\'250 per campaign', 'No shootings, no effort', 'Full control over your image'],
          cta: 'Apply as a model →',
          mailto: 'mailto:info@visari.ch?subject=Application%20as%20Visari%20AI%20Model',
          privacy: 'Secure. Confidential. Swiss law.'
        },
        es: {
          eyebrow: 'Solicitar ahora',
          headline: 'Su imagen. Ingresos pasivos.',
          body: 'Solo 30 minutos, una sola vez. Asegure su lugar en el pool de models Visari y gane con su imagen.',
          perks: ['Hasta CHF 3\'250 por campaña', 'Sin sesiones fotográficas', 'Control total sobre su imagen'],
          cta: 'Solicitar como model →',
          mailto: 'mailto:info@visari.ch?subject=Solicitud%20como%20AI%20Model%20Visari',
          privacy: 'Seguro. Confidencial. Derecho suizo.'
        }
      }
    };

    var type = isModel ? 'model' : 'client';
    var s = strings[type][lang] || strings[type]['de'];

    var perksHTML = s.perks.map(function(p) {
      return '<li>' + p + '</li>';
    }).join('');

    var popup = document.createElement('div');
    popup.className = 'wl-popup' + (isModel ? ' wl-model' : '');
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-label', s.headline);
    popup.innerHTML =
      '<button class="wl-close" aria-label="Schliessen">&times;</button>' +
      '<p class="wl-eyebrow">' + s.eyebrow + '</p>' +
      '<h3 class="wl-headline">' + s.headline + '</h3>' +
      '<p class="wl-body">' + s.body + '</p>' +
      '<ul class="wl-perks">' + perksHTML + '</ul>' +
      '<a href="' + s.mailto + '" class="wl-cta">' + s.cta + '</a>' +
      '<p class="wl-privacy">' + s.privacy + '</p>';

    document.body.appendChild(popup);

    function dismiss(ctaClicked) {
      popup.classList.remove('wl-visible');
      try { localStorage.setItem('visari_popup_done', ctaClicked ? 'cta' : '1'); } catch(e) {}
      setTimeout(function() { popup.remove(); }, 500);
    }

    popup.querySelector('.wl-close').addEventListener('click', function() { dismiss(false); });
    popup.querySelector('.wl-cta').addEventListener('click', function() { dismiss(true); });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') dismiss(false);
    }, { once: true });

    setTimeout(function() { popup.classList.add('wl-visible'); }, 3500);
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
    initLangDropdown();
    initWaitlistPopup();
  });
})();
