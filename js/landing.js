/* Visari — Landing (Redesign 2026)
   Self-contained interactions for index.html (DE/EN/ES). */
(function () {
  'use strict';

  /* Scroll reveal */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* Nav border on scroll */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    function update() {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Mobile menu */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('menu-open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('menu-open');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') document.body.classList.remove('menu-open');
    });
  }

  /* Language dropdown */
  function initLangDropdown() {
    document.querySelectorAll('.lang-dropdown').forEach(function (dd) {
      var toggle = dd.querySelector('.lang-toggle');
      if (!toggle) return;
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        dd.classList.toggle('open');
        toggle.setAttribute('aria-expanded', dd.classList.contains('open') ? 'true' : 'false');
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.lang-dropdown.open').forEach(function (dd) {
        dd.classList.remove('open');
        var t = dd.querySelector('.lang-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initNavScroll();
    initMobileNav();
    initLangDropdown();
  });
})();
