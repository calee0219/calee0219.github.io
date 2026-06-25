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
      { id: 'A', name: { zh: '橘園美術館', en: "Musée de l'Orangerie" }, desc: { zh: '莫內睡蓮 · 1–1.5h', en: 'Monet Water Lilies · 1–1.5h' }, lat: 48.8638, lng: 2.3226, time: '09:00', highlight: true },
      { id: 'B', name: { zh: '杜樂麗花園', en: 'Jardin des Tuileries' }, desc: { zh: '散步 · 30–40 min', en: 'Stroll · 30–40 min' }, lat: 48.8634, lng: 2.3275, time: '10:30' },
      { id: 'C', name: { zh: 'Restaurant Kei ⭐⭐⭐', en: 'Restaurant Kei ⭐⭐⭐' }, desc: { zh: '米其林三星午餐', en: '3-star Michelin lunch' }, lat: 48.8639, lng: 2.3417, time: '12:30', meal: true, highlight: true },
      { id: 'D', name: { zh: '奧賽美術館', en: "Musée d'Orsay" }, desc: { zh: '印象派 · 2h', en: 'Impressionism · 2h' }, lat: 48.8600, lng: 2.3266, time: '15:30', highlight: true },
      { id: 'E', name: { zh: '巴黎聖母院', en: 'Notre-Dame de Paris' }, desc: { zh: '哥德教堂 · 重新開放 · 45min', en: 'Reopened Gothic cathedral · 45min' }, lat: 48.8530, lng: 2.3499, time: '18:00', highlight: true },
      { id: 'F0', name: { zh: 'Les Deux Palais 輕食', en: 'Les Deux Palais bite' }, desc: { zh: '音樂會前 · 選擇性', en: 'Pre-concert · optional' }, lat: 48.8556, lng: 2.3447, time: '18:50', optional: true },
      { id: 'G', name: { zh: '聖禮拜堂音樂會', en: 'Sainte-Chapelle concert' }, desc: { zh: '燭光古典樂 · 1h', en: 'Candlelit classical · 1h' }, lat: 48.8554, lng: 2.3450, time: '19:00', music: true },
      { id: 'H', name: { zh: '回旅館', en: 'Back to hotel' }, desc: { zh: 'Hotel Elysa-Luxembourg · M4/RER B 一站', en: 'Hotel Elysa-Luxembourg · M4/RER B one stop' }, lat: 48.8462, lng: 2.3422, time: '22:30', stay: true }
    ],
    3: [
      { id: 'A', name: { zh: '羅丹美術館', en: 'Musée Rodin' }, desc: { zh: '玫瑰花園 · 1.5h', en: 'Rose garden · 1.5h' }, lat: 48.8553, lng: 2.3158, time: '09:30', highlight: true },
      { id: 'B', name: { zh: 'Chez Fernand 午餐', en: 'Chez Fernand lunch' }, desc: { zh: '紅酒燉雞 · 1.5h', en: 'Coq au vin · 1.5h' }, lat: 48.8551, lng: 2.3390, time: '12:30', meal: true },
      { id: 'C1', name: { zh: '瑪黑區（選項 A）', en: 'Le Marais (Option A)' }, desc: { zh: '孚日廣場 · 選擇性', en: 'Place des Vosges · optional' }, lat: 48.8554, lng: 2.3655, time: '14:15', optional: true },
      { id: 'C2', name: { zh: '瑪摩丹莫內（選項 B）', en: 'Marmottan Monet (Option B)' }, desc: { zh: '印象·日出 · 選擇性', en: 'Impression, Sunrise · optional' }, lat: 48.8593, lng: 2.2670, time: '14:15', optional: true },
      { id: 'C3', name: { zh: '加尼葉歌劇院（選項 C）', en: 'Palais Garnier (Option C)' }, desc: { zh: '夏卡爾天頂 · 選擇性', en: 'Chagall ceiling · optional' }, lat: 48.8719, lng: 2.3316, time: '14:15', optional: true },
      { id: 'D', name: { zh: '回旅館取行李', en: 'Back to hotel for luggage' }, desc: { zh: 'Hotel Elysa-Luxembourg · 取寄放行李', en: 'Hotel Elysa-Luxembourg · collect luggage' }, lat: 48.8462, lng: 2.3422, time: '18:45', stay: true },
      { id: 'E', name: { zh: '巴黎北站 返程', en: 'Gare du Nord (Return)' }, desc: { zh: '21:02 歐洲之星發車', en: '21:02 Eurostar departure' }, lat: 48.8809, lng: 2.3553, time: '21:02' }
    ]
  };

  // ===== ROUTE POLYLINES (ordered walking/metro paths) =====
  const routesByDay = {
    1: [[48.8809, 2.3553], [48.8800, 2.3573], [48.8462, 2.3422]],
    2: [
      [48.8638, 2.3226], [48.8634, 2.3275], [48.8639, 2.3417],
      [48.8600, 2.3266], [48.8530, 2.3499], [48.8556, 2.3447], [48.8554, 2.3450], [48.8462, 2.3422]
    ],
    3: [
      [48.8553, 2.3158], [48.8551, 2.3390], [48.8554, 2.3655], [48.8462, 2.3422], [48.8809, 2.3553]
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
