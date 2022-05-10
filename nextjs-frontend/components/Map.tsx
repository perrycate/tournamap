import { FC } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { TournamentType } from "../pages";

const DEFAULT_ZOOM_LEVEL = 10;

interface MapProps {
  location: [number, number];
  tournaments: TournamentType[];
}
const Map: FC<MapProps> = ({ location, tournaments }) => {
  return (
    <MapContainer
      center={location}
      zoom={DEFAULT_ZOOM_LEVEL}
      worldCopyJump={true}
      className="flex-1"
    >
      <a
        href="http://mapbox.com/about/maps"
        className="mapbox-logo"
        target="_blank"
      >
        Mapbox
      </a>
      <TileLayer
        maxZoom={14}
        minZoom={3}
        maxNativeZoom={11}
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3JhdmlkZGQiLCJhIjoiY2wwZDh3eDE2MDZ1OTNrcGYybjhsNmN2diJ9.cPvRZK6WTt_wjQSa-DzblQ"
      />
      {tournaments.map((tourney, idx) => (
        <Marker
          position={[
            Number(tourney.location.lat),
            Number(tourney.location.lng),
          ]}
          key={idx}
        >
          <Popup>
            <a
              href={tourney.url}
              target="_blank"
              className="underline text-blue-900 hover:text-blue-800 visited:text-purple-600 font-semibold text-lg leading-6"
            >
              {tourney.name}
            </a>
            <p>{new Date(tourney.start_time * 1000).toLocaleString()}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
export default Map;
