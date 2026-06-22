(function() {
  'use strict';

  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  const map = L.map('leafletMap', { scrollWheelZoom: false }).setView([59.905, 10.730], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  // Day 1 = soft slate blue (city-calm), Day 2 = teal/green (islands), Day 3 = deep green (forest)
  const dayColors = { 1: '#2c5d8f', 2: '#1f8a70', 3: '#3a6b35' };

  // ===== Stops =====
  const stops = [
    // Day 1 — The quiet side of the city: water, fortress, opera roof
    { id: '1', day: 1, lat: 59.9106, lng: 10.7525, highlight: false,
      zh: 'Oslo S 中央車站（起點）', en: 'Oslo Central Station (Start)', dzh: '機場快線 Flytoget 抵達點', den: 'Arrival by Flytoget airport express' },
    { id: '2', day: 1, lat: 59.9127, lng: 10.7461, highlight: true,
      zh: '奧斯陸大教堂 & 三一教堂', en: 'Oslo Cathedral & Trinity Church', dzh: '1697 主教座堂 + 磚造三一教堂，舊城起點', den: '1697 cathedral + brick Trinity Church' },
    { id: '3', day: 1, lat: 59.9120, lng: 10.7335, highlight: true,
      zh: '市政廳 Rådhuset & 海濱', en: 'City Hall & waterfront', dzh: '諾貝爾和平獎頒獎地，走向峽灣', den: 'Nobel Peace Prize hall, toward the fjord' },
    { id: '4', day: 1, lat: 59.9075, lng: 10.7363, highlight: true,
      zh: 'Akershus 要塞草坡', en: 'Akershus Fortress lawns', dzh: '中世紀城堡草坡，峽灣靜望', den: 'Medieval ramparts, quiet fjord views' },
    { id: '5', day: 1, lat: 59.9075, lng: 10.7533, highlight: true,
      zh: '奧斯陸歌劇院（屋頂）', en: 'Oslo Opera House (roof)', dzh: '大理石斜面屋頂，留白與光線', den: 'Sloping marble roof, light & space' },
    { id: '6', day: 1, lat: 59.9018, lng: 10.7560, highlight: false,
      zh: 'Sørenga 海水泳池', en: 'Sørenga seawater pool', dzh: '峽灣海水泳池，傍晚靜水', den: 'Fjord seawater pool, calm evening' },
    { id: '7', day: 1, lat: 59.9063, lng: 10.7556, highlight: false,
      zh: 'Munch 孟克美術館（選擇性）', en: 'MUNCH Museum (optional)', dzh: '《吶喊》原作，時間夠再加', den: "Munch's 'Scream', only if time allows" },

    // Day 2 — Fjord island hopping (the archipelago day)
    { id: '8', day: 2, lat: 59.9090, lng: 10.7335, highlight: false,
      zh: '市政廳碼頭 Rådhusbrygge', en: 'City Hall Pier (Rådhusbrygge)', dzh: '島嶼渡輪起點，Ruter B1', den: 'Island ferry hub, Ruter line B1' },
    { id: '9', day: 2, lat: 59.8957, lng: 10.7245, highlight: true,
      zh: 'Hovedøya 島', en: 'Hovedøya island', dzh: '12 世紀修道院遺跡、林間步道、礁石游泳', den: '12th-c monastery ruins, trails & swimming' },
    { id: '10', day: 2, lat: 59.8836, lng: 10.7320, highlight: true,
      zh: 'Gressholmen / Rambergøya', en: 'Gressholmen / Rambergøya', dzh: '連島步道、1930 小酒館、自然保護區', den: 'Linked-island trails, 1930 tavern, reserve' },
    { id: '11', day: 2, lat: 59.8862, lng: 10.7360, highlight: false,
      zh: 'Heggholmen 燈塔', en: 'Heggholmen lighthouse', dzh: '內峽灣最古老燈塔之一', den: 'One of the oldest inner-fjord lighthouses' },
    { id: '12', day: 2, lat: 59.8920, lng: 10.7150, highlight: true,
      zh: 'Lindøya 彩色木屋島', en: 'Lindøya cabin island', dzh: '上百棟紅黃彩色夏季木屋', den: 'Hundreds of colourful summer cabins' },
    { id: '13', day: 2, lat: 59.8870, lng: 10.7060, highlight: false,
      zh: 'Nakholmen（選擇性）', en: 'Nakholmen (optional)', dzh: '跳水台、最佳天際線視角', den: 'Diving jetty, best skyline view' },

    // Day 3 — Forest & sculpture calm, then home
    { id: '14', day: 3, lat: 59.9270, lng: 10.7000, highlight: true,
      zh: 'Vigeland 雕塑公園', en: 'Vigeland Sculpture Park', dzh: '212 座雕塑，清晨人少最靜', den: '212 sculptures, quietest early morning' },
    { id: '15', day: 3, lat: 59.9268, lng: 10.7045, highlight: false,
      zh: 'Majorstuen（轉地鐵 1 號線）', en: 'Majorstuen (Metro line 1)', dzh: '搭 Holmenkollbanen 上山', den: 'Board the Holmenkollen metro line' },
    { id: '16', day: 3, lat: 59.9836, lng: 10.6790, highlight: true,
      zh: 'Frognerseteren 森林觀景', en: 'Frognerseteren forest view', dzh: '森林、湖泊與峽灣全景，城市即森林', den: 'Forest, lake & fjord panorama above Oslo' },
    { id: '17', day: 3, lat: 59.9639, lng: 10.6675, highlight: false,
      zh: 'Holmenkollen 跳台（選擇性）', en: 'Holmenkollen ski jump (optional)', dzh: '下山途中可停，眺望全城', den: 'Optional stop on the way down' },
    { id: '18', day: 3, lat: 59.9106, lng: 10.7525, highlight: false,
      zh: '返回 Oslo S · 機場快線', en: 'Back to Oslo S · airport express', dzh: '取行李，Flytoget 19 分鐘往機場', den: 'Collect bags, Flytoget 19 min to OSL' }
  ];

  // ===== Routes =====
  const routes = {
    1: [
      [59.9106,10.7525],[59.9127,10.7461],[59.9120,10.7335],[59.9075,10.7363],
      [59.9075,10.7533],[59.9018,10.7560],[59.9063,10.7556]
    ],
    // Day 2 walking-on-island segments are tiny; the day is mostly ferry (drawn separately)
    2: [],
    3: [
      [59.9270,10.7000],[59.9268,10.7045]
    ]
  };

  // Ferry legs for Day 2 (dashed) — the heart of the island-hopping day
  const ferryDay2 = [
    [59.9090,10.7335],[59.8957,10.7245],[59.8836,10.7320],
    [59.8862,10.7360],[59.8920,10.7150],[59.8870,10.7060],[59.9090,10.7335]
  ];
  // Metro leg for Day 3 (dashed) up to the forest
  const metroDay3 = [[59.9268,10.7045],[59.9639,10.6675],[59.9836,10.6790]];
  const returnDay3 = [[59.9836,10.6790],[59.9106,10.7525]];

  const layers = { 1: L.layerGroup(), 2: L.layerGroup(), 3: L.layerGroup() };

  // polylines
  L.polyline(routes[1], { color: dayColors[1], weight: 4, opacity: 0.85 }).addTo(layers[1]);
  L.polyline(ferryDay2, { color: dayColors[2], weight: 3, opacity: 0.8, dashArray: '8, 8' }).addTo(layers[2]);
  L.polyline(routes[3], { color: dayColors[3], weight: 4, opacity: 0.85 }).addTo(layers[3]);
  L.polyline(metroDay3, { color: dayColors[3], weight: 3, opacity: 0.7, dashArray: '4, 8' }).addTo(layers[3]);
  L.polyline(returnDay3, { color: dayColors[3], weight: 2, opacity: 0.5, dashArray: '2, 10' }).addTo(layers[3]);

  function createMarkerIcon(label, day, isHighlight) {
    const color = dayColors[day] || '#15263b';
    const size = isHighlight ? 30 : 25;
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color};color:#fff;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${isHighlight?'12':'11'}px;font-family:'DM Sans',sans-serif;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);">${label}</div>`,
      iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -size/2]
    });
  }

  stops.forEach(stop => {
    const marker = L.marker([stop.lat, stop.lng], { icon: createMarkerIcon(stop.id, stop.day, stop.highlight) });
    const hl = stop.highlight ? ' ⭐' : '';
    const nav = `<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}" target="_blank" style="font-size:11px;color:#2c5d8f;">📍 導航 / Directions</a>`;
    marker.bindPopup(`
      <div style="font-family:'DM Sans','Noto Sans TC',sans-serif;min-width:170px;">
        <strong style="font-size:14px;">${stop.id}. <span data-zh="${stop.zh}" data-en="${stop.en}">${stop.zh}</span></strong>${hl}<br/>
        <span style="color:#666;font-size:12px;" data-zh="${stop.dzh}" data-en="${stop.den}">${stop.dzh}</span><br/>
        <span style="color:#999;font-size:11px;">Day ${stop.day}</span>${nav}
      </div>
    `);
    marker.addTo(layers[stop.day]);
  });

  layers[1].addTo(map); layers[2].addTo(map); layers[3].addTo(map);

  // legend
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.style.cssText = 'background:white;padding:10px 14px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-family:"DM Sans","Noto Sans TC",sans-serif;font-size:11px;line-height:2;';
    div.innerHTML = `
      <div style="font-weight:600;margin-bottom:4px;">Route Legend</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[1]};margin-right:6px;vertical-align:middle;"></span><span data-zh="Day 1 城市的安靜面" data-en="Day 1 The quiet city">Day 1 城市的安靜面</span></div>
      <div><span style="display:inline-block;width:18px;height:0;border-top:3px dashed ${dayColors[2]};margin-right:6px;vertical-align:middle;"></span><span data-zh="Day 2 峽灣跳島（渡輪）" data-en="Day 2 Island hopping (ferry)">Day 2 峽灣跳島（渡輪）</span></div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[3]};margin-right:6px;vertical-align:middle;"></span><span data-zh="Day 3 森林與雕塑" data-en="Day 3 Forest & sculpture">Day 3 森林與雕塑</span></div>
    `;
    return div;
  };
  legend.addTo(map);

  // fit
  const allCoords = stops.map(s => [s.lat, s.lng]);
  map.fitBounds(allCoords, { padding: [40, 40] });

  // ===== Day filter buttons =====
  const filterBtns = document.querySelectorAll('.day-filter-btn');
  function applyFilter(day) {
    [1,2,3].forEach(d => {
      if (day === 'all' || String(day) === String(d)) {
        if (!map.hasLayer(layers[d])) layers[d].addTo(map);
      } else {
        if (map.hasLayer(layers[d])) map.removeLayer(layers[d]);
      }
    });
    let coords;
    if (day === 'all') coords = allCoords;
    else coords = stops.filter(s => String(s.day) === String(day)).map(s => [s.lat, s.lng]);
    if (coords.length) map.fitBounds(coords, { padding: [40, 40] });
  }
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.day);
    });
  });

  // ===== Coffee walk map =====
  const coffeeContainer = document.getElementById('coffeeMap');
  if (coffeeContainer) {
    const cafes = [
      { id: 'M', lat: 59.9233, lng: 10.7506, route: true, zh: 'Mathallen 美食廳（起點）', en: 'Mathallen Food Hall (start)' },
      { id: '1', lat: 59.9255, lng: 10.7560, route: true, zh: 'Tim Wendelboe', en: 'Tim Wendelboe' },
      { id: '2', lat: 59.9236, lng: 10.7588, route: true, zh: 'Supreme Roastworks', en: 'Supreme Roastworks' },
      { id: '3', lat: 59.9268, lng: 10.7575, route: true, zh: 'Kuro Oslo', en: 'Kuro Oslo' },
      { id: 'F', lat: 59.9183, lng: 10.7376, route: false, zh: 'Fuglen（市中心）', en: 'Fuglen (centre)' },
      { id: 'J', lat: 59.9281, lng: 10.7370, route: false, zh: 'Java / Mocca（St. Hanshaugen）', en: 'Java / Mocca (St. Hanshaugen)' }
    ];
    const cmap = L.map('coffeeMap', { scrollWheelZoom: false }).setView([59.924, 10.752], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(cmap);
    const brown = '#8a5a2b';
    const cafeIcon = (label, onRoute) => L.divIcon({
      className: 'coffee-marker',
      html: `<div style="background:${onRoute ? brown : '#b9986a'};color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font:600 11px 'DM Sans',sans-serif;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.3);">${label}</div>`,
      iconSize: [24, 24], iconAnchor: [12, 12]
    });
    cafes.forEach(c => {
      L.marker([c.lat, c.lng], { icon: cafeIcon(c.id, c.route) })
        .bindPopup(`<div style="font-family:'DM Sans','Noto Sans TC',sans-serif;"><strong data-zh="${c.zh}" data-en="${c.en}">${c.zh}</strong></div>`)
        .addTo(cmap);
    });
    // Walking route: Mathallen -> Tim Wendelboe -> Supreme -> Kuro
    const walkPath = [
      [59.9233, 10.7506], [59.9255, 10.7560], [59.9236, 10.7588], [59.9268, 10.7575]
    ];
    L.polyline(walkPath, { color: brown, weight: 4, dashArray: '8,8', opacity: 0.85 }).addTo(cmap);
    cmap.fitBounds(cafes.map(c => [c.lat, c.lng]), { padding: [40, 40] });
  }
})();
