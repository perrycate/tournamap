"use strict";
const MAP_CONTAINER_ID = "map";
const DEFAULT_ZOOM_LEVEL = 10;
const LOCATION_CACHE_KEY = "userLatLng";

// Check for a cached user location to use as the initial view.
let initial_location = [51.505, -0.09]; // Arbitrary fallback.
let location_cache_hit = false;
try {
  let cached_location_str = localStorage.getItem(LOCATION_CACHE_KEY);
  if (cached_location_str == null) {
    console.log("User location not set in local storage.");
  } else {
    // Make sure the cached data is in roughly the format we expect.
    let [lat, lng] = JSON.parse(cached_location_str);
    initial_location = [lat, lng];

    location_cache_hit = true; // Should be the last thing we do in case we get an exception.
  }
} catch (e) {
  console.log("Error while attempting to parse cached location from local storage:");
  console.log(e);
  localStorage.clear();
  console.log("Local storage cleared.");
}

let myMap = L.map(MAP_CONTAINER_ID, {
  worldCopyJump: true,
}).setView(initial_location, DEFAULT_ZOOM_LEVEL);
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

const overlay = document.createElement("div");
const loader = document.createElement("div");
overlay.className = "overlay";
loader.className = "loader";
const mapContainer = document.getElementById(MAP_CONTAINER_ID);
if (!location_cache_hit) {
  // Set loader and overlay while user responds to location permission prompt.
  // We don't need to do this if there was a cache hit, because the map is
  // probably already in the right place and should be made usable.
  mapContainer.appendChild(overlay);
  mapContainer.appendChild(loader);
}

// Attempt to get location from the browser.
getCurrentPosition()
  .then((location) => {
    // Cache location for future use.
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));

    // Only set the view if it hasn't been set yet.
    // We don't want to interfere with any scrolling
    // the user did while we were searching for the location.
    if (!location_cache_hit) {
      myMap.setView(location, DEFAULT_ZOOM_LEVEL);
    }
  })
  .catch((e) => console.log(e))
  .finally(() => {
    // Remove loader overlay, if applicable.
    if (!location_cache_hit) {
      mapContainer.removeChild(overlay);
      mapContainer.removeChild(loader);
    }
  });

// Returns a string containing the html code that should be embedded in a leaflet
// map popup for a particular tourney.
function popupFor(tourney) {
  return `
<h2><a href=${tourney["url"]} target="_blank">${tourney["name"]}</a></h2>
<p>${new Date(tourney["start_time"] * 1000).toLocaleString()}</p>
`;
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        // Success.
        (resp) => {
          resolve([resp.coords.latitude, resp.coords.longitude]);
        },
        // Failure.
        (e) => {
          reject(e);
        }
      );
    } else {
      alert("Please enable the browser to know your location or Geolocation is not supported by this browser.");
      reject();
    }
  });
}
