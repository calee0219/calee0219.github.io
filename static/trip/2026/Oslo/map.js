(function() {
  'use strict';

  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  const map = L.map('leafletMap', { scrollWheelZoom: false }).setView([59.911, 10.738], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const dayColors = { 1: '#c0392b', 2: '#2c5d8f', 3: '#1f8a70' };

  // ===== Stops =====
  const stops = [
    // Day 1 — Central landmarks loop
    { id: '1', day: 1, lat: 59.9106, lng: 10.7525, highlight: false,
      zh: 'Oslo S 中央車站（起點）', en: 'Oslo Central Station (Start)', dzh: '機場快線 Flytoget 抵達點', den: 'Arrival by Flytoget airport express' },
    { id: '2', day: 1, lat: 59.9127, lng: 10.7461, highlight: false,
      zh: 'Oslo 大教堂', en: 'Oslo Cathedral', dzh: '1697 年巴洛克主教座堂', den: '1697 baroque cathedral' },
    { id: '3', day: 1, lat: 59.9139, lng: 10.7374, highlight: true,
      zh: 'Karl Johans gate 大街', en: 'Karl Johans gate', dzh: '奧斯陸最熱鬧的步行大街', den: "Oslo's main pedestrian boulevard" },
    { id: '4', day: 1, lat: 59.9170, lng: 10.7277, highlight: true,
      zh: '皇宮 & 皇宮公園', en: 'Royal Palace & Park', dzh: '挪威王室官邸，13:30 衛兵交接', den: 'Royal residence, 13:30 guard change' },
    { id: '5', day: 1, lat: 59.9145, lng: 10.7331, highlight: false,
      zh: '國家劇院', en: 'National Theatre', dzh: '1899 年新巴洛克劇院', den: '1899 neo-baroque theatre' },
    { id: '6', day: 1, lat: 59.9120, lng: 10.7335, highlight: true,
      zh: '市政廳 Rådhuset', en: 'City Hall (Rådhuset)', dzh: '諾貝爾和平獎頒獎地', den: 'Nobel Peace Prize venue' },
    { id: '7', day: 1, lat: 59.9114, lng: 10.7290, highlight: false,
      zh: 'Aker Brygge 碼頭', en: 'Aker Brygge', dzh: '濱海餐廳與散步道', den: 'Waterfront promenade & dining' },
    { id: '8', day: 1, lat: 59.9066, lng: 10.7220, highlight: true,
      zh: 'Tjuvholmen & Astrup Fearnley', en: 'Tjuvholmen & Astrup Fearnley', dzh: '現代美術館與雕塑公園、海濱浴場', den: 'Modern art museum, sculpture park & beach' },
    { id: '9', day: 1, lat: 59.9075, lng: 10.7363, highlight: true,
      zh: 'Akershus 要塞', en: 'Akershus Fortress', dzh: '13 世紀中世紀城堡，免費入園', den: '13th-century medieval castle, free grounds' },
    { id: '10', day: 1, lat: 59.9075, lng: 10.7533, highlight: true,
      zh: '奧斯陸歌劇院（屋頂）', en: 'Oslo Opera House (roof)', dzh: '可步行登上斜面屋頂，峽灣全景', den: 'Walk up the sloping marble roof' },
    { id: '11', day: 1, lat: 59.9063, lng: 10.7556, highlight: false,
      zh: 'Munch 孟克美術館', en: 'MUNCH Museum', dzh: '《吶喊》原作收藏', den: "Home of Munch's 'The Scream'" },

    // Day 2 — Frogner / Vigeland + Grünerløkka
    { id: '12', day: 2, lat: 59.9270, lng: 10.7000, highlight: true,
      zh: 'Vigeland 雕塑公園', en: 'Vigeland Sculpture Park', dzh: '212 座銅鐵花崗岩雕塑、Monolith', den: '212 sculptures incl. the Monolith' },
    { id: '13', day: 2, lat: 59.9268, lng: 10.7045, highlight: false,
      zh: 'Frogner 公園 & 城市博物館', en: 'Frogner Park & City Museum', dzh: '公園綠地與奧斯陸城市博物館', den: 'Park greens & Oslo City Museum' },
    { id: '14', day: 2, lat: 59.9197, lng: 10.7186, highlight: false,
      zh: 'Bygdøy allé / Frogner 街區', en: 'Frogner District walk', dzh: '優雅街區與咖啡館', den: 'Elegant streets & cafés' },
    { id: '15', day: 2, lat: 59.9162, lng: 10.7333, highlight: true,
      zh: '國家博物館 Nasjonalmuseet', en: 'National Museum', dzh: '北歐最大藝術館，另一版《吶喊》', den: "Nordic's largest art museum" },
    { id: '16', day: 2, lat: 59.9233, lng: 10.7596, highlight: true,
      zh: 'Grünerløkka 文青街區', en: 'Grünerløkka', dzh: '時髦咖啡、二手店、街頭藝術', den: 'Hip cafés, vintage & street art' },
    { id: '17', day: 2, lat: 59.9265, lng: 10.7515, highlight: false,
      zh: 'Mathallen 美食廳 & Akerselva', en: 'Mathallen & Akerselva river', dzh: '室內美食市集、河岸步道', den: 'Indoor food hall & riverside walk' },

    // Day 3 — Fjord & Bygdøy
    { id: '18', day: 3, lat: 59.9018, lng: 10.7560, highlight: true,
      zh: 'Sørenga 海水泳池', en: 'Sørenga Seawater Pool', dzh: '峽灣海水泳池，晨間散步', den: 'Fjord seawater pool, morning stroll' },
    { id: '19', day: 3, lat: 59.9035, lng: 10.7480, highlight: false,
      zh: 'Vippa 美食市集', en: 'Vippa Food Hall', dzh: '濱海街頭美食市集', den: 'Waterfront street-food market' },
    { id: '20', day: 3, lat: 59.9090, lng: 10.7335, highlight: false,
      zh: 'City Hall Pier 3（渡輪碼頭）', en: 'City Hall Pier 3 (ferry)', dzh: '搭 #B10/B9 渡輪往 Bygdøy', den: 'Take ferry B10/B9 to Bygdøy' },
    { id: '21', day: 3, lat: 59.9056, lng: 10.6847, highlight: true,
      zh: 'Bygdøy 半島博物館群', en: 'Bygdøy Museums', dzh: 'Fram 極地船 / Kon-Tiki / 民俗博物館', den: 'Fram, Kon-Tiki & Folk Museum' },
    { id: '22', day: 3, lat: 59.9011, lng: 10.6840, highlight: false,
      zh: 'Huk 海灘', en: 'Huk Beach', dzh: '半島南端海灘，夏日戲水', den: 'Peninsula beach for summer swims' }
  ];

  // ===== Routes =====
  const routes = {
    1: [
      [59.9106,10.7525],[59.9127,10.7461],[59.9139,10.7374],[59.9170,10.7277],
      [59.9145,10.7331],[59.9120,10.7335],[59.9114,10.7290],[59.9066,10.7220],
      [59.9075,10.7363],[59.9075,10.7533],[59.9063,10.7556]
    ],
    2: [
      [59.9270,10.7000],[59.9268,10.7045],[59.9197,10.7186],[59.9162,10.7333],
      [59.9233,10.7596],[59.9265,10.7515]
    ],
    3: [
      [59.9018,10.7560],[59.9035,10.7480],[59.9090,10.7335]
    ]
  };
  const ferryDay3 = [[59.9090,10.7335],[59.9056,10.6847]];
  const bygdoyWalk = [[59.9056,10.6847],[59.9011,10.6840]];

  const layers = { 1: L.layerGroup(), 2: L.layerGroup(), 3: L.layerGroup() };

  // polylines
  L.polyline(routes[1], { color: dayColors[1], weight: 4, opacity: 0.85 }).addTo(layers[1]);
  L.polyline(routes[2], { color: dayColors[2], weight: 4, opacity: 0.85 }).addTo(layers[2]);
  L.polyline(routes[3], { color: dayColors[3], weight: 4, opacity: 0.85 }).addTo(layers[3]);
  L.polyline(ferryDay3, { color: dayColors[3], weight: 3, opacity: 0.7, dashArray: '8, 8' }).addTo(layers[3]);
  L.polyline(bygdoyWalk, { color: dayColors[3], weight: 4, opacity: 0.85 }).addTo(layers[3]);

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
    const nav = `<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=walking" target="_blank" style="font-size:11px;color:#2c5d8f;">📍 導航 / Directions</a>`;
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
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[1]};margin-right:6px;vertical-align:middle;"></span><span data-zh="Day 1 中心地標環線" data-en="Day 1 Central landmarks">Day 1 中心地標環線</span></div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[2]};margin-right:6px;vertical-align:middle;"></span><span data-zh="Day 2 Vigeland & Grünerløkka" data-en="Day 2 Vigeland & Grünerløkka">Day 2 Vigeland & Grünerløkka</span></div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[3]};margin-right:6px;vertical-align:middle;"></span><span data-zh="Day 3 峽灣 & Bygdøy" data-en="Day 3 Fjord & Bygdøy">Day 3 峽灣 & Bygdøy</span></div>
      <div><span style="display:inline-block;width:18px;height:0;border-top:3px dashed #666;margin-right:6px;vertical-align:middle;"></span><span data-zh="渡輪" data-en="Ferry">渡輪</span></div>
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
})();
