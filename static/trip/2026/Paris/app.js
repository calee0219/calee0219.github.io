// ===== Paris Trip — language toggle, day tabs, scroll animations =====
(function() {
  'use strict';

  // ---------- LANGUAGE ----------
  function applyLang(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-Hant');
    document.querySelectorAll('[data-zh]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val !== null) el.textContent = val;
    });
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });
    try { localStorage.setItem('paris_lang', lang); } catch (e) {}
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
  });

  let savedLang = 'zh';
  try { savedLang = localStorage.getItem('paris_lang') || 'zh'; } catch (e) {}
  applyLang(savedLang);

  // ---------- DAY TABS ----------
  const tabs = document.querySelectorAll('.day-tab');
  const contents = document.querySelectorAll('.day-content');
  function selectDay(day) {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-day') === String(day)));
    contents.forEach(c => c.classList.toggle('active', c.id === 'day-' + day));
    window.dispatchEvent(new CustomEvent('dayChanged', { detail: { day: parseInt(day, 10) } }));
  }
  tabs.forEach(tab => {
    tab.addEventListener('click', () => selectDay(tab.getAttribute('data-day')));
  });

  // ---------- SMOOTH NAV ----------
  document.querySelectorAll('.topbar-nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  // ---------- SCROLL FADE-IN ----------
  const faders = document.querySelectorAll('.overview-card, .ticket, .rec-card, .surprise-card, .more-card, .callout, .tl-item');
  const reveal = (el) => el.classList.add('visible');
  if ('IntersectionObserver' in window) {
    faders.forEach(el => el.classList.add('fade-in'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    faders.forEach(el => io.observe(el));
    // Safety net: reveal anything already in view on load, and force-reveal after 2.5s
    const revealInView = () => {
      faders.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
      });
    };
    window.addEventListener('load', revealInView);
    setTimeout(revealInView, 300);
    setTimeout(() => faders.forEach(reveal), 2500);
  } else {
    faders.forEach(reveal);
  }
})();
