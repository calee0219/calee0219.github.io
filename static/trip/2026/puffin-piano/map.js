// ===== OpenStreetMap Route with Leaflet =====
(function() {
  'use strict';

  // Wait for DOM
  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  // Initialize map centered on England
  const map = L.map('leafletMap', {
    scrollWheelZoom: false
  }).setView([53.0, -0.5], 6);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Define waypoints with coordinates
  const stops = [
    { id: 'A', name: "King's Cross St Pancras", desc: '08:00 取車', lat: 51.5320, lng: -0.1240, day: 1 },
    { id: 'B', name: 'Finchley', desc: '08:30 接朋友', lat: 51.5912, lng: -0.1647, day: 1 },
    { id: 'C', name: 'Bempton Cliffs (RSPB)', desc: '~13:00 看 Puffin', lat: 54.1452, lng: -0.1632, day: 1 },
    { id: 'D', name: 'North York Moors (Hole of Horcum)', desc: '選擇性 — 健行', lat: 54.3167, lng: -0.8500, day: 1, optional: true },
    { id: 'E', name: 'Wold Farm Campsite', desc: '露營・觀星・日出', lat: 54.1150, lng: -0.1150, day: 1 },
    { id: 'F', name: 'York', desc: '小逛 1.5h', lat: 53.9600, lng: -1.0873, day: 2 },
    { id: 'G', name: 'Norwich', desc: '音樂節 + 搬鋼琴', lat: 52.6309, lng: 1.2974, day: 2 },
    { id: 'H', name: 'London', desc: '~20:00 回到倫敦', lat: 51.5074, lng: -0.1278, day: 2 }
  ];

  // Route polylines (approximate road routes)
  // Day 1: King's Cross → Finchley → Bempton → (optional Hole of Horcum) → Wold Farm
  const day1Route = [
    [51.5320, -0.1240], // King's Cross
    [51.5912, -0.1647], // Finchley
    [51.65, -0.20],     // M1 start
    [51.85, -0.35],     // M1
    [52.10, -0.50],     // M1
    [52.40, -0.70],     // M1
    [52.65, -1.00],     // M1/A1
    [52.95, -1.15],     // A1(M)
    [53.20, -1.20],     // A1(M)
    [53.50, -1.10],     // A1(M)
    [53.75, -1.00],     // A1(M)
    [53.95, -0.70],     // A1(M) to A614
    [54.05, -0.40],     // towards coast
    [54.1452, -0.1632], // Bempton Cliffs
  ];

  const day1ToCamp = [
    [54.1452, -0.1632], // Bempton
    [54.1150, -0.1150], // Wold Farm
  ];

  // Optional: Bempton → Hole of Horcum → Wold Farm
  const optionalRoute = [
    [54.1452, -0.1632], // Bempton
    [54.20, -0.30],
    [54.25, -0.50],
    [54.3167, -0.8500], // Hole of Horcum
    [54.25, -0.50],
    [54.20, -0.30],
    [54.1150, -0.1150], // Wold Farm
  ];

  // Day 2: Wold Farm → York → Norwich → London
  const day2Route = [
    [54.1150, -0.1150], // Wold Farm
    [54.05, -0.30],
    [53.9600, -1.0873], // York
    [53.80, -0.90],     // A64/A1
    [53.50, -0.60],     // A1
    [53.20, -0.20],     // A15
    [52.95, 0.10],      // A17
    [52.75, 0.60],      // A47
    [52.6309, 1.2974],  // Norwich
  ];

  const day2Return = [
    [52.6309, 1.2974],  // Norwich
    [52.45, 1.10],      // A11
    [52.20, 0.80],      // A11
    [52.00, 0.50],      // A11/M11
    [51.80, 0.20],      // M11
    [51.60, 0.00],      // M11
    [51.5074, -0.1278], // London
  ];

  // Draw routes
  L.polyline(day1Route, { color: '#e67e22', weight: 4, opacity: 0.8, dashArray: null }).addTo(map);
  L.polyline(day1ToCamp, { color: '#e67e22', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(optionalRoute, { color: '#95a5a6', weight: 3, opacity: 0.6, dashArray: '8, 8' }).addTo(map);
  L.polyline(day2Route, { color: '#3498db', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(day2Return, { color: '#3498db', weight: 4, opacity: 0.8 }).addTo(map);

  // Custom marker icons
  function createMarkerIcon(label, isOptional) {
    const color = isOptional ? '#95a5a6' : '#2c3e50';
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
        font-size: 13px;
        font-family: 'DM Sans', sans-serif;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${label}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
  }

  // Add markers
  stops.forEach(stop => {
    const marker = L.marker([stop.lat, stop.lng], {
      icon: createMarkerIcon(stop.id, stop.optional)
    }).addTo(map);

    const optionalTag = stop.optional ? ' <em style="color:#95a5a6">(選擇性)</em>' : '';
    marker.bindPopup(`
      <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:150px;">
        <strong style="font-size:14px;">${stop.id}. ${stop.name}</strong>${optionalTag}<br/>
        <span style="color:#666; font-size:12px;">${stop.desc}</span><br/>
        <span style="color:#999; font-size:11px;">Day ${stop.day}</span>
      </div>
    `);
  });

  // Add Horsey Gap as bonus marker
  const horseyMarker = L.marker([52.7490, 1.6560], {
    icon: createMarkerIcon('🦭', true)
  }).addTo(map);
  horseyMarker.bindPopup(`
    <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:150px;">
      <strong style="font-size:14px;">Horsey Gap</strong> <em style="color:#95a5a6">(選擇性)</em><br/>
      <span style="color:#666; font-size:12px;">看海豹 — 距 Norwich 32 min</span><br/>
      <span style="color:#999; font-size:11px;">Day 2 Bonus</span>
    </div>
  `);

  // Optional Horsey route
  const horseyRoute = [
    [52.6309, 1.2974], // Norwich
    [52.70, 1.50],
    [52.7490, 1.6560], // Horsey Gap
  ];
  L.polyline(horseyRoute, { color: '#27ae60', weight: 3, opacity: 0.5, dashArray: '6, 6' }).addTo(map);

  // Add legend
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.style.cssText = 'background:white; padding:10px 14px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.15); font-family:"DM Sans","Noto Sans TC",sans-serif; font-size:12px; line-height:1.8;';
    div.innerHTML = `
      <div><span style="display:inline-block;width:20px;height:3px;background:#e67e22;margin-right:6px;vertical-align:middle;"></span>Day 1</div>
      <div><span style="display:inline-block;width:20px;height:3px;background:#3498db;margin-right:6px;vertical-align:middle;"></span>Day 2</div>
      <div><span style="display:inline-block;width:20px;height:3px;background:#95a5a6;margin-right:6px;vertical-align:middle;border-top:2px dashed #95a5a6;"></span>Optional</div>
      <div><span style="display:inline-block;width:20px;height:3px;background:#27ae60;margin-right:6px;vertical-align:middle;border-top:2px dashed #27ae60;"></span>Horsey Gap</div>
    `;
    return div;
  };
  legend.addTo(map);

  // Fit map to show all markers
  const allCoords = stops.map(s => [s.lat, s.lng]);
  allCoords.push([52.7490, 1.6560]); // Horsey
  map.fitBounds(allCoords, { padding: [30, 30] });

})();
