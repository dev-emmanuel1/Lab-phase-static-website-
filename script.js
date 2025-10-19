(function () {
  'use strict';

  /* -------------------------
     Helpers
  ------------------------- */
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  /* -------------------------
     Theme Toggle
  ------------------------- */
  const themeToggleBtn = $('#theme-toggle');
  const root = document.documentElement;
  let themeIndex = 1; // 1: light, 0: dark

  function applyTheme(index) {
    themeIndex = index % 2;
    if (themeIndex === 0) {
      // dark
      root.style.setProperty('--bg', '#0b0c10');
      root.style.setProperty('--panel', '#0f1114');
      root.style.setProperty('--muted', '#9aa7a7');
      root.style.setProperty('--text', '#ffffff');
      themeToggleBtn.textContent = '☀';
      document.body.style.background = 'var(--bg)';
    } else {
      // light
      root.style.setProperty('--bg', '#f7f7f9');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--muted', '#666');
      root.style.setProperty('--text', '#0b0c10');
      themeToggleBtn.textContent = '🌙';
      document.body.style.background = 'var(--bg)';
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => applyTheme((themeIndex + 1) % 2));
  }
  applyTheme(1);

  /* -------------------------
     Nav click popup & smooth anchor
  ------------------------- */
  const navLinks = $$('.nav a');
  const navPopup = $('#nav-popup');
  const navPopupText = $('#nav-popup-text');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const label = link.textContent.trim() || 'Section';
      if (navPopup && navPopupText) {
        navPopupText.textContent = `Opening ${label}...`;
        navPopup.classList.remove('hidden');
        navPopup.classList.add('show');
        setTimeout(() => {
          navPopup.classList.remove('show');
          navPopup.classList.add('hidden');
        }, 1400);
      }
    });
  });

  /* -------------------------
     Active nav link while scrolling
  ------------------------- */
  const observedSections = navLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (observedSections.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`.nav a[href="#${id}"]`);
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          if (link) link.classList.add('active');
        }
      });
    }, { threshold: 0.5 });

    observedSections.forEach(s => navObserver.observe(s));
  }

  /* -------------------------
     Scroll reveal for elements
  ------------------------- */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-hidden');
        entry.target.classList.add('is-visible');
        if (entry.target.matches('.book-card, .project-card, .gallery-item')) {
          entry.target.classList.add('visible');
        }
      }
    });
  }, { threshold: 0.18 });

  $$('.wrap, .card, .book-card, .gallery-item, .project-card, .quote-card, .hero-overlay')
    .forEach(el => {
      el.classList.add('is-hidden');
      revealObserver.observe(el);
    });

  /* -------------------------
     Quotes carousel (auto slide)
  ------------------------- */
  const quotesTrack = $('.quotes-track');
  if (quotesTrack) {
    const total = quotesTrack.children.length;
    let idx = 0;

    const update = () => {
      quotesTrack.style.transform = `translateX(-${idx * 100}%)`;
    };

    update();
    setInterval(() => {
      idx = (idx + 1) % total;
      update();
    }, 5000);
  }

  /* -------------------------
     Contact form popup
  ------------------------- */
  const contactForm = $('#contact-form');
  const formPopup = $('#form-popup');
  const formCloseBtn = $('#close-popup');

  if (contactForm && formPopup) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      formPopup.classList.remove('hidden');
      setTimeout(() => formPopup.classList.add('hidden'), 6000);
      contactForm.reset();
    });
  }
  if (formCloseBtn) formCloseBtn.addEventListener('click', () => formPopup.classList.add('hidden'));

  /* -------------------------
     Utility: set current year
  ------------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
