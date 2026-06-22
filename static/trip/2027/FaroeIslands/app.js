// ===== Language Toggle =====
(function() {
  'use strict';

  let currentLang = 'zh';

  const langButtons = document.querySelectorAll('.lang-btn');
  
  function switchLanguage(lang) {
    currentLang = lang;
    
    // Update button states
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';

    // Save preference
    try {
      localStorage.setItem('faroe-trip-lang', lang);
    } catch(e) {}
  }

  // Event listeners
  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  // Load saved preference
  try {
    const saved = localStorage.getItem('faroe-trip-lang');
    if (saved && (saved === 'zh' || saved === 'en')) {
      switchLanguage(saved);
    }
  } catch(e) {}

  // ===== Plan Tab Switching =====
  const planTabs = document.querySelectorAll('.plan-tab');
  const planContents = document.querySelectorAll('.plan-content');

  planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const plan = tab.dataset.plan;
      
      // Update tab states
      planTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update content visibility
      planContents.forEach(content => {
        content.classList.toggle('active', content.id === `plan-${plan}`);
      });
    });
  });

  // ===== Smooth scroll for anchor links =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== Intersection Observer for fade-in animations =====
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.timeline-item, .overview-card, .analysis-card, .tip-card, .worth-card, .day-block, .compact-day').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

})();
