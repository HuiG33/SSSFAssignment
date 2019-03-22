// JavaScript
const map = L.map('map').setView([60.1699, 24.9384], 13);
let marker = L.marker([60.1699, 24.9384]).addTo(map);
marker.bindPopup("<b>Latitude: </b>60.1699<br><b>Longitude: </b>24.9384").openPopup();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

map.on('click', (evt) => {
  map.removeLayer(marker);
  marker = L.marker([evt.latlng.lat, evt.latlng.lng]).addTo(map);
  marker.bindPopup("<b>Latitude: </b>" + evt.latlng.lat + "<br><b>Longitude: </b>" + evt.latlng.lng).openPopup();

  const lat = document.getElementById('lat');
  lat.value = evt.latlng.lat;
  const lon = document.getElementById('lon');
  lon.value = evt.latlng.lng;

});

map.on('locationfound', (evt) => {
  map.setView(ev.latlng, 13);
});