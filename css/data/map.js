// Initialize map
var map = L.map('map').setView([31.04, -84.88], 14);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Load hydrants JSON
fetch('data/hydrants.json')
  .then(response => response.json())
  .then(data => {
    var markers = [];

    data.forEach(h => {
      var color = h.flow >= 1500 ? 'green' :
                  h.flow >= 1000 ? 'orange' : 'red';

      var marker = L.circleMarker([h.latitude, h.longitude], {
        radius: 8,
        color: color,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(
        `<b>ID:</b> ${h.id}<br>` +
        `<b>Flow:</b> ${h.flow} GPM<br>` +
        `<b>Pressure:</b> ${h.pressure} psi<br>` +
        `<b>Status:</b> ${h.status}<br>` +
        `<b>Last Inspection:</b> ${h.last_inspected}<br>` +
        `<b>Location:</b> ${h.location_description}`
      );

      markers.push({marker: marker, id: h.id, status: h.status.toLowerCase()});
    });

    // Search filter
    document.getElementById('search').addEventListener('input', function() {
      var query = this.value.toLowerCase();
      markers.forEach(m => {
        if (m.id.toLowerCase().includes(query) || m.status.includes(query)) {
          m.marker.addTo(map);
        } else {
          map.removeLayer(m.marker);
        }
      });
    });
  })
  .catch(err => console.error("Failed to load hydrants.json:", err));
