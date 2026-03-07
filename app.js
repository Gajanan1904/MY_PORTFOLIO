/* ============================================================
   APP.JS — Theme toggle, scroll animations, mobile nav
   ============================================================ */

(function () {
  'use strict';

  // ---- DOM refs ----
  const html = document.documentElement;
  const loader = document.getElementById('loader');
  const navbar = document.getElementById('navbar');
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  const reveals = document.querySelectorAll('.reveal');

  // ============================================================
  // LOADER
  // ============================================================
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 400);
  });

  // ============================================================
  // THEME
  // ============================================================
  const THEME_KEY = 'gb-portfolio-theme';

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeIcon.className = theme === 'dark' ? 'ri-moon-line theme-toggle-icon' : 'ri-sun-line theme-toggle-icon';
    localStorage.setItem(THEME_KEY, theme);
  }

  // Init from localStorage or system preference
  (function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return applyTheme(saved);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'dark'); // default dark
  })();

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ============================================================
  // NAVBAR — add shadow on scroll
  // ============================================================
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    lastScroll = window.scrollY;
  }, { passive: true });

  // ============================================================
  // ACTIVE NAV LINK
  // ============================================================
  const observerNav = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(sec => observerNav.observe(sec));

  // ============================================================
  // SCROLL REVEAL
  // ============================================================
  const observerReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(el => observerReveal.observe(el));

  // ============================================================
  // MOBILE MENU
  // ============================================================
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // ============================================================
  // SMOOTH SCROLL (fallback for Safari)
  // ============================================================
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Hero CTA buttons smooth scroll
  document.querySelectorAll('.hero-cta a[href^="#"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(btn.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

})();

// ============================================================
// PROJECT MODALS (Global functions for inline onclick)
// ============================================================
window.openModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
  }
};

window.closeModal = function (modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // restore scrolling
  }
};

// ============================================================
// LIGHTBOX
// ============================================================
window.openLightbox = function (src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    // keep body overflow hidden since modal is likely already doing it
  }
};

window.closeLightbox = function () {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
};

// ============================================================
// ESCAPE KEY SUPPORT
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // 1. Close lightbox if open
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active')) {
      window.closeLightbox();
      return;
    }
    // 2. Otherwise close any open modals
    const activeModals = document.querySelectorAll('.project-modal.active');
    activeModals.forEach(modal => {
      window.closeModal(modal.id);
    });
  }
});
