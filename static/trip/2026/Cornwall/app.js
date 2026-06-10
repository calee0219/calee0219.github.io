// ===== Cornwall Trip App Logic =====
(function() {
  'use strict';

  // ===== Language Toggle =====
  let currentLang = 'zh';
  const langButtons = document.querySelectorAll('.lang-btn');

  function switchLanguage(lang) {
    currentLang = lang;

    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    document.querySelectorAll('[data-zh][data-en]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        el.textContent = text;
      }
    });

    document.documentElement.lang = lang === 'zh' ? 'zh-TW' : 'en';

    try {
      localStorage.setItem('cornwall-trip-lang', lang);
    } catch(e) {}
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchLanguage(btn.dataset.lang);
    });
  });

  try {
    const saved = localStorage.getItem('cornwall-trip-lang');
    if (saved && (saved === 'zh' || saved === 'en')) {
      switchLanguage(saved);
    }
  } catch(e) {}

  // ===== Itinerary Plan Toggle =====
  const planTabs = document.querySelectorAll('.itinerary-tab');
  const planContents = document.querySelectorAll('.plan-content');

  function switchPlan(plan) {
    planTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.plan === plan);
    });

    planContents.forEach(content => {
      content.classList.toggle('active', content.id === `plan-${plan}`);
    });

    // Dispatch event for map update
    window.dispatchEvent(new CustomEvent('planChanged', { detail: { plan: plan } }));

    try {
      localStorage.setItem('cornwall-trip-plan', plan);
    } catch(e) {}
  }

  planTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchPlan(tab.dataset.plan);
    });
  });

  // Load saved plan preference
  try {
    const savedPlan = localStorage.getItem('cornwall-trip-plan');
    if (savedPlan && (savedPlan === '2day' || savedPlan === '3day')) {
      switchPlan(savedPlan);
    }
  } catch(e) {}

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

  document.querySelectorAll('.timeline-item, .overview-card, .analysis-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

  // Add CSS for animations
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .timeline-item.optional-item.fade-in.visible {
      opacity: 0.85;
    }
  `;
  document.head.appendChild(style);

})();
