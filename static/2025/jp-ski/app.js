// ===== Navigation Toggle =====
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ===== Initialize Map =====
    initMap();
});

function initMap() {
    const map = L.map('tripMap', {
        scrollWheelZoom: false
    }).setView([36.5, 139.3], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
    }).addTo(map);

    // Custom icon factory
    function createIcon(color) {
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
                width: 24px; height: 24px;
                background: ${color};
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -14]
        });
    }

    // Locations
    const locations = [
        // Airports (red)
        { lat: 35.772, lng: 140.393, name: '成田國際機場', desc: '12/24 抵達 · 1/2–4 離開', color: '#e74c3c' },

        // Stations (blue)
        { lat: 35.714, lng: 139.777, name: '上野車站', desc: '新幹線出發站', color: '#3498db' },
        { lat: 36.934, lng: 138.812, name: '越後湯澤車站', desc: '轉乘公車前往苗場 · ぽんしゅ館', color: '#3498db' },
        { lat: 37.033, lng: 138.917, name: '浦佐車站', desc: '上越住宿最近車站', color: '#3498db' },

        // Ski Resorts (green)
        { lat: 36.846, lng: 138.779, name: '苗場滑雪場 + 神樂', desc: '12/26–28 滑雪 · 24 條雪道 · 海拔 900–1789m', color: '#2ecc71' },
        { lat: 37.003, lng: 138.883, name: '上越國際滑雪場', desc: '12/29–31 滑雪 · 日本最大 380 公頃 · 22 條雪道', color: '#2ecc71' },

        // Accommodation (orange)
        { lat: 35.714, lng: 139.779, name: 'APA Hotel 上野稻荷町駅北', desc: '12/24 住宿', color: '#f39c12' },
        { lat: 36.846, lng: 138.780, name: 'Little Japan Echigo', desc: '12/25–27 住宿 · 苗場附近民宿', color: '#f39c12' },
        { lat: 37.030, lng: 138.910, name: '浦佐 Airbnb 民宿', desc: '12/28–31 住宿 · 4 臥室村舍', color: '#f39c12' },
        { lat: 35.685, lng: 139.783, name: 'APA Hotel 人形町駅東', desc: '1/1–3 住宿 · 東京觀光據點', color: '#f39c12' },

        // Sightseeing (purple)
        { lat: 36.860, lng: 138.680, name: '清津峽 / Tunnel of Light', desc: '日本三大峽谷 · 藝術裝置', color: '#9b59b6' },
        { lat: 37.028, lng: 138.929, name: '八海山索道', desc: '俯瞰南魚沼平原', color: '#9b59b6' },
        { lat: 37.066, lng: 138.942, name: '魚沼之里', desc: '八海釀造複合設施', color: '#9b59b6' },
        { lat: 35.710, lng: 139.811, name: '東京天空樹', desc: '備長名古屋鰻魚飯', color: '#9b59b6' },
    ];

    // Add markers
    locations.forEach(loc => {
        L.marker([loc.lat, loc.lng], { icon: createIcon(loc.color) })
            .addTo(map)
            .bindPopup(`
                <div style="font-family: 'Noto Sans TC', sans-serif; min-width: 180px;">
                    <strong style="font-size: 14px; color: #1a365d;">${loc.name}</strong>
                    <p style="margin: 4px 0 0; font-size: 12px; color: #718096; line-height: 1.5;">${loc.desc}</p>
                </div>
            `);
    });

    // Draw route lines
    const routePoints = [
        [35.772, 140.393],  // Narita
        [35.714, 139.777],  // Ueno
        [36.934, 138.812],  // Echigo-Yuzawa
        [36.846, 138.779],  // Naeba
        [36.934, 138.812],  // Back to Echigo-Yuzawa
        [37.033, 138.917],  // Urasa
        [37.003, 138.883],  // Joetsu Kokusai
        [37.033, 138.917],  // Back to Urasa
        [36.934, 138.812],  // Echigo-Yuzawa
        [35.685, 139.783],  // Tokyo (APA Ningyocho)
        [35.772, 140.393],  // Narita
    ];

    L.polyline(routePoints, {
        color: '#2b6cb0',
        weight: 3,
        opacity: 0.6,
        dashArray: '8, 8',
        smoothFactor: 1
    }).addTo(map);

    // Fit bounds
    const bounds = L.latLngBounds(locations.map(l => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
}

// ===== Scroll-based nav shadow =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('mainNav');
    if (nav) {
        if (window.scrollY > 100) {
            nav.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    }
});
