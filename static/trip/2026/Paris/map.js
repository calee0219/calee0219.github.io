// ===== Paris Route Map with Leaflet + OpenStreetMap =====
(function() {
  'use strict';
  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  const map = L.map('leafletMap', { scrollWheelZoom: false }).setView([48.862, 2.337], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const dayColors = { 1: '#c0563f', 2: '#b8860b', 3: '#5b6ee1' };

  // ===== STOP DEFINITIONS =====
  const stopsByDay = {
    1: [
      { id: '1', name: { zh: '巴黎北站 抵達', en: 'Gare du Nord (Arrival)' }, desc: { zh: '22:29 歐洲之星抵達', en: '22:29 Eurostar arrival' }, lat: 48.8809, lng: 2.3553, time: '22:29' },
      { id: '2', name: { zh: 'Terminus Nord 宵夜', en: 'Terminus Nord supper' }, desc: { zh: '車站對面 brasserie', en: 'Brasserie opposite station' }, lat: 48.8800, lng: 2.3573, time: '22:45', meal: true },
      { id: '3', name: { zh: 'Hotel Elysa-Luxembourg', en: 'Hotel Elysa-Luxembourg' }, desc: { zh: '入住 · 6 Rue Gay Lussac、5 區', en: 'Check in · 6 Rue Gay Lussac, 5th arr.' }, lat: 48.8462, lng: 2.3422, time: '23:45', stay: true }
    ],
    2: [
      { id: 'A', name: { zh: 'BnF 黎塞留館', en: 'BnF Richelieu' }, desc: { zh: '研究員閱覽室 · 免費 · 10:00', en: 'Researchers-only reading rooms · free · 10:00' }, lat: 48.86702, lng: 2.33892, time: '10:00', highlight: true },
      { id: 'B', name: { zh: 'Restaurant Kei ⭐⭐⭐', en: 'Restaurant Kei ⭐⭐⭐' }, desc: { zh: '米其林三星午餐 · 待確認', en: '3-star Michelin lunch · pending' }, lat: 48.8639, lng: 2.3417, time: '12:30', meal: true, highlight: true },
      { id: 'C', name: { zh: '古監獄 Conciergerie', en: 'Conciergerie' }, desc: { zh: '中世紀王宮監獄 · 免費 · 15:00', en: 'Medieval palace-prison · free · 15:00' }, lat: 48.85608, lng: 2.34615, time: '15:00', highlight: true },
      { id: 'D', name: { zh: '巴黎聖母院', en: 'Notre-Dame de Paris' }, desc: { zh: '免費 · 18:00 預約時段', en: 'Free · 18:00 reserved slot' }, lat: 48.8530, lng: 2.3499, time: '18:00', highlight: true },
      { id: 'E0', name: { zh: 'Les Deux Palais 輕食', en: 'Les Deux Palais bite' }, desc: { zh: '音樂會前 · 選擇性', en: 'Pre-concert · optional' }, lat: 48.8556, lng: 2.3447, time: '18:50', optional: true },
      { id: 'E', name: { zh: '燭光音樂會（待選）', en: 'Candlelit concert (TBD)' }, desc: { zh: 'Sainte-Chapelle / St-Germain · 晚間', en: 'Sainte-Chapelle / St-Germain · evening' }, lat: 48.8554, lng: 2.3450, time: '20:00', music: true },
      { id: 'F', name: { zh: '回旅館', en: 'Back to hotel' }, desc: { zh: 'Hotel Elysa-Luxembourg', en: 'Hotel Elysa-Luxembourg' }, lat: 48.8462, lng: 2.3422, time: '22:30', stay: true }
    ],
    3: [
      { id: 'A', name: { zh: '榮軍院 Invalides', en: 'Invalides' }, desc: { zh: 'Grand Salon · 免費 · 10:00', en: 'Grand Salon · free · 10:00' }, lat: 48.85707, lng: 2.31276, time: '10:00', highlight: true },
      { id: 'B', name: { zh: '榮譽軍團宮', en: 'Hôtel de Salm' }, desc: { zh: '大法官官邸 · 免費 · 11:30', en: "Grand Chancellor's residence · free · 11:30" }, lat: 48.85999, lng: 2.32444, time: '11:30', highlight: true },
      { id: 'C', name: { zh: 'Chez Fernand Christine', en: 'Chez Fernand Christine' }, desc: { zh: '紅酒燉雞 · 12:30', en: 'Coq au vin · 12:30' }, lat: 48.8551, lng: 2.3390, time: '12:30', meal: true },
      { id: 'D', name: { zh: '巴黎美術學院', en: 'Beaux-Arts de Paris' }, desc: { zh: '免費 · 導覽 14:30', en: 'Free · tour 14:30' }, lat: 48.85408, lng: 2.33313, time: '14:20', highlight: true },
      { id: 'E', name: { zh: '參議院（選擇性）', en: 'Sénat (optional)' }, desc: { zh: '盧森堡宮 · 免費 · 視排隊', en: 'Palais du Luxembourg · free · if queue allows' }, lat: 48.84915, lng: 2.33865, time: '16:15', optional: true },
      { id: 'F', name: { zh: '回旅館取行李', en: 'Back to hotel for luggage' }, desc: { zh: 'Hotel Elysa-Luxembourg · 18:45', en: 'Hotel Elysa-Luxembourg · 18:45' }, lat: 48.8462, lng: 2.3422, time: '18:45', stay: true },
      { id: 'G', name: { zh: '巴黎北站 返程', en: 'Gare du Nord (Return)' }, desc: { zh: '21:02 歐洲之星發車', en: '21:02 Eurostar departure' }, lat: 48.8809, lng: 2.3553, time: '21:02' }
    ]
  };

  // ===== ROUTE POLYLINES (ordered walking/metro paths) =====
  const routesByDay = {
    1: [[48.8809, 2.3553], [48.8800, 2.3573], [48.8462, 2.3422]],
    2: [
      [48.8462, 2.3422], [48.86702, 2.33892], [48.8639, 2.3417],
      [48.85608, 2.34615], [48.8530, 2.3499], [48.8556, 2.3447], [48.8554, 2.3450], [48.8462, 2.3422]
    ],
    3: [
      [48.8462, 2.3422], [48.85707, 2.31276], [48.85999, 2.32444], [48.8551, 2.3390],
      [48.85408, 2.33313], [48.84915, 2.33865], [48.8462, 2.3422], [48.8809, 2.3553]
    ]
  };

  let drawnLayers = [];
  function clearMap() { drawnLayers.forEach(l => map.removeLayer(l)); drawnLayers = []; }

  function getLang() { return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh'; }

  function createMarkerIcon(label, color) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background:${color};color:#fff;width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;"><span style="transform:rotate(45deg);">${label}</span></div>`,
      iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -28]
    });
  }

  function drawPlan(day) {
    clearMap();
    const lang = getLang();
    const stops = stopsByDay[day];
    const color = dayColors[day];

    // polyline
    const route = routesByDay[day];
    if (route && route.length > 1) {
      drawnLayers.push(L.polyline(route, { color: color, weight: 4, opacity: 0.75 }).addTo(map));
    }

    stops.forEach(stop => {
      const mColor = stop.optional ? '#d98a2b' : (stop.music ? '#5b6ee1' : (stop.meal ? '#2f8f5b' : (stop.stay ? '#8a5a9b' : color)));
      const marker = L.marker([stop.lat, stop.lng], { icon: createMarkerIcon(stop.id, mColor) }).addTo(map);
      drawnLayers.push(marker);
      const optTag = stop.optional ? (lang === 'en' ? ' <em style="color:#d98a2b">(optional)</em>' : ' <em style="color:#d98a2b">（選擇性）</em>') : '';
      const navLabel = lang === 'en' ? '📍 Navigate' : '📍 導航';
      const nav = `<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}" target="_blank" style="font-size:11px;color:#5b6ee1;">${navLabel}</a>`;
      marker.bindPopup(`
        <div style="font-family:'Source Serif 4','Noto Serif TC',serif;min-width:170px;">
          <strong style="font-size:14px;">${stop.id}. ${stop.name[lang]}</strong>${optTag}<br/>
          <span style="color:#b8860b;font-size:12px;font-weight:700;">⏰ ${stop.time}</span><br/>
          <span style="color:#666;font-size:12px;">${stop.desc[lang]}</span>
          ${nav}
        </div>`);
    });

    const allCoords = stops.map(s => [s.lat, s.lng]);
    map.fitBounds(allCoords, { padding: [50, 50], maxZoom: 15 });

    // legend
    if (!map.legendControl) {
      const legend = L.control({ position: 'bottomleft' });
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-legend');
        div.style.cssText = 'background:#fff;padding:9px 13px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);font-family:"Source Serif 4","Noto Serif TC",serif;font-size:12px;line-height:1.7;';
        div.id = 'mapLegend';
        return div;
      };
      legend.addTo(map);
      map.legendControl = legend;
    }
    updateLegend(lang);
  }

  function updateLegend(lang) {
    const div = document.getElementById('mapLegend');
    if (!div) return;
    const L1 = lang === 'en' ? 'Stop / route' : '景點 / 路線';
    const L2 = lang === 'en' ? 'Meal' : '餐飲';
    const L3 = lang === 'en' ? 'Concert' : '音樂會';
    const L4 = lang === 'en' ? 'Optional' : '選擇性';
    const L5 = lang === 'en' ? 'Hotel' : '住宿';
    div.innerHTML = `
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#b8860b;margin-right:6px;vertical-align:middle;"></span>${L1}</div>
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#2f8f5b;margin-right:6px;vertical-align:middle;"></span>${L2}</div>
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#5b6ee1;margin-right:6px;vertical-align:middle;"></span>${L3}</div>
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#d98a2b;margin-right:6px;vertical-align:middle;"></span>${L4}</div>
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#8a5a9b;margin-right:6px;vertical-align:middle;"></span>${L5}</div>`;
  }

  window.drawMapPlan = drawPlan;
  drawPlan(1);

  // Ensure tiles render correctly once the map container becomes visible / sized
  function refresh() { map.invalidateSize(); }
  window.addEventListener('load', function() { setTimeout(refresh, 200); });
  window.addEventListener('DOMContentLoaded', refresh);
  window.addEventListener('resize', refresh);
  if ('IntersectionObserver' in window) {
    const mo = new IntersectionObserver(function(entries) {
      entries.forEach(function(en) { if (en.isIntersecting) { setTimeout(refresh, 150); } });
    }, { threshold: 0.05 });
    mo.observe(mapContainer);
  }
  window.addEventListener('dayChanged', function(e) {
    setTimeout(function() { map.invalidateSize(); drawPlan(e.detail.day); }, 100);
  });
  window.addEventListener('langChanged', function() {
    const activeDay = parseInt(document.querySelector('.day-tab.active')?.getAttribute('data-day') || '1', 10);
    drawPlan(activeDay);
  });
})();
