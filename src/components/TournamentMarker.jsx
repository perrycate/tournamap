import {useEffect, useRef, memo, useContext, useCallback} from 'react';

import L from 'leaflet';
import * as ReactLeaflet from 'react-leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import icon2x from 'leaflet/dist/images/marker-icon-2x.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import VisibleTournamentsTrackingContext from 'contexts/VisibleTournamentsTrackingContext';

// We need to override the icon locations due to shenanigans in react-leaflet.
let defaultIcon = new L.Icon.Default();
defaultIcon.options.iconUrl = icon;
defaultIcon.options.iconRetinaUrl = icon2x;
defaultIcon.options.shadowUrl = iconShadow;

const TournamentMarker = memo(({ tournament }) => {
    const markerRef = useRef(null);

    // I don't like having to pull watch and unwatch from a function, but
    // we need to give an intersection observer direct access to the DOM element
    // containing each marker _somehow_, and trying to pass that state up to parents
    // seems even worse.
    const { watch, unwatch } = useContext(VisibleTournamentsTrackingContext);

    const openPopup = useCallback(() => {
        markerRef.current?.togglePopup();
    }, []);

    useEffect(() => {
        const element = markerRef.current?.getElement();
        if (!element) {
            return;
        }

        watch(element, { tournament, onClick: openPopup });

        return () => {
            unwatch(element);
        };
    }, [tournament, watch, unwatch, openPopup]);

    return (
        <ReactLeaflet.Marker ref={markerRef} key={tournament.url} position={tournament.location} icon={defaultIcon}>
            <ReactLeaflet.Popup>
                <h2>
                    <a href={tournament['url']} target="_blank">{tournament['name']}</a>
                </h2>
                <p>{new Date(tournament['start_time'] * 1000).toLocaleString()}</p>
            </ReactLeaflet.Popup>
        </ReactLeaflet.Marker>
    );
});

export default TournamentMarker;
