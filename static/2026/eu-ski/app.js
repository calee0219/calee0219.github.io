// ===== Calendar Generation =====
function generateCalendar(containerId, year, month, highlights) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const monthNames = ['', '一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const title = document.createElement('div');
  title.className = 'cal-title';
  title.textContent = `${year} 年 ${monthNames[month]}`;
  container.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'cal-grid';

  // Header
  dayNames.forEach(d => {
    const h = document.createElement('div');
    h.className = 'cal-header';
    h.textContent = d;
    grid.appendChild(h);
  });

  // Days
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dayEl = document.createElement('div');
    dayEl.className = 'cal-day';
    dayEl.textContent = d;

    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dow = new Date(year, month - 1, d).getDay();

    if (dow === 0 || dow === 6) dayEl.classList.add('weekend');
    if (highlights[dateStr]) {
      dayEl.classList.add(highlights[dateStr]);
      dayEl.title = getTooltip(highlights[dateStr], dateStr);
    }

    grid.appendChild(dayEl);
  }

  container.appendChild(grid);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'cal-legend';
  legend.innerHTML = `
    <span><span class="cal-legend-dot" style="background:#fef2f2;border:1px solid #dc2626;"></span>國定假日</span>
    <span><span class="cal-legend-dot" style="background:#fef9c3;border:1px solid #854d0e;"></span>需請假</span>
    <span><span class="cal-legend-dot" style="background:#dbeafe;border:1px solid #1e40af;"></span>連休日</span>
  `;
  container.appendChild(legend);
}

function getTooltip(type, date) {
  const tooltips = {
    'holiday': '國定假日',
    'leave': '需請假日',
    'vacation': '連休（週末）'
  };
  return tooltips[type] || '';
}

// December 2026 highlights
const decHighlights = {
  '2026-12-20': 'vacation',
  '2026-12-21': 'vacation',
  '2026-12-22': 'leave',
  '2026-12-23': 'leave',
  '2026-12-24': 'leave',
  '2026-12-25': 'holiday',
  '2026-12-26': 'vacation',
  '2026-12-27': 'vacation',
  '2026-12-28': 'leave',
  '2026-12-29': 'leave',
  '2026-12-30': 'leave',
  '2026-12-31': 'leave'
};

// January 2027 highlights
const janHighlights = {
  '2027-01-01': 'holiday',
  '2027-01-02': 'leave',
  '2027-01-03': 'vacation',
  '2027-01-04': 'vacation'
};

generateCalendar('cal-dec', 2026, 12, decHighlights);
generateCalendar('cal-jan', 2027, 1, janHighlights);

// ===== Itinerary Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.itinerary-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ===== Leaflet Maps =====
function createIcon(color, label) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background:${color};
      color:#fff;
      width:32px;height:32px;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:14px;font-weight:700;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      border:2px solid #fff;
    ">${label}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -20]
  });
}

