"use strict";
let myMap = L.map("mapid").setView([51.505, -0.09], 4);
let OpenStreetMap_Mapnik = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3JhdmlkZGQiLCJhIjoiY2wwZDh3eDE2MDZ1OTNrcGYybjhsNmN2diJ9.cPvRZK6WTt_wjQSa-DzblQ", {
    maxZoom: 13,
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
}).addTo(myMap);

// Fetch tournament data and add pins to the map for each tournament.
fetch("tournaments.json").then((resp) => {
    resp.json().then((parsed_tourneys) => {
        let tourney_markers = parsed_tourneys.map((tourney) => {
            let { lat, lng } = tourney["location"];
            return L.marker().setLatLng([lat, lng]).bindPopup(popupFor(tourney));
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
    alert("Please enable the browser to know your location or Geolocation is not supported by this browser.");
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

// Returns a string containing the html code that should be embedded in a leaflet
// map popup for a particular tourney.
function popupFor(tourney) {
    return `
<h2><a href=${tourney["url"]} target="_blank">${tourney["name"]}</a></h2>
<p>${new Date(tourney["start_time"] * 1000).toLocaleString()}</p>
`
}