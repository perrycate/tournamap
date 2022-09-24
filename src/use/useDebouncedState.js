import {useRef, useEffect, useState} from 'react';

/*
 Debouncing is a technique for preventing expensive operations from being performed too frequently.

 The basic idea is that a debounced function will only run once a certain amount of time passes
 after the LAST time it is called. If it is called before the time is up the timer is reset.

 For example consider a situation where we need to make an expensive network call in response to user input,
 it could be some kind of search box with autosuggestions. If we only perform the request once the user is done
 typing as opposed to performing it after every keypress, it will both reduce the load on our server and improve
 user experience.

 In case of this hook, instead of debouncing a function we're debouncing a piece of state. This is useful if we
 want to run some expensive effect whenever some state changes.
*/
const useDebouncedState = (state, wait) => {
    const [debouncedState, setDebouncedState] = useState(state);

    const timeoutRef = useRef(null);

    useEffect(() => {
        timeoutRef.current = setTimeout(() => {
            setDebouncedState(state);
        }, wait);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);

                timeoutRef.current = null;
            }
        };
    }, [state, wait]);

    return debouncedState;
};

export default useDebouncedState;
