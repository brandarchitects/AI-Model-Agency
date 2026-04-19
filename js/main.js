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

    // ↓ Replace with your actual newsletter signup URL once available
    var NEWSLETTER_URL = 'mailto:info@visari.ch?subject=Newsletter-Anmeldung%20Visari%20Models';

    var strings = {
      client: {
        de: {
          eyebrow: 'Unverbindlich anfragen',
          headline: 'Das perfekte Gesicht für Ihre nächste Kampagne.',
          body: 'Kein Shooting, kein Overhead, Lieferung in 3–5 Tagen. Wir zeigen Ihnen in einer kurzen Anfrage, welche AI Models zu Ihrer Marke passen.',
          perks: ['10× günstiger als klassisches Shooting', 'Lieferung in 3–5 Tagen', 'Rechtssicher nach Schweizer Recht'],
          cta: 'Schreiben Sie uns jetzt →',
          link: 'mailto:info@visari.ch?subject=Anfrage%20AI%20Models%20%E2%80%93%20Visari',
          privacy: 'Keine Verpflichtung. Antwort innert 24 Stunden.'
        },
        en: {
          eyebrow: 'Get in touch',
          headline: 'The perfect face for your next campaign.',
          body: 'No shooting, no overhead, delivery in 3–5 days. Send us a brief enquiry and we\'ll show you which AI Models fit your brand.',
          perks: ['10× cheaper than a classic shoot', 'Delivery in 3–5 days', 'Legally compliant under Swiss law'],
          cta: 'Write to us now →',
          link: 'mailto:info@visari.ch?subject=Enquiry%20AI%20Models%20%E2%80%93%20Visari',
          privacy: 'No commitment. Reply within 24 hours.'
        },
        es: {
          eyebrow: 'Consulta sin compromiso',
          headline: 'El rostro perfecto para su próxima campaña.',
          body: 'Sin sesión, sin costes adicionales, entrega en 3–5 días. Cuéntenos su proyecto y le mostraremos qué AI Models encajan con su marca.',
          perks: ['10× más económico que una sesión', 'Entrega en 3–5 días', 'Legalmente seguro según ley suiza'],
          cta: 'Escríbanos ahora →',
          link: 'mailto:info@visari.ch?subject=Consulta%20AI%20Models%20%E2%80%93%20Visari',
          privacy: 'Sin compromiso. Respuesta en 24 horas.'
        }
      },
      model: {
        de: {
          eyebrow: 'Wir suchen AI Models',
          headline: 'Ihr Gesicht. Passive Einnahmen. Ohne Aufwand.',
          body: 'Melden Sie sich für unseren Newsletter an und erfahren Sie als Erste, wenn der Visari Model-Pool öffnet. Kein Shooting, kein Vertrag — nur Ihre Bewerbung.',
          perks: ['Bis CHF 3\'250 pro Kampagne', 'Einmalig 30 Min. Aufwand von zuhause', 'Volle Kontrolle — Sie entscheiden immer'],
          cta: 'Jetzt für Newsletter anmelden →',
          link: NEWSLETTER_URL,
          privacy: 'Kein Spam. Jederzeit abmeldbar.'
        },
        en: {
          eyebrow: 'We\'re looking for AI Models',
          headline: 'Your face. Passive income. Zero effort.',
          body: 'Sign up for our newsletter and be the first to know when the Visari model pool opens. No shooting, no contract — just your application.',
          perks: ['Up to CHF 3\'250 per campaign', 'One-time 30 min. from home', 'Full control — you always decide'],
          cta: 'Sign up for the newsletter →',
          link: NEWSLETTER_URL,
          privacy: 'No spam. Unsubscribe anytime.'
        },
        es: {
          eyebrow: 'Buscamos AI Models',
          headline: 'Su imagen. Ingresos pasivos. Sin esfuerzo.',
          body: 'Regístrese en nuestro newsletter y sea el primero en saber cuándo abre el pool de models Visari. Sin sesión, sin contrato — solo su solicitud.',
          perks: ['Hasta CHF 3\'250 por campaña', '30 min. desde casa, solo una vez', 'Control total — usted siempre decide'],
          cta: 'Suscribirse al newsletter →',
          link: NEWSLETTER_URL,
          privacy: 'Sin spam. Cancelable en cualquier momento.'
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
      '<a href="' + s.link + '" class="wl-cta">' + s.cta + '</a>' +
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
