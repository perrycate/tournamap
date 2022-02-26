let myMap = L.map('mapid').setView([51.505, -0.09], 4);
let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

fetch("tournaments").then((resp) => {
    resp.json().then((parsed_tourneys) => {
        let tourney_markers = parsed_tourneys.map((tourney) => {
            let { lat, lng } = tourney["location"];
            return L.marker().setLatLng([lat, lng]).bindPopup(`<a href=${tourney["url"]}>${tourney["name"]}</a>`);
        });
        L.layerGroup(tourney_markers).addTo(myMap);
    })
});

// Set position based on user location, if they grant it.
navigator.geolocation.getCurrentPosition(resp => {
    myMap.setView([resp.coords.latitude, resp.coords.longitude], 10);
});
