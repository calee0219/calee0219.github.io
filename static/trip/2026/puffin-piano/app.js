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
      localStorage.setItem('puffin-trip-lang', lang);
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
    const saved = localStorage.getItem('puffin-trip-lang');
    if (saved && (saved === 'zh' || saved === 'en')) {
      switchLanguage(saved);
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

  // Observe timeline items and cards
  document.querySelectorAll('.timeline-item, .overview-card, .analysis-card, .prep-card').forEach(el => {
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

  // ===== Hide Google Maps iframe if it fails to load =====
  const mapIframe = document.getElementById('routeMap');
  if (mapIframe) {
    mapIframe.style.display = 'none'; // Hide placeholder iframe
  }

})();
