// ===== REDESIGN: Category Tab Filtering =====
document.addEventListener('DOMContentLoaded', () => {
  const catTabs = document.querySelectorAll('.cat-tab');
  const catGroups = document.querySelectorAll('.category-group');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update active tab
      catTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Show/hide category groups
      if (category === 'all') {
        catGroups.forEach(g => g.classList.remove('hidden'));
      } else {
        catGroups.forEach(g => {
          if (g.dataset.category === category) {
            g.classList.remove('hidden');
          } else {
            g.classList.add('hidden');
          }
        });
      }

      // Scroll to top of visible content (unless clicking "all")
      if (category !== 'all') {
        const targetGroup = document.getElementById('cat-' + category);
        if (targetGroup) {
          targetGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ===== REDESIGN: Section Collapse/Expand =====
  const toggleBars = document.querySelectorAll('.section-toggle-bar');

  toggleBars.forEach(bar => {
    bar.addEventListener('click', () => {
      const section = bar.closest('.collapsible-section');
      if (section) {
        section.classList.toggle('collapsed');
        
        // If expanding, ensure Leaflet maps resize properly
        if (!section.classList.contains('collapsed')) {
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 350);
        }
      }
    });
  });

  // ===== REDESIGN: Hero category buttons scroll to category =====
  document.querySelectorAll('.hero-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const catId = btn.dataset.category;
      
      // Activate the corresponding tab
      catTabs.forEach(t => t.classList.remove('active'));
      const matchingTab = document.querySelector(`.cat-tab[data-category="${catId}"]`);
      if (matchingTab) matchingTab.classList.add('active');
      
      // Show only this category
      catGroups.forEach(g => {
        if (g.dataset.category === catId) {
          g.classList.remove('hidden');
        } else {
          g.classList.add('hidden');
        }
      });

      // Scroll to the category
      const targetGroup = document.getElementById('cat-' + catId);
      if (targetGroup) {
        targetGroup.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== REDESIGN: Auto-expand first section when category is clicked =====
  // (Expand the first section in a category when it becomes visible)
  const expandFirstInCategory = (catId) => {
    const group = document.querySelector(`.category-group[data-category="${catId}"]`);
    if (group) {
      const firstSection = group.querySelector('.collapsible-section.collapsed');
      if (firstSection) {
        firstSection.classList.remove('collapsed');
      }
    }
  };

  // When a category tab is clicked, auto-expand its first section
  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;
      if (category !== 'all') {
        setTimeout(() => expandFirstInCategory(category), 100);
      }
    });
  });

  // ===== REDESIGN: Sticky category bar hide on scroll down, show on scroll up =====
  let lastScrollY = window.scrollY;
  const categoryBar = document.getElementById('categoryBar');
  
  if (categoryBar) {
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      // Always show when near top
      if (currentScrollY < 200) {
        categoryBar.style.transform = 'translateY(0)';
        return;
      }
      
      // Show/hide based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        // Scrolling down - hide
        // categoryBar.style.transform = 'translateY(-100%)';
        // Actually, keep it visible per user preference for tab on top
      } else {
        // Scrolling up - show
        categoryBar.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // ===== REDESIGN: Update category tabs with section counts =====
  catTabs.forEach(tab => {
    const category = tab.dataset.category;
    if (category !== 'all') {
      const group = document.querySelector(`.category-group[data-category="${category}"]`);
      if (group) {
        const count = group.querySelectorAll('.collapsible-section').length;
        const badge = document.createElement('span');
        badge.className = 'section-count-badge';
        badge.textContent = count;
        tab.appendChild(badge);
      }
    }
  });

  // ===== REDESIGN: Auto-expand comparison sections for survey stage =====
  const comparisonSections = ['flights', 'ski', 'budget-ski', 'na-ski', 'asia-ski', 'accommodation', 'itinerary', 'budget'];
  comparisonSections.forEach(id => {
    const section = document.getElementById(id);
    if (section && section.classList.contains('collapsed')) {
      section.classList.remove('collapsed');
    }
  });

  // ===== REDESIGN: Expand All / Collapse All keyboard shortcut =====
  document.addEventListener('keydown', (e) => {
    // Alt+E to expand all, Alt+C to collapse all
    if (e.altKey && e.key === 'e') {
      document.querySelectorAll('.collapsible-section.collapsed').forEach(s => {
        s.classList.remove('collapsed');
      });
    }
    if (e.altKey && e.key === 'c') {
      document.querySelectorAll('.collapsible-section:not(.collapsed)').forEach(s => {
        s.classList.add('collapsed');
      });
    }
  });
});
