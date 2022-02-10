let myMap = L.map('mapid').setView([51.505, -0.09], 13);
let OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);
//let marker = L.marker([51.5, -0.09]).addTo(myMap);
//marker.bindPopup("hello, world!");
fetch("tournaments").then((resp) => {
    resp.json().then((parsed_tourneys) => {
        let tourney_markers = parsed_tourneys.map((tourney) => {
            let { lat, lng } = tourney["location"];
            //return L.popup().setLatLng([lat, lng]).setContent(tourney["name"]);
            return L.marker().setLatLng([lat, lng]).bindPopup(`<a href=${tourney["url"]}>${tourney["name"]}</a>`);
        });
        L.layerGroup(tourney_markers).addTo(myMap);
    })
});

