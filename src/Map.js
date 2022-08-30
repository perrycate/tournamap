"use strict";

import {useEffect, useState} from "react";
import "leaflet/dist/leaflet.css";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {LayerGroup} from "react-leaflet/LayerGroup";
import {useMap} from "react-leaflet/hooks";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import icon2x from "leaflet/dist/images/marker-icon-2x.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// We need to override the icon locations due to shenanigans in react-leaflet.
let defaultIcons = new L.Icon.Default();
defaultIcons.options.iconUrl = icon;
defaultIcons.options.iconRetinaUrl = icon2x;
defaultIcons.options.shadowUrl = iconShadow;

const DEFAULT_ZOOM_LEVEL = 10;
const LOCATION_CACHE_KEY = "userLatLng";

const useCachingGetLocation = () => {

    const FALLBACK_LOCATION_VALUE = [51.505, -0.09];
    const [mapCenter, setMapCenter] = useState(FALLBACK_LOCATION_VALUE);
    const [locationLoading, setLocationLoading] = useState(true);

    const locationLoadingCaching = () => {
        let locationCacheHit = false;
        let cachedLocationStr = localStorage.getItem(LOCATION_CACHE_KEY);
        if (cachedLocationStr == null) {
            console.log("User location not set in local storage.");
        } else {
            const location = JSON.parse(cachedLocationStr);
            setMapCenter(location)

            locationCacheHit = true;
        }
        return locationCacheHit;
    }

    const cacheLocation = async () => {

        const cacheLocation = (location) => {
            localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify([location.coords.latitude, location.coords.longitude]));
        };

        await navigator.geolocation.getCurrentPosition(cacheLocation, (err) => {
            setLocationLoading(false)
        });
    }

    const setPosition = async () => {

        const setMap = (location) => {
            setMapCenter([location.coords.latitude, location.coords.longitude]);
            setLocationLoading(false);
        };

        await navigator.geolocation.getCurrentPosition(setMap, (err) => {
            setLocationLoading(false)
        });
    }

    // Attempt to get location from the browser once.

    useEffect(() => {

        let locationCacheHit = locationLoadingCaching();

        if (locationCacheHit) {
            setLocationLoading(false);
        } else {
            cacheLocation().catch(console.error);
            setPosition().catch(console.error);
        }
    }, []);

    return { mapCenter, locationLoading };
}

const Map = () => {
    const [tourneyData, setTourneyData] = useState([]);
    // Until this is false, we wish to convey to the user that the view may suddenly
    // change (for example, when the user's location is finished loading from the browser.)
    // If we hit the location cache when this module was first loading, the view is probably
    // close to where the user actually is, and thus should not
    // suddenly change.
    const { mapCenter, locationLoading } = useCachingGetLocation();

    // Load tournament data once.
    useEffect(() => {
        fetch("tournaments.json")
            .then(resp => resp.json().then(setTourneyData));
    }, []); // Passing in empty array means this only runs once.

    return <>
        <a href="http://mapbox.com/about/maps" className="mapbox-logo" target="_blank">Mapbox</a>
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
                        <Marker key={tourneyJSON.url} position={tourneyJSON.location} icon={defaultIcons}>
                            <Popup>
                                <h2>
                                    <a href={tourneyJSON["url"]} target="_blank">{tourneyJSON["name"]}</a>
                                </h2>
                                <p>{new Date(tourneyJSON["start_time"] * 1000).toLocaleString()}</p>
                            </Popup>
                        </Marker>
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
