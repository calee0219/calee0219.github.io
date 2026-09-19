// Dolomites 2027 — schematic route map (positions approximate)
(function () {
  var el = document.getElementById('route-map');
  if (!el || typeof L === 'undefined') return;

  var map = L.map('route-map', { scrollWheelZoom: false }).setView([46.585, 11.78], 10);
  map.on('focus', function () { map.scrollWheelZoom.enable(); });
  map.on('blur', function () { map.scrollWheelZoom.disable(); });

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var stops = [
    { n: 'N1 · Ortisei', c: [46.5747, 11.6697], d: 'Hotel Angelo Engel（4★）✅ 可訂' },
    { n: 'Day 2 · Seceda 刀鋒山', c: [46.5962, 11.7216], d: '2,518m · 纜車上山' },
    { n: 'N2 · Rifugio Firenze', c: [46.5889, 11.7622], d: '2,037m ⚠️ 2027 營業成疑' },
    { n: 'N3 · Rifugio Puez', c: [46.5917, 11.8111], d: '2,475m 🔴 尚未開放' },
    { n: 'N4 · Rifugio Genova', c: [46.6358, 11.7936], d: '2,297m 🔴 尚未開放' },
    { n: 'N5 · Rifugio Gardenacia', c: [46.5800, 11.8900], d: '2,050m 🔴 尚未開放 · 有桑拿' },
    { n: 'N6 · Passo Gardena', c: [46.5497, 11.8086], d: 'Alpin Hotel Frara 🔴 尚未開放' },
    { n: 'Day 6 · Gran Cir VF', c: [46.5560, 11.8030], d: '入門 via ferrata 🧗' },
    { n: 'N7 · Corvara', c: [46.5517, 11.8736], d: 'Sporthotel Panorama ✅ 可訂' }
  ];

  var latlngs = [];
  stops.forEach(function (s, i) {
    latlngs.push(s.c);
    var icon = L.divIcon({
      className: 'stop-marker',
      html: '<div class="stop-dot">' + (i + 1) + '</div>',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    L.marker(s.c, { icon: icon }).addTo(map)
      .bindPopup('<strong>' + s.n + '</strong><br>' + s.d);
  });

  L.polyline(latlngs, { color: '#2f5d50', weight: 3, opacity: 0.75, dashArray: '8,6' }).addTo(map);

  var style = document.createElement('style');
  style.textContent = '.stop-dot{width:26px;height:26px;border-radius:50%;background:#2f5d50;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.35)}';
  document.head.appendChild(style);
})();

// ===== Elevation profiles (schematic, from estimated waypoints) =====
(function () {
  var PROFILES = {
    'profile-d2': [
      { e: 2453, l: 'Seceda 上站' }, { e: 2519, l: '觀景點' }, { e: 2480, l: '' },
      { e: 2444, l: 'Forcella Pana' }, { e: 2370, l: '' }, { e: 2297, l: 'Pieralongia' },
      { e: 2150, l: '' }, { e: 2037, l: 'Firenze' }
    ],
    'profile-d3': [
      { e: 2037, l: 'Firenze' }, { e: 2150, l: 'Alpe Cisles' }, { e: 2380, l: '碎石坡' },
      { e: 2505, l: 'Sieles 埡口' }, { e: 2460, l: '' }, { e: 2470, l: 'Puez 高原' },
      { e: 2468, l: '' }, { e: 2475, l: 'Puez' }
    ],
    'profile-d4': [
      { e: 2475, l: 'Puez' }, { e: 2580, l: 'Munt de Puez' }, { e: 2442, l: '' },
      { e: 2600, l: '碎石坡' }, { e: 2740, l: 'Forcella Nives' }, { e: 2440, l: 'Passo Poma' },
      { e: 2340, l: '' }, { e: 2297, l: 'Genova' }
    ],
    'profile-d5': [
      { e: 2297, l: 'Genova' }, { e: 2100, l: '' }, { e: 1900, l: '' },
      { e: 1700, l: 'Longiarù' }, { e: 1550, l: '谷地' }, { e: 1500, l: 'Pescol' },
      { e: 1750, l: '峽谷' }, { e: 1950, l: '高原' }, { e: 2050, l: 'Gardenacia' }
    ],
    'profile-d6': [
      { e: 2298, l: 'Dantercepies' }, { e: 2350, l: '' }, { e: 2420, l: 'VF 起點' },
      { e: 2520, l: '岩壁段' }, { e: 2592, l: 'Gran Cir' }, { e: 2520, l: '' },
      { e: 2420, l: '' }, { e: 2350, l: '' }, { e: 2298, l: '折返' }
    ]
  };

  function render(id, pts) {
    var el = document.getElementById(id);
    if (!el) return;
    var W = 640, H = 168, pL = 34, pR = 10, pT = 20, pB = 30;
    var es = pts.map(function (p) { return p.e; });
    var min = Math.min.apply(null, es), max = Math.max.apply(null, es);
    var span = Math.max(max - min, 120);
    var lo = min - (span - (max - min)) / 2;
    function X(i) { return pL + (W - pL - pR) * i / (pts.length - 1); }
    function Y(e) { return pT + (H - pT - pB) * (1 - (e - lo) / span); }
    var line = pts.map(function (p, i) { return X(i).toFixed(1) + ',' + Y(p.e).toFixed(1); }).join(' ');
    var area = pL + ',' + (H - pB) + ' ' + line + ' ' + (W - pR) + ',' + (H - pB);
    var s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="爬升剖面示意圖">';
    // gridlines + axis labels
    [max, min].forEach(function (v) {
      s += '<line x1="' + pL + '" y1="' + Y(v).toFixed(1) + '" x2="' + (W - pR) + '" y2="' + Y(v).toFixed(1) + '" stroke="#d8d2c2" stroke-dasharray="4,4"/>';
      s += '<text x="' + (pL - 4) + '" y="' + (Y(v) + 4).toFixed(1) + '" font-size="10" fill="#a09a8a" text-anchor="end">' + v.toLocaleString() + 'm</text>';
    });
    s += '<polygon points="' + area + '" fill="#2f5d50" opacity="0.12"/>';
    s += '<polyline points="' + line + '" fill="none" stroke="#2f5d50" stroke-width="2.5" stroke-linejoin="round"/>';
    var maxI = es.indexOf(max);
    pts.forEach(function (p, i) {
      var cx = X(i), cy = Y(p.e);
      if (p.l) {
        s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="3.5" fill="#2f5d50"/>';
        var anchor = i === 0 ? 'start' : (i === pts.length - 1 ? 'end' : 'middle');
        s += '<text x="' + cx.toFixed(1) + '" y="' + (cy - 8).toFixed(1) + '" font-size="11" fill="#6f6a5e" text-anchor="' + anchor + '">' + p.l + '</text>';
      }
      if (i === maxI) {
        s += '<text x="' + cx.toFixed(1) + '" y="' + (cy - 22).toFixed(1) + '" font-size="11" font-weight="700" fill="#2f5d50" text-anchor="middle">' + max.toLocaleString() + 'm</text>';
      }
    });
    s += '</svg>';
    el.innerHTML = s;
  }

  Object.keys(PROFILES).forEach(function (id) { render(id, PROFILES[id]); });
})();
