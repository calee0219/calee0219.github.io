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
    { id: 'A', name: 'Marylebone (Enterprise)', desc: '08:00 取車', lat: 51.5225, lng: -0.1580, day: 1 },
    { id: 'B', name: 'Finchley', desc: '08:30 接朋友', lat: 51.5912, lng: -0.1647, day: 1 },
    { id: 'C', name: 'York', desc: '12:00 午餐+逛街 2.5h', lat: 53.9600, lng: -1.0873, day: 1 },
    { id: 'D', name: 'North York Moors (Hole of Horcum)', desc: '選擇性 — 健行', lat: 54.3167, lng: -0.8500, day: 1, optional: true },
    { id: 'E', name: 'Whitby', desc: '199 階梯 + Abbey', lat: 54.4885, lng: -0.6132, day: 1 },
    { id: 'F', name: "Robin Hood's Bay", desc: '漁村散步', lat: 54.4334, lng: -0.5334, day: 1 },
    { id: 'G', name: 'Wold Farm Campsite', desc: '露營・觀星・日出', lat: 54.1150, lng: -0.1150, day: 1 },
    { id: 'H', name: 'Bempton Cliffs (RSPB)', desc: '🐧 清晨 Puffin + 🦭 海豹', lat: 54.1452, lng: -0.1632, day: 2 },
    { id: 'I', name: 'Norwich', desc: '搬鋼琴 + 接朋友', lat: 52.6309, lng: 1.2974, day: 2 },
    { id: 'J', name: 'Horsey Gap', desc: '🦭 看海豹 + Windpump', lat: 52.7490, lng: 1.6560, day: 2 },
    { id: 'K', name: 'Bury St Edmunds', desc: 'Abbey Gardens + 晚餐', lat: 52.2435, lng: 0.7183, day: 2 },
    { id: 'L', name: 'London (Finchley → Home)', desc: '~20:00 放朋友 → 回家', lat: 51.5074, lng: -0.1278, day: 2 }
  ];

  // Rest stops
  const restStops = [
    { name: 'Ferrybridge Services', lat: 53.7145, lng: -1.2870, day: 1 },
    { name: 'Peterborough Services', lat: 52.5730, lng: -0.2590, day: 2 }
  ];

  // Route polylines (approximate road routes)
  // Day 1: Marylebone → Finchley → York → Whitby → Robin Hood's Bay → Wold Farm
  const day1MainRoute = [
    [51.5225, -0.1580], // Marylebone
    [51.5912, -0.1647], // Finchley
    [51.65, -0.20],     // M1 start
    [51.85, -0.35],     // M1
    [52.10, -0.50],     // M1
    [52.40, -0.70],     // M1
    [52.65, -1.00],     // M1/A1
    [52.95, -1.15],     // A1(M)
    [53.20, -1.20],     // A1(M)
    [53.50, -1.10],     // A1(M)
    [53.7145, -1.2870], // Ferrybridge Services (rest stop)
    [53.9600, -1.0873], // York
  ];

  // York → Whitby (direct, if NYM skipped)
  const yorkToWhitbyDirect = [
    [53.9600, -1.0873], // York
    [54.10, -0.90],     // A64
    [54.25, -0.75],     // A169
    [54.4885, -0.6132], // Whitby
  ];

  // Optional: York → Hole of Horcum → Whitby
  const optionalRoute = [
    [53.9600, -1.0873], // York
    [54.10, -0.90],     // A64
    [54.25, -0.80],     // A169
    [54.3167, -0.8500], // Hole of Horcum
    [54.35, -0.75],     // A169 north
    [54.4885, -0.6132], // Whitby
  ];

  // Whitby → Robin Hood's Bay → Wold Farm
  const coastRoute = [
    [54.4885, -0.6132], // Whitby
    [54.4334, -0.5334], // Robin Hood's Bay
    [54.40, -0.45],     // A171 south
    [54.35, -0.35],     // A171
    [54.30, -0.25],     // A165
    [54.20, -0.15],     // A165
    [54.1150, -0.1150], // Wold Farm
  ];

  // Day 2: Wold Farm → Bempton → Norwich → Horsey Gap → Bury St Edmunds → London
  const day2ToBempton = [
    [54.1150, -0.1150], // Wold Farm
    [54.1452, -0.1632], // Bempton Cliffs
  ];

  const day2ToNorwich = [
    [54.1452, -0.1632], // Bempton (back to Wold Farm then south)
    [54.1150, -0.1150], // Wold Farm
    [54.00, -0.10],     // A165 south
    [53.80, -0.20],     // A164/A15
    [53.50, -0.30],     // A15
    [53.20, -0.20],     // A15
    [52.95, 0.00],      // A17
    [52.5730, -0.2590], // Peterborough Services
    [52.60, 0.30],      // A47
    [52.60, 0.80],      // A47
    [52.6309, 1.2974],  // Norwich
  ];

  const day2ToHorsey = [
    [52.6309, 1.2974],  // Norwich
    [52.70, 1.50],
    [52.7490, 1.6560],  // Horsey Gap
  ];

  const day2ToBury = [
    [52.7490, 1.6560],  // Horsey Gap
    [52.70, 1.50],      // back
    [52.60, 1.20],      // A47 west
    [52.45, 1.00],      // A47
    [52.35, 0.85],      // A14
    [52.2435, 0.7183],  // Bury St Edmunds
  ];

  const day2Return = [
    [52.2435, 0.7183],  // Bury St Edmunds
    [52.10, 0.50],      // A14
    [52.00, 0.30],      // M11
    [51.80, 0.10],      // M11
    [51.60, -0.05],     // M11
    [51.5912, -0.1647], // Finchley (drop friends)
    [51.5074, -0.1278], // London
  ];

  // Draw routes
  L.polyline(day1MainRoute, { color: '#e67e22', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(yorkToWhitbyDirect, { color: '#e67e22', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(optionalRoute, { color: '#95a5a6', weight: 3, opacity: 0.6, dashArray: '8, 8' }).addTo(map);
  L.polyline(coastRoute, { color: '#e67e22', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(day2ToBempton, { color: '#3498db', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(day2ToNorwich, { color: '#3498db', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(day2ToHorsey, { color: '#3498db', weight: 4, opacity: 0.8 }).addTo(map);
  L.polyline(day2ToBury, { color: '#3498db', weight: 4, opacity: 0.8 }).addTo(map);
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

  // Rest stop marker icon
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
        font-family: 'DM Sans', sans-serif;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">☕</div>`,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
      popupAnchor: [0, -12]
    });
  }

  // Add stop markers
  stops.forEach(stop => {
    const marker = L.marker([stop.lat, stop.lng], {
      icon: createMarkerIcon(stop.id, stop.optional)
    }).addTo(map);

    const optionalTag = stop.optional ? ' <em style="color:#95a5a6">(選擇性)</em>' : '';
    const navLink = `<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving" target="_blank" style="font-size:11px; color:#3498db;">📍 導航</a>`;
    marker.bindPopup(`
      <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:150px;">
        <strong style="font-size:14px;">${stop.id}. ${stop.name}</strong>${optionalTag}<br/>
        <span style="color:#666; font-size:12px;">${stop.desc}</span><br/>
        <span style="color:#999; font-size:11px;">Day ${stop.day}</span>
        ${navLink}
      </div>
    `);
  });

  // Add rest stop markers
  restStops.forEach(rs => {
    const marker = L.marker([rs.lat, rs.lng], {
      icon: createRestStopIcon()
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:130px;">
        <strong style="font-size:13px;">☕ ${rs.name}</strong><br/>
        <span style="color:#999; font-size:11px;">Day ${rs.day} 休息站</span><br/>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${rs.lat},${rs.lng}&travelmode=driving" target="_blank" style="font-size:11px; color:#3498db;">📍 導航</a>
      </div>
    `);
  });

  // Add legend
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.style.cssText = 'background:white; padding:10px 14px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.15); font-family:"DM Sans","Noto Sans TC",sans-serif; font-size:12px; line-height:1.8;';
    div.innerHTML = `
      <div><span style="display:inline-block;width:20px;height:3px;background:#e67e22;margin-right:6px;vertical-align:middle;"></span>Day 1</div>
      <div><span style="display:inline-block;width:20px;height:3px;background:#3498db;margin-right:6px;vertical-align:middle;"></span>Day 2</div>
      <div><span style="display:inline-block;width:20px;height:3px;background:#95a5a6;margin-right:6px;vertical-align:middle;border-top:2px dashed #95a5a6;"></span>Optional</div>
      <div>☕ Rest Stops</div>
    `;
    return div;
  };
  legend.addTo(map);

  // Fit map to show all markers
  const allCoords = stops.map(s => [s.lat, s.lng]);
  restStops.forEach(rs => allCoords.push([rs.lat, rs.lng]));
  map.fitBounds(allCoords, { padding: [30, 30] });

})();
