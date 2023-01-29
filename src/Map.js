import {useEffect, useState} from "react";
import "leaflet/dist/leaflet.css";
import {MapContainer, TileLayer} from "react-leaflet";
import {LayerGroup} from "react-leaflet/LayerGroup";
import {useMap} from "react-leaflet/hooks";

import TournamentMarker from 'components/TournamentMarker'

const DEFAULT_ZOOM_LEVEL = 10;
const LOCATION_CACHE_KEY = "userLatLng";
const FALLBACK_INITIAL_LOCATION = [51.505, -0.09]; // London or something idk.

// Returns the user's location.
// May load from the browser's geolocaton API, or from a localstorage cache.
//
// NOTE:
// If the cached location is substantially different from the user's actual
// location, we DO NOT modify the map position, and only silently update
// the cache for next time.
// Because the browser's geolocation API can take on the order of seconds to
// finish, the user may have already started scrolling on the map, and may not
// want the location to suddenly jump.
// One day it would be nice to have a popup explicitly asking if they want to
// jump to the new location. Until then, we prefer not to interrupt whatever
// the user was doing, and instead cache it for the next time the page is loaded.
const getLocation = () => {
    // Kick off process to fetch our location and update the cache.
    // We may not need to return this if we have a cache entry, but
    // we will always want to run it so we update the cache with the
    // new location if it changed.
    const slowLocationAPIPromise = new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((location) => {
            // Cache location for future use.
            console.log("Stored user location in local storage.")
            location = [location.coords.latitude, location.coords.longitude];
            localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(location));

            resolve(location);
        }, (err) => {
            console.log(err);
            reject(err);
        });
    });

    // Return location from cache immedately if it is available.
    const cachedLocationStr = localStorage.getItem(LOCATION_CACHE_KEY);
    if (cachedLocationStr != null) {
        return Promise.resolve(JSON.parse(cachedLocationStr))
    }

    // Otherwse, wait for the slower process.
    console.log("User location not set in local storage.");
    return slowLocationAPIPromise;
}

const Map = () => {
    const [tourneyData, setTourneyData] = useState([]);
    const [mapCenter, setMapCenter] = useState(FALLBACK_INITIAL_LOCATION);
    const [locationLoading, setLocationLoading] = useState(true);

    // Fetch location on first render.
    useEffect(() => {
        getLocation()
          .then((location) => {
            setMapCenter(location);
          })
          .finally(() => {
            setLocationLoading(false);
        });
    }, []);

    // Load tournament data on first render.
    useEffect(() => {
        fetch("tournaments.json")
            .then(resp => resp.json().then(setTourneyData));
    }, []);

    return <>
        <a href="http://mapbox.com/about/maps" className="mapbox-logo" target="_blank" rel="noreferrer">Mapbox</a>
        <MapContainer center={mapCenter} zoom={DEFAULT_ZOOM_LEVEL} id="map" worldCopyJump={true}>
            {locationLoading && <>
                <div className="overlay"></div>
                <div className="loader"></div>
            </>}
            <ViewChanger center={mapCenter}/>
            <TileLayer
                attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
                url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3JhdmlkZGQiLCJhIjoiY2wwZDh3eDE2MDZ1OTNrcGYybjhsNmN2diJ9.cPvRZK6WTt_wjQSa-DzblQ"
                maxZoom={14}
                minZoom={3}
                maxNativeZoom={11}
            >
            </TileLayer>
            <LayerGroup>
                {
                    tourneyData.map((tourneyJSON) =>
                        <TournamentMarker key={tourneyJSON.url} tournament={tourneyJSON} />
                    )
                }
            </LayerGroup>
        </MapContainer>
    </>
}

// The view location (center, zoom) as set in the MapContainer properties only
// affects the INITIAL view location. Anything after the fact must be set using
// the useMap() hook, which is only available to children of MapContainer.
// It's wonky but whatever.
const ViewChanger = ({center}) => {
    const map = useMap() // prefer const over let
    map.setView(center, map.zoom);
    return null;
}

export default Map;
