"use strict";
let myMap = L.map("mapid").setView([51.505, -0.09], 4);
let OpenStreetMap_Mapnik = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Fetch tournament data and add pins to the map for each tournament.
fetch("tournaments").then((resp) => {
    resp.json().then((parsed_tourneys) => {
        let tourney_markers = parsed_tourneys.map((tourney) => {
            let { lat, lng } = tourney["location"];
            return L.marker().setLatLng([lat, lng]).bindPopup(`<a href=${tourney["url"]} target="_blank">${tourney["name"]}</a>`);
        });
        L.layerGroup(tourney_markers).addTo(myMap);
    })
});

// Sets loader and overlay while user responds to location prompt.
let overlay = document.createElement("div");
let loader = document.createElement("div");
overlay.className = "overlay";
loader.className = "loader";

let mapContainer = document.getElementById("map-container");
mapContainer.appendChild(overlay);
mapContainer.appendChild(loader);

// Set position based on user location, if they grant it.
// Removes overlay and loader during success or failure.
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError)
}
else {
    alert("Please unable the browser to know your location or Geolocation is not supported by this browser.");
}

function setPosition(resp) {
    myMap.setView([resp.coords.latitude, resp.coords.longitude], 10);
    mapContainer.removeChild(overlay);
    mapContainer.removeChild(loader);
}

function showError() {
    console.log("Location denied.");
    mapContainer.removeChild(overlay);
    mapContainer.removeChild(loader);
}
