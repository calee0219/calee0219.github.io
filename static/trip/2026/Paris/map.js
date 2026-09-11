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
      { id: '2', name: { zh: 'Hotel Elysa-Luxembourg', en: 'Hotel Elysa-Luxembourg' }, desc: { zh: '入住放行李 · 6 Rue Gay Lussac、5 區', en: 'Check in, drop bags · 6 Rue Gay Lussac, 5th arr.' }, lat: 48.8462, lng: 2.3422, time: '23:45', stay: true },
      { id: '3', name: { zh: 'Les Éditeurs 深夜食堂', en: 'Les Éditeurs late supper' }, desc: { zh: '開到 02:00 · 農家烤雞／紅酒燉牛肉', en: 'Open till 02:00 · roast chicken / beef braised in wine' }, lat: 48.8507, lng: 2.3372, time: '~00:00', meal: true }
    ],
    2: [
      { id: 'A0', name: { zh: "La Maison d'Isabelle 早餐", en: "La Maison d'Isabelle breakfast" }, desc: { zh: '2018 巴黎最佳可頌 · 06:00 開 · 外帶直奔 BnF', en: 'Best croissant Paris 2018 · open 06:00 · takeaway to the BnF' }, lat: 48.8523, lng: 2.3455, time: '09:10', meal: true },
      { id: 'A', name: { zh: 'BnF 黎塞留館', en: 'BnF Richelieu' }, desc: { zh: '研究員閱覽室 · 免費 · 10:00', en: 'Researchers-only reading rooms · free · 10:00' }, lat: 48.86702, lng: 2.33892, time: '10:00', highlight: true },
      { id: 'B0', name: { zh: 'Stohrer 最老甜點店', en: 'Stohrer (oldest pâtisserie)' }, desc: { zh: 'baba au rhum · 外帶 · ~11:40', en: 'baba au rhum · takeaway · ~11:40' }, lat: 48.8639, lng: 2.3417, time: '~11:40', meal: true },
      { id: 'B', name: { zh: 'Maison Rostang 午餐（已訂位）', en: 'Maison Rostang lunch (booked)' }, desc: { zh: '二星 · 12:15 · 2 位 · €85–105', en: '2 stars · 12:15 · 2 guests · €85–105' }, lat: 48.88143, lng: 2.2985, time: '12:15', meal: true },
      { id: 'C', name: { zh: '古監獄 Conciergerie', en: 'Conciergerie' }, desc: { zh: '中世紀王宮監獄 · 免費 · 15:00', en: 'Medieval palace-prison · free · 15:00' }, lat: 48.85608, lng: 2.34615, time: '15:00', highlight: true },
      { id: 'C2', name: { zh: 'Marais 甜點三選一（選擇性）', en: 'Marais desserts, pick one (optional)' }, desc: { zh: "Brigat'／Christophe Louie／Yann Couvreur · ~16:30", en: "Brigat' / Christophe Louie / Yann Couvreur · ~16:30" }, lat: 48.8590, lng: 2.3620, time: '~16:30', meal: true, optional: true },
      { id: 'D', name: { zh: '巴黎聖母院', en: 'Notre-Dame de Paris' }, desc: { zh: '免費 · 18:00 預約時段', en: 'Free · 18:00 reserved slot' }, lat: 48.8530, lng: 2.3499, time: '18:00', highlight: true },
      { id: 'E0', name: { zh: '塞納河日落散步', en: 'Seine sunset stroll' }, desc: { zh: 'Square du Vert-Galant · 18:45–20:00', en: 'Square du Vert-Galant · 18:45–20:00' }, lat: 48.8574, lng: 2.3424, time: '18:45' },
      { id: 'E', name: { zh: 'Semilla 晚餐（已訂位）', en: 'Semilla dinner (booked)' }, desc: { zh: '現代法式 · 20:30 · 2 位 · 已訂位', en: 'Modern French · 20:30 · 2 guests · booked' }, lat: 48.8536, lng: 2.3357, time: '20:30', meal: true },
      { id: 'F', name: { zh: '回旅館', en: 'Back to hotel' }, desc: { zh: 'Hotel Elysa-Luxembourg', en: 'Hotel Elysa-Luxembourg' }, lat: 48.8462, lng: 2.3422, time: '22:30', stay: true }
    ],
    3: [
      { id: 'A0', name: { zh: 'Maison Mulot 早餐', en: 'Maison Mulot breakfast' }, desc: { zh: '週日 07:00 開 · 6 區老字號 · 外帶直奔榮軍院', en: 'Open Sun from 07:00 · 6th-arr. institution · takeaway to the Invalides' }, lat: 48.8532, lng: 2.3368, time: '09:00', meal: true },
      { id: 'A', name: { zh: '榮軍院 Invalides', en: 'Invalides' }, desc: { zh: 'Grand Salon · 免費 · 10:00', en: 'Grand Salon · free · 10:00' }, lat: 48.85707, lng: 2.31276, time: '10:00', highlight: true },
      { id: 'B', name: { zh: '榮譽軍團宮', en: 'Hôtel de Salm' }, desc: { zh: '大法官官邸 · 免費 · 11:30', en: "Grand Chancellor's residence · free · 11:30" }, lat: 48.85999, lng: 2.32444, time: '11:30', highlight: true },
      { id: 'C', name: { zh: 'Chez Fernand Christine', en: 'Chez Fernand Christine' }, desc: { zh: '紅酒燉雞 · 12:30', en: 'Coq au vin · 12:30' }, lat: 48.8551, lng: 2.3390, time: '12:30', meal: true },
      { id: 'D', name: { zh: '巴黎美術學院', en: 'Beaux-Arts de Paris' }, desc: { zh: '免費 · 導覽 14:30', en: 'Free · tour 14:30' }, lat: 48.85408, lng: 2.33313, time: '14:20', highlight: true },
      { id: 'D2', name: { zh: 'Pierre Hermé 馬卡龍', en: 'Pierre Hermé macarons' }, desc: { zh: '72 Rue Bonaparte · 週日 10:00–19:00', en: '72 Rue Bonaparte · Sun 10:00–19:00' }, lat: 48.8520, lng: 2.3325, time: '~15:50', meal: true },
      { id: 'E', name: { zh: '參議院（選擇性）', en: 'Sénat (optional)' }, desc: { zh: '盧森堡宮 · 免費 · 視排隊', en: 'Palais du Luxembourg · free · if queue allows' }, lat: 48.84915, lng: 2.33865, time: '16:15', optional: true },
      { id: 'F', name: { zh: '回旅館取行李', en: 'Back to hotel for luggage' }, desc: { zh: 'Hotel Elysa-Luxembourg · 18:45', en: 'Hotel Elysa-Luxembourg · 18:45' }, lat: 48.8462, lng: 2.3422, time: '18:45', stay: true },
      { id: 'G', name: { zh: '巴黎北站 返程', en: 'Gare du Nord (Return)' }, desc: { zh: '21:02 歐洲之星發車', en: '21:02 Eurostar departure' }, lat: 48.8809, lng: 2.3553, time: '21:02' }
    ]
  };

  // ===== ROUTE POLYLINES (ordered walking/metro paths) =====
  const routesByDay = {
    1: [[48.8809, 2.3553], [48.8462, 2.3422], [48.8507, 2.3372]],
    2: [
      [48.8462, 2.3422], [48.8523, 2.3455], [48.86702, 2.33892], [48.8639, 2.3417],
      [48.88143, 2.2985], [48.85608, 2.34615], [48.8590, 2.3620], [48.8530, 2.3499], [48.8574, 2.3424], [48.8536, 2.3357], [48.8462, 2.3422]
    ],
    3: [
      [48.8462, 2.3422], [48.8532, 2.3368], [48.85707, 2.31276], [48.85999, 2.32444], [48.8551, 2.3390],
      [48.85408, 2.33313], [48.8520, 2.3325], [48.84915, 2.33865], [48.8462, 2.3422], [48.8809, 2.3553]
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
    const L4 = lang === 'en' ? 'Optional' : '選擇性';
    const L5 = lang === 'en' ? 'Hotel' : '住宿';
    div.innerHTML = `
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#b8860b;margin-right:6px;vertical-align:middle;"></span>${L1}</div>
      <div><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#2f8f5b;margin-right:6px;vertical-align:middle;"></span>${L2}</div>
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
