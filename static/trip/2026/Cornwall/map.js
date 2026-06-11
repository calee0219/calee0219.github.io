// ===== Cornwall Route Map with Leaflet =====
(function() {
  'use strict';

  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  // Initialize map centered on Cornwall
  const map = L.map('leafletMap', {
    scrollWheelZoom: false
  }).setView([50.5, -4.8], 8);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Current plan state
  let currentPlan = '2day';

  // ===== STOP DEFINITIONS =====
  const allStops = {
    '2day': [
      { id: 'A', name: 'London', desc: '06:00 出發', lat: 51.5074, lng: -0.1278, day: 1, time: '06:00' },
      { id: 'B', name: 'Eden Project', desc: '10:30-13:30 · 3h', lat: 50.3601, lng: -4.7447, day: 1, time: '10:30-13:30', highlight: true },
      { id: 'C', name: 'Lost Gardens of Heligan', desc: '14:00-16:00 · 選擇性', lat: 50.2892, lng: -4.7969, day: 1, time: '14:00-16:00', optional: true },
      { id: 'D', name: 'Charlestown', desc: '16:30-17:30 · 漁港散步', lat: 50.3295, lng: -4.7570, day: 1, time: '16:30-17:30' },
      { id: 'E', name: 'St Austell (住宿)', desc: '18:00 Check-in', lat: 50.3440, lng: -4.7900, day: 1, time: '18:00' },
      { id: 'F', name: 'Minack Theatre', desc: '08:45-09:45 · 1h', lat: 50.0420, lng: -5.6530, day: 2, time: '08:45-09:45', highlight: true },
      { id: 'G', name: 'St Ives', desc: '10:15-12:15 · 2h', lat: 50.2112, lng: -5.4810, day: 2, time: '10:15-12:15', highlight: true },
      { id: 'H', name: "St Michael's Mount", desc: '13:00-15:00 · 配合低潮', lat: 50.1172, lng: -5.4776, day: 2, time: '13:00-15:00', highlight: true },
      { id: 'I', name: 'London (回程)', desc: '~21:00 抵達', lat: 51.5074, lng: -0.1278, day: 2, time: '15:30-21:00' }
    ],
    '3day': [
      { id: 'A', name: 'London', desc: '06:00 出發', lat: 51.5074, lng: -0.1278, day: 1, time: '06:00' },
      { id: 'B', name: 'Eden Project', desc: '10:30-14:00 · 3.5h', lat: 50.3601, lng: -4.7447, day: 1, time: '10:30-14:00', highlight: true },
      { id: 'C', name: 'Lost Gardens of Heligan', desc: '14:30-16:00 · 1.5h', lat: 50.2892, lng: -4.7969, day: 1, time: '14:30-16:00' },
      { id: 'D', name: 'Charlestown', desc: '16:30-18:00 · 漁港晚餐', lat: 50.3295, lng: -4.7570, day: 1, time: '16:30-18:00' },
      { id: 'E', name: 'St Austell (住宿)', desc: 'Day 1 住宿', lat: 50.3440, lng: -4.7900, day: 1, time: '18:30' },
      { id: 'F', name: 'Minack Theatre', desc: '09:00-10:00 · 1h', lat: 50.0420, lng: -5.6530, day: 2, time: '09:00-10:00', highlight: true },
      { id: 'G', name: "Land's End", desc: '10:15-10:45 · 選擇性', lat: 50.0659, lng: -5.7128, day: 2, time: '10:15-10:45', optional: true },
      { id: 'H', name: 'St Ives', desc: '11:15-13:30 · 2h+', lat: 50.2112, lng: -5.4810, day: 2, time: '11:15-13:30', highlight: true },
      { id: 'I', name: 'Kynance Cove / Lizard', desc: '14:30-16:00 · 選擇性', lat: 49.9743, lng: -5.2315, day: 2, time: '14:30-16:00', optional: true },
      { id: 'J', name: 'Penzance (住宿)', desc: 'Day 2 住宿 + 藍眼淚', lat: 50.1185, lng: -5.5371, day: 2, time: '19:00' },
      { id: 'K', name: "St Michael's Mount", desc: '08:30-11:00 · 2.5h 城堡開放', lat: 50.1172, lng: -5.4776, day: 3, time: '08:30-11:00', highlight: true },
      { id: 'L', name: 'Glastonbury Tor', desc: '13:30-15:00 · 1.5h', lat: 51.1442, lng: -2.6987, day: 3, time: '13:30-15:00', highlight: true },
      { id: 'M', name: 'Glastonbury Abbey', desc: '15:15-16:30 · 午餐', lat: 51.1475, lng: -2.7139, day: 3, time: '15:15-16:30' },
      { id: 'N', name: 'London (回程)', desc: '~19:00 抵達', lat: 51.5074, lng: -0.1278, day: 3, time: '16:30-19:00' }
    ]
  };

  // Sea Sparkle locations (shown in both plans)
  const seaSparkleSpots = [
    { name: 'Grebe Beach (Sea Sparkle)', lat: 50.0920, lng: -5.1150, desc: '最推薦觀賞點' },
    { name: 'Gannel Estuary (Sea Sparkle)', lat: 50.4100, lng: -5.0900, desc: '穩定觀測點' },
    { name: 'Kynance Cove (Sea Sparkle)', lat: 49.9743, lng: -5.2315, desc: '2025年觀測紀錄' }
  ];

  // Rest stops
  const restStops = [
    { name: 'Exeter Services (M5)', lat: 50.7260, lng: -3.4700, day: 1 }
  ];

  // ===== ROUTE POLYLINES =====
  const routes = {
    '2day': {
      day1: [
        [51.5074, -0.1278], // London
        [51.40, -0.30],
        [51.45, -0.80],
        [51.50, -1.50],
        [51.55, -2.20],
        [51.45, -2.60],
        [51.20, -2.80],
        [50.95, -3.10],
        [50.7260, -3.4700], // Exeter Services
        [50.65, -3.70],
        [50.50, -4.20],
        [50.40, -4.60],
        [50.3601, -4.7447], // Eden Project
        [50.2892, -4.7969], // Heligan
        [50.3295, -4.7570], // Charlestown
        [50.3440, -4.7900], // St Austell
      ],
      day2: [
        [50.3440, -4.7900], // St Austell
        [50.25, -5.00],
        [50.15, -5.30],
        [50.08, -5.55],
        [50.0420, -5.6530], // Minack Theatre
        [50.10, -5.65],
        [50.15, -5.55],
        [50.2112, -5.4810], // St Ives
        [50.18, -5.45],
        [50.1172, -5.4776], // St Michael's Mount
      ],
      day2Return: [
        [50.1172, -5.4776], // St Michael's Mount
        [50.18, -5.20],
        [50.25, -5.00],
        [50.40, -4.60],
        [50.50, -4.20],
        [50.65, -3.70],
        [50.7260, -3.4700], // Exeter
        [50.95, -3.10],
        [51.20, -2.80],
        [51.45, -2.60],
        [51.50, -1.50],
        [51.5074, -0.1278], // London
      ]
    },
    '3day': {
      day1: [
        [51.5074, -0.1278], // London
        [51.40, -0.30],
        [51.45, -0.80],
        [51.50, -1.50],
        [51.55, -2.20],
        [51.45, -2.60],
        [51.20, -2.80],
        [50.95, -3.10],
        [50.7260, -3.4700], // Exeter
        [50.65, -3.70],
        [50.50, -4.20],
        [50.40, -4.60],
        [50.3601, -4.7447], // Eden Project
        [50.2892, -4.7969], // Heligan
        [50.3295, -4.7570], // Charlestown
        [50.3440, -4.7900], // St Austell
      ],
      day2: [
        [50.3440, -4.7900], // St Austell
        [50.25, -5.00],
        [50.15, -5.30],
        [50.08, -5.55],
        [50.0420, -5.6530], // Minack Theatre
        [50.0659, -5.7128], // Land's End
        [50.10, -5.65],
        [50.15, -5.55],
        [50.2112, -5.4810], // St Ives
      ],
      day2Optional: [
        [50.2112, -5.4810], // St Ives
        [50.15, -5.35],
        [50.05, -5.25],
        [49.9743, -5.2315], // Kynance Cove
      ],
      day2ToAccom: [
        [50.2112, -5.4810], // St Ives (or from Kynance)
        [50.15, -5.45],
        [50.1185, -5.5371], // Penzance
      ],
      day3: [
        [50.1185, -5.5371], // Penzance
        [50.1172, -5.4776], // St Michael's Mount
        [50.18, -5.20],
        [50.25, -5.00],
        [50.40, -4.60],
        [50.50, -4.20],
        [50.65, -3.70],
        [50.7260, -3.4700], // Exeter
        [50.95, -3.10],
        [51.1442, -2.6987], // Glastonbury Tor
        [51.1475, -2.7139], // Glastonbury Abbey
      ],
      day3Return: [
        [51.1475, -2.7139], // Glastonbury
        [51.20, -2.60],
        [51.35, -2.40],
        [51.45, -2.20],
        [51.50, -1.50],
        [51.5074, -0.1278], // London
      ]
    }
  };

  // ===== DRAWING FUNCTIONS =====
  let drawnLayers = [];

  function clearMap() {
    drawnLayers.forEach(layer => map.removeLayer(layer));
    drawnLayers = [];
  }

  function createMarkerIcon(label, isOptional, isHighlight, isSeaSparkle) {
    let color = '#2c3e50';
    if (isSeaSparkle) color = '#00d4aa';
    else if (isOptional) color = '#f39c12';
    else if (isHighlight) color = '#2e86ab';

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: ${color};
        color: white;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 12px;
        font-family: 'DM Sans', sans-serif;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${label}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  }

  function createSeaSparkleIcon() {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: #00d4aa;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        border: 2px solid white;
        box-shadow: 0 0 8px rgba(0,212,170,0.5);
      ">✨</div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -14]
    });
  }

  function createRestStopIcon() {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: #3498db;
        color: white;
        width: 22px;
        height: 22px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">☕</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });
  }

  const dayColors = { 1: '#e67e22', 2: '#2e86ab', 3: '#8e44ad' };

  function drawPlan(plan) {
    clearMap();
    currentPlan = plan;
    const stops = allStops[plan];
    const planRoutes = routes[plan];

    // Draw route polylines
    if (plan === '2day') {
      drawnLayers.push(L.polyline(planRoutes.day1, { color: dayColors[1], weight: 4, opacity: 0.8 }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day2, { color: dayColors[2], weight: 4, opacity: 0.8 }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day2Return, { color: dayColors[2], weight: 3, opacity: 0.5, dashArray: '8, 8' }).addTo(map));
    } else {
      drawnLayers.push(L.polyline(planRoutes.day1, { color: dayColors[1], weight: 4, opacity: 0.8 }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day2, { color: dayColors[2], weight: 4, opacity: 0.8 }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day2Optional, { color: '#f39c12', weight: 3, opacity: 0.6, dashArray: '8, 8' }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day2ToAccom, { color: dayColors[2], weight: 3, opacity: 0.6 }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day3, { color: dayColors[3], weight: 4, opacity: 0.8 }).addTo(map));
      drawnLayers.push(L.polyline(planRoutes.day3Return, { color: dayColors[3], weight: 3, opacity: 0.5, dashArray: '8, 8' }).addTo(map));
    }

    // Draw stop markers
    stops.forEach(stop => {
      const marker = L.marker([stop.lat, stop.lng], {
        icon: createMarkerIcon(stop.id, stop.optional, stop.highlight, false)
      }).addTo(map);
      drawnLayers.push(marker);

      const optionalTag = stop.optional ? ' <em style="color:#f39c12">(選擇性)</em>' : '';
      const navLink = `<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving" target="_blank" style="font-size:11px; color:#3498db;">📍 導航</a>`;
      marker.bindPopup(`
        <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:160px;">
          <strong style="font-size:14px;">${stop.id}. ${stop.name}</strong>${optionalTag}<br/>
          <span style="color:#2e86ab; font-size:12px; font-weight:600;">⏰ ${stop.time}</span><br/>
          <span style="color:#666; font-size:12px;">${stop.desc}</span><br/>
          <span style="color:#999; font-size:11px;">Day ${stop.day}</span>
          ${navLink}
        </div>
      `);
    });

    // Draw Sea Sparkle spots
    seaSparkleSpots.forEach(spot => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: createSeaSparkleIcon()
      }).addTo(map);
      drawnLayers.push(marker);

      marker.bindPopup(`
        <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:140px;">
          <strong style="font-size:13px; color:#00d4aa;">✨ ${spot.name}</strong><br/>
          <span style="color:#666; font-size:12px;">${spot.desc}</span><br/>
          <span style="color:#999; font-size:11px;">23:00-03:00 觀賞</span>
        </div>
      `);
    });

    // Draw rest stops
    restStops.forEach(rs => {
      const marker = L.marker([rs.lat, rs.lng], {
        icon: createRestStopIcon()
      }).addTo(map);
      drawnLayers.push(marker);

      marker.bindPopup(`
        <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:130px;">
          <strong style="font-size:13px;">☕ ${rs.name}</strong><br/>
          <span style="color:#999; font-size:11px;">Day ${rs.day} 休息站</span><br/>
          <a href="https://www.google.com/maps/dir/?api=1&destination=${rs.lat},${rs.lng}&travelmode=driving" target="_blank" style="font-size:11px; color:#3498db;">📍 導航</a>
        </div>
      `);
    });

    // Add legend
    if (!map.legendControl) {
      const legend = L.control({ position: 'bottomleft' });
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-legend');
        div.style.cssText = 'background:white; padding:10px 14px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.15); font-family:"DM Sans","Noto Sans TC",sans-serif; font-size:12px; line-height:1.8;';
        div.innerHTML = `
          <div><span style="display:inline-block;width:20px;height:3px;background:#e67e22;margin-right:6px;vertical-align:middle;"></span>Day 1</div>
          <div><span style="display:inline-block;width:20px;height:3px;background:#2e86ab;margin-right:6px;vertical-align:middle;"></span>Day 2</div>
          <div id="legend-day3" style="display:none;"><span style="display:inline-block;width:20px;height:3px;background:#8e44ad;margin-right:6px;vertical-align:middle;"></span>Day 3</div>
          <div><span style="display:inline-block;width:20px;height:3px;background:#f39c12;margin-right:6px;vertical-align:middle;border-top:2px dashed #f39c12;"></span>Optional</div>
          <div>✨ Sea Sparkle</div>
          <div>☕ Rest Stop</div>
        `;
        return div;
      };
      legend.addTo(map);
      map.legendControl = legend;
    }

    // Update legend for 3-day plan
    const day3Legend = document.getElementById('legend-day3');
    if (day3Legend) {
      day3Legend.style.display = plan === '3day' ? 'block' : 'none';
    }

    // Fit bounds
    const allCoords = stops.map(s => [s.lat, s.lng]);
    map.fitBounds(allCoords, { padding: [30, 30] });
  }

  // ===== EXPOSE TO GLOBAL =====
  window.drawMapPlan = drawPlan;

  // Initial draw
  drawPlan('2day');

  // Listen for plan switch events from app.js
  window.addEventListener('planChanged', function(e) {
    drawPlan(e.detail.plan);
  });
})();
