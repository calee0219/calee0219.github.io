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
