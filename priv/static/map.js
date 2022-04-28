"use strict";
const MAP_CONTAINER_ID = "map";

let myMap = L.map(MAP_CONTAINER_ID, {
  worldCopyJump: true,
}).setView([51.505, -0.09], 4);
let OpenStreetMap_Mapnik = L.tileLayer(
  "https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3JhdmlkZGQiLCJhIjoiY2wwZDh3eDE2MDZ1OTNrcGYybjhsNmN2diJ9.cPvRZK6WTt_wjQSa-DzblQ",
  {
    maxZoom: 14,
    minZoom: 3,
    maxNativeZoom: 11,
    attribution:
      '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
  }
).addTo(myMap);

// Fetch tournament data and add pins to the map for each tournament.
fetch("tournaments.json").then((resp) => {
  resp.json().then((parsed_tourneys) => {
    let tourney_markers = parsed_tourneys.map((tourney) => {
      let { lat, lng } = tourney["location"];
      return L.marker().setLatLng([lat, lng]).bindPopup(popupFor(tourney));
    });
    L.layerGroup(tourney_markers).addTo(myMap);
  });
});

// Set loader and overlay while user responds to location prompt.
let mapContainer = document.getElementById(MAP_CONTAINER_ID);
let overlay = document.createElement("div");
let loader = document.createElement("div");
overlay.className = "overlay";
loader.className = "loader";
mapContainer.appendChild(overlay);
mapContainer.appendChild(loader);

// Set map position based on user location, if they grant it.
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    // Success.
    (resp) => myMap.setView([resp.coords.latitude, resp.coords.longitude], 10),
    // Failure.
    () => console.log("Location denied by user.")
  );
} else {
  alert("Please enable the browser to know your location or Geolocation is not supported by this browser.");
}

// Remove the overlay even if location stuff failed so the user can still use the site.
mapContainer.removeChild(overlay);
mapContainer.removeChild(loader);

// Returns a string containing the html code that should be embedded in a leaflet
// map popup for a particular tourney.
function popupFor(tourney) {
  return `
<h2><a href=${tourney["url"]} target="_blank">${tourney["name"]}</a></h2>
<p>${new Date(tourney["start_time"] * 1000).toLocaleString()}</p>
`;
}
