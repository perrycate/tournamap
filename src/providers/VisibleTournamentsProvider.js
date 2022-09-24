import {useMemo, useRef, useState} from 'react';

import VisibleTournamentsContext from 'contexts/VisibleTournamentsContext';
import VisibleTournamentsTrackingContext from 'contexts/VisibleTournamentsTrackingContext';

import useDebouncedState from 'use/useDebouncedState';

const VISIBILITY_CHANGE_DEBOUNCE_WAIT_MS = 250;

const VisibleTournamentsProvider = ({ children }) => {
    const [visibleTournamentsProps, setVisibleTournamentsProps] = useState(new Set());

    const watchedElementToTournamentPropsRef = useRef(new Map());

    const visibleTournamentsDebounced = useDebouncedState(
        visibleTournamentsProps,
        VISIBILITY_CHANGE_DEBOUNCE_WAIT_MS
    );

    const intersectionObserverRef = useRef(
        // The intersection observer callback will be called whenever a marker enters or exits the map viewport.
        new IntersectionObserver((entries) => {
            setVisibleTournamentsProps((visibleTournaments) => {
                const currentlyVisibleTournaments = new Set(visibleTournaments);

                entries.forEach((entry) => {
                    const props = watchedElementToTournamentPropsRef.current.get(entry.target);
                    if (!props) {
                        throw Error('Expected props to not be null.');
                    }

                    if (entry.isIntersecting) {
                        currentlyVisibleTournaments.add(props);
                    } else {
                        currentlyVisibleTournaments.delete(props);
                    }
                });

                return currentlyVisibleTournaments;
            });
        })
    );

    const trackingContextValue = useMemo(() => ({
        watch: (element, props) => {
            watchedElementToTournamentPropsRef.current.set(element, props);

            intersectionObserverRef.current.observe(element);
        },
        unwatch: (element) => {
            intersectionObserverRef.current.unobserve(element);

            const props = watchedElementToTournamentPropsRef.current.get(element);
            if (props) {
                setVisibleTournamentsProps((visibleTournaments) => {
                    const currentlyVisibleTournaments = new Set(visibleTournaments);

                    currentlyVisibleTournaments.delete(props);

                    return currentlyVisibleTournaments;
                });
            }

            watchedElementToTournamentPropsRef.current.delete(element);
        },
    }), []);

    const visibleTournamentsArray = useMemo(() => (
        Array.from(visibleTournamentsDebounced)
    ), [visibleTournamentsDebounced]);

    return (
        <VisibleTournamentsTrackingContext.Provider value={trackingContextValue}>
            <VisibleTournamentsContext.Provider value={visibleTournamentsArray}>
                {children}
            </VisibleTournamentsContext.Provider>
        </VisibleTournamentsTrackingContext.Provider>
    );
};

export default VisibleTournamentsProvider;
