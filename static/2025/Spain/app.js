// ===== Navigation =====
const nav = document.getElementById('mainNav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section');
window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.querySelectorAll('a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
});

// ===== Day Tabs =====
document.querySelectorAll('.day-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.day-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('day-' + tab.dataset.day).classList.add('active');
    });
});

// ===== Map =====
const mapData = {
    barcelona: {
        center: [41.3900, 2.1740],
        zoom: 14,
        markers: [
            { lat: 41.3808, lng: 2.1734, title: 'Pension San Ramon（住宿）', color: '#e74c3c', type: 'hotel' },
            { lat: 41.2974, lng: 2.0833, title: 'Barcelona Airport (BCN)', color: '#2ecc71', type: 'transport' },
            { lat: 41.4036, lng: 2.1744, title: '聖家堂 Sagrada Família', color: '#3498db', type: 'attraction' },
            { lat: 41.3916, lng: 2.1650, title: '巴特婁之家 Casa Batlló', color: '#3498db', type: 'attraction' },
            { lat: 41.3953, lng: 2.1620, title: '米拉之家 Casa Milà', color: '#3498db', type: 'attraction' },
            { lat: 41.3840, lng: 2.1763, title: '巴塞隆納主教座堂', color: '#3498db', type: 'attraction' },
            { lat: 41.4183, lng: 2.1565, title: 'Carmel Bunkers（觀景點）', color: '#3498db', type: 'attraction' },
            { lat: 41.3784, lng: 2.1920, title: 'Barceloneta 海灘', color: '#3498db', type: 'attraction' },
            { lat: 41.3862, lng: 2.1786, title: 'Mercat de Santa Caterina / Bar Joan', color: '#e67e22', type: 'food' },
            { lat: 41.3817, lng: 2.1882, title: 'Bar Jai-Ca', color: '#e67e22', type: 'food' },
            { lat: 41.3845, lng: 2.1820, title: 'Euskal Etxea', color: '#e67e22', type: 'food' },
            { lat: 41.3737, lng: 2.1646, title: 'Pincho J（Poble Sec）', color: '#e67e22', type: 'food' },
            { lat: 41.3880, lng: 2.1690, title: 'Cervecería Catalana', color: '#e67e22', type: 'food' },
            { lat: 41.3830, lng: 2.1720, title: 'Granja Viader', color: '#e67e22', type: 'food' },
        ]
    },
    madrid: {
        center: [40.4150, -3.7040],
        zoom: 14,
        markers: [
            { lat: 40.4089, lng: -3.7074, title: '住宿（Toledo 94）', color: '#e74c3c', type: 'hotel' },
            { lat: 40.4983, lng: -3.5676, title: 'Madrid Airport (MAD)', color: '#2ecc71', type: 'transport' },
            { lat: 40.4180, lng: -3.7144, title: '馬德里皇宮 Palacio Real', color: '#3498db', type: 'attraction' },
            { lat: 40.4138, lng: -3.6921, title: '普拉多博物館 Museo del Prado', color: '#3498db', type: 'attraction' },
            { lat: 40.4169, lng: -3.7035, title: '太陽門廣場 Puerta del Sol', color: '#3498db', type: 'attraction' },
            { lat: 40.4154, lng: -3.7074, title: '主廣場 Plaza Mayor', color: '#3498db', type: 'attraction' },
            { lat: 40.4153, lng: -3.6845, title: '麗池公園 Retiro Park', color: '#3498db', type: 'attraction' },
            { lat: 40.4080, lng: -3.6940, title: '索菲亞王后藝術中心', color: '#3498db', type: 'attraction' },
            { lat: 40.4172, lng: -3.7010, title: 'Cardamomo（佛朗明哥）', color: '#9b59b6', type: 'show' },
            { lat: 40.4130, lng: -3.7130, title: 'Corral de la Morería', color: '#9b59b6', type: 'show' },
            { lat: 40.4170, lng: -3.7070, title: 'Chocolatería San Ginés', color: '#e67e22', type: 'food' },
            { lat: 40.4160, lng: -3.7060, title: 'Museo del Jamón', color: '#e67e22', type: 'food' },
            { lat: 40.4120, lng: -3.7090, title: 'Casa Lucio', color: '#e67e22', type: 'food' },
            { lat: 40.4210, lng: -3.7100, title: 'La Bola Taberna', color: '#e67e22', type: 'food' },
            { lat: 40.4140, lng: -3.7000, title: 'El Brillante', color: '#e67e22', type: 'food' },
        ]
    }
};

let map;
let markersLayer;

function createIcon(color) {
    return L.divIcon({
        className: 'custom-marker',
        html: '<div style="background:' + color + ';width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12]
    });
}

function showCity(city) {
    const data = mapData[city];
    map.setView(data.center, data.zoom);
    markersLayer.clearLayers();
    data.markers.forEach(m => {
        L.marker([m.lat, m.lng], { icon: createIcon(m.color) })
            .bindPopup('<strong>' + m.title + '</strong>')
            .addTo(markersLayer);
    });
}

// Initialize map
document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map-container', {
        scrollWheelZoom: false
    }).setView([41.3900, 2.1740], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
    showCity('barcelona');

    // Map city tabs
    document.querySelectorAll('.map-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.map-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            showCity(tab.dataset.city);
        });
    });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 70;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