// Ski resort map
const skiMapEl = document.getElementById('skiMapView');
if (skiMapEl) {
  const skiMap = L.map('skiMapView').setView([47.2, 11.5], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(skiMap);

  const skiResorts = [
    { name: 'SkiWelt Wilder Kaiser', lat: 47.505, lng: 12.215, km: 280, price: '€372/6天', tag: 'CP值之王' },
    { name: 'Saalbach-Hinterglemm', lat: 47.391, lng: 12.636, km: 270, price: '€425/6天', tag: '中級天堂' },
    { name: 'Sölden', lat: 46.966, lng: 11.007, km: 144, price: '€432/6天', tag: '冰川壯景' },
    { name: 'St. Anton am Arlberg', lat: 47.129, lng: 10.268, km: 305, price: '€450/6天', tag: '傳奇雪場' }
  ];

  skiResorts.forEach(r => {
    L.marker([r.lat, r.lng], { icon: createIcon('#0ea5e9', '⛷') })
      .addTo(skiMap)
      .bindPopup(`<strong>${r.name}</strong><br>${r.tag}<br>雪道: ${r.km}km<br>價格: ${r.price}`);
  });

  const nearbyCities = [
    { name: '因斯布魯克 Innsbruck', lat: 47.269, lng: 11.404 },
    { name: '薩爾茲堡 Salzburg', lat: 47.809, lng: 13.055 },
    { name: '慕尼黑 München', lat: 48.135, lng: 11.582 }
  ];
  nearbyCities.forEach(c => {
    L.marker([c.lat, c.lng], { icon: createIcon('#64748b', '🏙') })
      .addTo(skiMap)
      .bindPopup(`<strong>${c.name}</strong><br>交通樞紐`);
  });
}

// Main interactive map
const mainMapEl = document.getElementById('mainMap');
if (mainMapEl) {
  const mainMap = L.map('mainMap').setView([48.0, 14.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(mainMap);

  const allCities = [
    { name: '維也納 Wien', lat: 48.208, lng: 16.373, color: '#7c3aed', desc: '音樂之都，哈布斯堡王朝宮殿', highlights: '美泉宮、聖史蒂芬大教堂、霍夫堡皇宮', market: '市政廳廣場聖誕市集' },
    { name: '薩爾茲堡 Salzburg', lat: 47.809, lng: 13.055, color: '#059669', desc: '莫札特故鄉，雪場中繼站', highlights: '薩爾茲堡要塞、米拉貝爾宮、莫札特出生地', market: '大教堂廣場聖誕市集' },
    { name: '慕尼黑 München', lat: 48.135, lng: 11.582, color: '#2563eb', desc: '巴伐利亞首府，交通樞紐', highlights: '瑪利亞廣場、皇家啤酒屋、寧芬堡宮', market: '瑪利亞廣場聖誕市集' },
    { name: '布拉格 Praha', lat: 50.075, lng: 14.437, color: '#dc2626', desc: '百塔之城，物價親民', highlights: '布拉格城堡、查理大橋、舊城廣場天文鐘', market: '舊城廣場聖誕市集（至1/6）' },
    { name: '布達佩斯 Budapest', lat: 47.497, lng: 19.040, color: '#d97706', desc: '多瑙河明珠，溫泉之城', highlights: '國會大廈、漁人堡、塞切尼溫泉浴場', market: 'Vörösmarty廣場聖誕市集' },
    { name: '布拉提斯拉瓦 Bratislava', lat: 48.148, lng: 17.107, color: '#475569', desc: '距維也納60km，歐洲最便宜首都', highlights: '布拉提斯拉瓦城堡、藍色教堂', market: '舊城區聖誕市集' },
    { name: '因斯布魯克 Innsbruck', lat: 47.269, lng: 11.404, color: '#0d9488', desc: '阿爾卑斯山城，雪場門戶', highlights: '黃金屋頂、北山纜車、皇宮', market: '舊城區聖誕市集' },
    { name: '哈修塔特 Hallstatt', lat: 47.562, lng: 13.649, color: '#0891b2', desc: 'UNESCO世界遺產，世界最美小鎮', highlights: '鹽礦、天空步道、湖畔風光', market: '' },
    { name: '瓦杜茲 Vaduz', lat: 47.141, lng: 9.521, color: '#6366f1', desc: '列支敦斯登首都，世界第六小國', highlights: '瓦杜茲城堡、郵票博物館', market: '' }
  ];

  allCities.forEach(c => {
    const popupContent = `
      <div style="min-width:200px;">
        <strong style="font-size:14px;">${c.name}</strong>
        <p style="margin:4px 0;color:#475569;font-size:12px;">${c.desc}</p>
        <p style="margin:4px 0;font-size:12px;"><strong>必訪：</strong>${c.highlights}</p>
        ${c.market ? `<p style="margin:4px 0;font-size:12px;color:#dc2626;"><strong>聖誕市集：</strong>${c.market}</p>` : ''}
      </div>
    `;
    L.marker([c.lat, c.lng], { icon: createIcon(c.color, '🏙') })
      .addTo(mainMap)
      .bindPopup(popupContent);
  });

  const skiResorts = [
    { name: 'SkiWelt Wilder Kaiser', lat: 47.505, lng: 12.215, km: 280, price: '€372/6天', tag: 'CP值之王' },
    { name: 'Saalbach-Hinterglemm', lat: 47.391, lng: 12.636, km: 270, price: '€425/6天', tag: '中級天堂' },
    { name: 'Sölden', lat: 46.966, lng: 11.007, km: 144, price: '€432/6天', tag: '冰川壯景' },
    { name: 'St. Anton am Arlberg', lat: 47.129, lng: 10.268, km: 305, price: '€450/6天', tag: '傳奇雪場' }
  ];

  skiResorts.forEach(r => {
    L.marker([r.lat, r.lng], { icon: createIcon('#0ea5e9', '⛷') })
      .addTo(mainMap)
      .bindPopup(`<strong>${r.name}</strong><br>${r.tag}<br>雪道: ${r.km}km<br>價格: ${r.price}`);
  });

  // Route lines
  const routeA = [[48.135, 11.582], [47.809, 13.055], [47.505, 12.215], [48.208, 16.373], [50.075, 14.437]];
  L.polyline(routeA, { color: '#2563eb', weight: 2, opacity: 0.5, dashArray: '8, 8' }).addTo(mainMap).bindPopup('方案A：經典三國路線');

  const routeB = [[48.208, 16.373], [47.497, 19.040], [48.148, 17.107], [50.075, 14.437]];
  L.polyline(routeB, { color: '#7c3aed', weight: 2, opacity: 0.5, dashArray: '4, 8' }).addTo(mainMap).bindPopup('方案B：深度五國路線（延伸段）');
}

// ===== Smooth scroll for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Scroll Reveal Animations =====
// Use CSS class approach - add 'reveal' class, then 'revealed' on intersection
const revealElements = document.querySelectorAll('.leave-card, .flight-card, .ski-card, .city-card, .budget-card, .mini-city, .timeline-item');

revealElements.forEach(el => {
  el.classList.add('reveal');
});

// Add animate-ready after a short delay so content is visible by default
setTimeout(() => {
  revealElements.forEach(el => {
    el.classList.add('animate-ready');
  });
}, 100);

const observerOptions = { threshold: 0.05, rootMargin: '0px 0px -20px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => observer.observe(el));
