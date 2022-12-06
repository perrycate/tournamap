import {useMemo, useRef, useState} from 'react';

import VisibleTournamentsContext from 'contexts/VisibleTournamentsContext';
import VisibleTournamentsTrackingContext from 'contexts/VisibleTournamentsTrackingContext';

import useDebouncedState from 'use/useDebouncedState';

const VISIBILITY_CHANGE_DEBOUNCE_WAIT_MS = 250;

/*
 * Keeps track of the tournaments currently visible on screen.
 * Provides to children contexts containing the set of currently visible tournaments,
 * and functions to begin watching new tournament elements.
 */
const VisibleTournamentsProvider = ({ children }) => {
    const [visibleTournamentsProps, setVisibleTournamentsProps] = useState(new Set());

    const watchedElementToTournamentPropsRef = useRef(new Map());

    const visibleTournamentsPropsDebounced = useDebouncedState(
        visibleTournamentsProps,
        VISIBILITY_CHANGE_DEBOUNCE_WAIT_MS
    );

    const intersectionObserverRef = useRef(
        // The intersection observer callback will be called whenever a marker enters or exits the map viewport.
        new IntersectionObserver((entries) => {
            setVisibleTournamentsProps((visibleTournamentsProps) => {
                // We need a new set here so that React realizes that the state has actually changed.
                const currentlyVisibleTournamentsProps = new Set(visibleTournamentsProps);

                entries.forEach((entry) => {
                    const props = watchedElementToTournamentPropsRef.current.get(entry.target);
                    if (!props) {
                        throw Error('Expected props to not be null.');
                    }

                    if (entry.isIntersecting) {
                        currentlyVisibleTournamentsProps.add(props);
                    } else {
                        currentlyVisibleTournamentsProps.delete(props);
                    }
                });

                return currentlyVisibleTournamentsProps;
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

    const visibleTournamentsPropsArray = useMemo(() => (
        Array.from(visibleTournamentsPropsDebounced)
    ), [visibleTournamentsPropsDebounced]);

    return (
        <VisibleTournamentsTrackingContext.Provider value={trackingContextValue}>
            <VisibleTournamentsContext.Provider value={visibleTournamentsPropsArray}>
                {children}
            </VisibleTournamentsContext.Provider>
        </VisibleTournamentsTrackingContext.Provider>
    );
};

export default VisibleTournamentsProvider;
