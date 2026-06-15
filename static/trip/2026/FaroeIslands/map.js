(function() {
  'use strict';

  const mapContainer = document.getElementById('leafletMap');
  if (!mapContainer) return;

  // Initialize map centered on Faroe Islands
  const map = L.map('leafletMap', {
    scrollWheelZoom: false
  }).setView([62.05, -6.9], 9);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  // Define all stops with coordinates
  const stops = [
    // Day 1: Arrival + West Vágar
    { id: '1', name: 'Vágar Airport', desc: '抵達・取車', lat: 62.0636, lng: -7.2772, day: 1 },
    { id: '2', name: 'Gásadalur & Múlafossur', desc: '法羅最具代表性瀑布', lat: 62.1069, lng: -7.4344, day: 1, highlight: true },
    { id: '3', name: 'Bøur Village', desc: '草皮屋頂村莊', lat: 62.0750, lng: -7.3667, day: 1 },
    { id: '4', name: 'Tórshavn', desc: '首都・住宿基地', lat: 62.0079, lng: -6.7710, day: 1 },

    // Day 2: Vágar Hike
    { id: '5', name: 'Sørvágsvatn / Trælanípa', desc: '「懸崖上的湖」健行 3h', lat: 62.0736, lng: -7.2500, day: 2, highlight: true },
    { id: '6', name: 'Vestmanna Bird Cliffs', desc: '海崖遊船 1.5h', lat: 62.1500, lng: -6.9833, day: 2, highlight: true },

    // Day 3: Mykines
    { id: '7', name: 'Mykines Island', desc: '🐧 海鸚天堂・渡輪 45min', lat: 62.1000, lng: -7.5833, day: 3, highlight: true },

    // Day 4: North Streymoy
    { id: '8', name: 'Saksun', desc: '夢幻峽谷村莊', lat: 62.2500, lng: -6.9750, day: 4, highlight: true },
    { id: '9', name: 'Tjørnuvík', desc: '黑沙灘・巨人海蝕柱', lat: 62.2833, lng: -6.9167, day: 4, highlight: true },
    { id: '10', name: 'Kirkjubøur', desc: '歷史遺址（選擇性）', lat: 61.9553, lng: -6.8192, day: 4, optional: true },

    // Day 5: Eysturoy
    { id: '11', name: 'Gjógv', desc: '天然峽灣港口村莊', lat: 62.3255, lng: -6.9436, day: 5, highlight: true },
    { id: '12', name: 'Slættaratindur', desc: '最高峰 880m（選擇性）', lat: 62.2833, lng: -6.9500, day: 5, optional: true },
    { id: '13', name: 'Eiði', desc: '海蝕柱觀景', lat: 62.2958, lng: -7.0861, day: 5 },
    { id: '14', name: 'Klaksvík', desc: '第二大城・住宿', lat: 62.2264, lng: -6.5894, day: 5 },

    // Day 6: Kalsoy
    { id: '15', name: 'Kalsoy / Kallur Lighthouse', desc: '壯觀懸崖健行 2.5h', lat: 62.3833, lng: -6.7333, day: 6, highlight: true },
    { id: '16', name: 'Viðareiði', desc: '最北端村莊（選擇性）', lat: 62.3667, lng: -6.5500, day: 6, optional: true },

    // Day 7: Flexible
    { id: '17', name: 'Nólsoy', desc: '彈性日選項 A', lat: 62.0000, lng: -6.6667, day: 7, optional: true },
    { id: '18', name: 'Sandoy', desc: '彈性日選項 B', lat: 61.8333, lng: -6.8333, day: 7, optional: true }
  ];

  // Route polylines
  // Day 1: Airport → Gásadalur → Bøur → Tórshavn
  const day1Route = [
    [62.0636, -7.2772], // Airport
    [62.0800, -7.3200],
    [62.1069, -7.4344], // Gásadalur
    [62.0750, -7.3667], // Bøur
    [62.0636, -7.2772], // Back through airport area
    [62.0400, -7.1500],
    [62.0200, -7.0000],
    [62.0079, -6.7710]  // Tórshavn
  ];

  // Day 2: Tórshavn → Sørvágsvatn → Vestmanna → Tórshavn
  const day2Route = [
    [62.0079, -6.7710], // Tórshavn
    [62.0200, -7.0000],
    [62.0400, -7.1500],
    [62.0736, -7.2500], // Sørvágsvatn
    [62.0636, -7.2772], // via airport
    [62.1000, -7.1000],
    [62.1500, -6.9833], // Vestmanna
    [62.1000, -6.8500],
    [62.0079, -6.7710]  // Tórshavn
  ];

  // Day 3: Tórshavn → Sørvágur (ferry) → Mykines → back
  const day3Route = [
    [62.0079, -6.7710], // Tórshavn
    [62.0400, -7.1500],
    [62.0710, -7.3100], // Sørvágur (ferry port)
  ];
  const day3Ferry = [
    [62.0710, -7.3100], // Sørvágur
    [62.1000, -7.5833]  // Mykines
  ];

  // Day 4: Tórshavn → Saksun → Tjørnuvík → Kirkjubøur → Tórshavn
  const day4Route = [
    [62.0079, -6.7710], // Tórshavn
    [62.0500, -6.8500],
    [62.1200, -6.9200],
    [62.2000, -6.9500],
    [62.2500, -6.9750], // Saksun
    [62.2833, -6.9167], // Tjørnuvík
    [62.2500, -6.9750],
    [62.1200, -6.9200],
    [62.0079, -6.7710], // Tórshavn
    [61.9553, -6.8192]  // Kirkjubøur
  ];

  // Day 5: Tórshavn → Gjógv → Eiði → Klaksvík
  const day5Route = [
    [62.0079, -6.7710], // Tórshavn
    [62.0500, -6.8000],
    [62.1200, -6.9000],
    [62.2000, -6.9200],
    [62.3255, -6.9436], // Gjógv
    [62.2958, -7.0861], // Eiði
    [62.2500, -6.8000],
    [62.2264, -6.5894]  // Klaksvík
  ];

  // Day 6: Klaksvík → (ferry) Kalsoy → Viðareiði → Tórshavn
  const day6Route = [
    [62.2264, -6.5894], // Klaksvík
  ];
  const day6Ferry = [
    [62.2264, -6.5894], // Klaksvík
    [62.3000, -6.7000],
    [62.3833, -6.7333]  // Kalsoy
  ];
  const day6Return = [
    [62.2264, -6.5894], // Klaksvík
    [62.3667, -6.5500], // Viðareiði
    [62.2264, -6.5894], // Back to Klaksvík
    [62.1500, -6.6500],
    [62.0500, -6.7500],
    [62.0079, -6.7710]  // Tórshavn
  ];

  // Draw routes with different colors per day
  const dayColors = {
    1: '#e67e22',  // Orange
    2: '#e67e22',  // Orange
    3: '#27ae60',  // Green
    4: '#8e44ad',  // Purple
    5: '#2980b9',  // Blue
    6: '#16a085',  // Teal
    7: '#95a5a6'   // Grey
  };

  L.polyline(day1Route, { color: dayColors[1], weight: 3, opacity: 0.8 }).addTo(map);
  L.polyline(day2Route, { color: dayColors[2], weight: 3, opacity: 0.8 }).addTo(map);
  L.polyline(day3Route, { color: dayColors[3], weight: 3, opacity: 0.8 }).addTo(map);
  L.polyline(day3Ferry, { color: dayColors[3], weight: 3, opacity: 0.7, dashArray: '8, 8' }).addTo(map);
  L.polyline(day4Route, { color: dayColors[4], weight: 3, opacity: 0.8 }).addTo(map);
  L.polyline(day5Route, { color: dayColors[5], weight: 3, opacity: 0.8 }).addTo(map);
  L.polyline(day6Route, { color: dayColors[6], weight: 3, opacity: 0.8 }).addTo(map);
  L.polyline(day6Ferry, { color: dayColors[6], weight: 3, opacity: 0.7, dashArray: '8, 8' }).addTo(map);
  L.polyline(day6Return, { color: dayColors[6], weight: 3, opacity: 0.8 }).addTo(map);

  // Custom marker icons
  function createMarkerIcon(label, day, isOptional, isHighlight) {
    const color = isOptional ? '#95a5a6' : (dayColors[day] || '#2c3e50');
    const size = isHighlight ? 30 : 26;
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background: ${color};
        color: white;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: ${isHighlight ? '12' : '11'}px;
        font-family: 'DM Sans', sans-serif;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">${label}</div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2]
    });
  }

  // Add stop markers
  stops.forEach(stop => {
    const marker = L.marker([stop.lat, stop.lng], {
      icon: createMarkerIcon(stop.id, stop.day, stop.optional, stop.highlight)
    }).addTo(map);

    const optionalTag = stop.optional ? ' <em style="color:#95a5a6">(選擇性)</em>' : '';
    const highlightTag = stop.highlight ? ' ⭐' : '';
    const navLink = `<br/><a href="https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}&travelmode=driving" target="_blank" style="font-size:11px; color:#3498db;">📍 導航</a>`;
    
    marker.bindPopup(`
      <div style="font-family:'DM Sans','Noto Sans TC',sans-serif; min-width:160px;">
        <strong style="font-size:14px;">${stop.id}. ${stop.name}</strong>${highlightTag}${optionalTag}<br/>
        <span style="color:#666; font-size:12px;">${stop.desc}</span><br/>
        <span style="color:#999; font-size:11px;">Day ${stop.day}</span>
        ${navLink}
      </div>
    `);
  });

  // Add legend
  const legend = L.control({ position: 'bottomleft' });
  legend.onAdd = function() {
    const div = L.DomUtil.create('div', 'map-legend');
    div.style.cssText = 'background:white; padding:10px 14px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.15); font-family:"DM Sans","Noto Sans TC",sans-serif; font-size:11px; line-height:2;';
    div.innerHTML = `
      <div style="font-weight:600; margin-bottom:4px;">Route Legend</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[1]};margin-right:6px;vertical-align:middle;"></span>Day 1-2 (Vágar)</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[3]};margin-right:6px;vertical-align:middle;"></span>Day 3 (Mykines)</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[4]};margin-right:6px;vertical-align:middle;"></span>Day 4 (N. Streymoy)</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[5]};margin-right:6px;vertical-align:middle;"></span>Day 5 (Eysturoy)</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:${dayColors[6]};margin-right:6px;vertical-align:middle;"></span>Day 6 (Kalsoy)</div>
      <div><span style="display:inline-block;width:18px;height:0;border-top:3px dashed #666;margin-right:6px;vertical-align:middle;"></span>Ferry</div>
      <div><span style="display:inline-block;width:18px;height:3px;background:#95a5a6;margin-right:6px;vertical-align:middle;"></span>Optional</div>
    `;
    return div;
  };
  legend.addTo(map);

  // Fit map to show all main markers (exclude very optional ones)
  const mainStops = stops.filter(s => !s.optional);
  const allCoords = mainStops.map(s => [s.lat, s.lng]);
  map.fitBounds(allCoords, { padding: [30, 30] });

})();
