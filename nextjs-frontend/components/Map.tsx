import { FC } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const DEFAULT_ZOOM_LEVEL = 10;

interface MapProps {
  location: [number, number];
  markers: [number, number][];
}
const Map: FC<MapProps> = ({ location, markers }) => {
  return (
    <MapContainer
      center={location}
      zoom={DEFAULT_ZOOM_LEVEL}
      worldCopyJump={true}
      className="absolute top-0 left-0 bottom-0 right-0 -z-50"
    >
      <TileLayer
        maxZoom={14}
        minZoom={3}
        maxNativeZoom={11}
        attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>'
        url="https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ3JhdmlkZGQiLCJhIjoiY2wwZDh3eDE2MDZ1OTNrcGYybjhsNmN2diJ9.cPvRZK6WTt_wjQSa-DzblQ"
      />
      {markers.map((marker, idx) => (
        <Marker position={marker} key={idx}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
export default Map;
