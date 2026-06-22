// ===== Oslo City Walk — interactions =====
(function() {
  'use strict';

  let currentLang = 'zh';
  const langButtons = document.querySelectorAll('.lang-btn');

  function switchLanguage(lang) {
    currentLang = lang;
    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) el.textContent = text;
    });
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';
    try { localStorage.setItem('oslo-trip-lang', lang); } catch(e) {}
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
  });

  try {
    const saved = localStorage.getItem('oslo-trip-lang');
    if (saved === 'zh' || saved === 'en') switchLanguage(saved);
  } catch(e) {}

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Intersection Observer for fade-in =====
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.timeline-item, .overview-card, .tip-card, .day-block').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });
})();
