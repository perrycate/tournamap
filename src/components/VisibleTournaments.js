import {useContext} from 'react';

import TournamentList from "./TournamentList";

import VisibleTournamentsContext from 'contexts/VisibleTournamentsContext';

const VisibleTournaments = () => {
    const tournaments = useContext(VisibleTournamentsContext);

    return (
        <TournamentList items={tournaments} placeholder="No tournaments in sight :(" />
    );
};

export default VisibleTournaments;
