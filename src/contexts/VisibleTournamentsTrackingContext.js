import React from 'react';

const noop = () => {
    throw Error('VisibleTournamentsTrackingContext provider required');
};

const VisibleTournamentsTrackingContext = React.createContext({
    watch: noop,
    unwatch: noop,
});

export default VisibleTournamentsTrackingContext;
