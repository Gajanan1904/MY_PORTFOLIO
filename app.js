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

// ============================================================
// PARTICLE DATA BACKGROUND (HERO)
// ============================================================
(function initParticleCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h, particles = [];
  
  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }
  
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

// ============================================================
// COUNT-UP ANIMATION
// ============================================================
const counters = document.querySelectorAll('.counter');
const speed = 50;

const countObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      
      const updateCount = () => {
        const c = +counter.innerText;
        const inc = target / speed;
        
        if (c < target) {
          counter.innerText = Math.ceil(c + inc);
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCount();
      obs.unobserve(counter);
    }
  });
}, { threshold: 0.5 });

counters.forEach(counter => countObserver.observe(counter));

// ============================================================
// CHART.JS SKILLS RADAR
// ============================================================
const chartCanvas = document.getElementById('skillsChart');
let myChart;

function initChart() {
  if (!chartCanvas) return;
  const ctx = chartCanvas.getContext('2d');
  
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#334155';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  
  if (myChart) myChart.destroy();

  myChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Python', 'SQL', 'Data Science', 'Data Visualization', 'Business Intel.', 'Excel'],
      datasets: [{
        label: 'Proficiency',
        data: [90, 88, 80, 85, 85, 95],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDark ? '#f1f5f9' : '#0f172a',
          bodyColor: isDark ? '#f1f5f9' : '#0f172a',
          borderColor: 'rgba(99, 102, 241, 0.3)',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          angleLines: { color: gridColor },
          grid: { color: gridColor },
          pointLabels: {
            color: textColor,
            font: { size: 12, family: "'Inter', sans-serif", weight: '500' }
          },
          ticks: { display: false, min: 0, max: 100 }
        }
      }
    }
  });
}

// Observe to load animation uniquely when scrolled down
const chartObs = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (typeof Chart !== 'undefined') initChart();
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

if (chartCanvas) chartObs.observe(chartCanvas);

// Re-render chart gracefully on theme toggle
const themeToggleBtn = document.getElementById('themeToggle');
if (themeToggleBtn && chartCanvas) {
  themeToggleBtn.addEventListener('click', () => {
    setTimeout(() => {
      if (typeof Chart !== 'undefined') initChart();
    }, 50);
  });
}
