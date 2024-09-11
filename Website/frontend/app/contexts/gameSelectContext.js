"use client";

import { createContext ,useEffect,useState } from 'react';
import axios from 'axios';
export const GameSelectContext = createContext();

const ChoseModeContext = ({children}) => {

    const [map, setMap] = useState("AQUA");
    const [multiplayer, setMultiplayer] = useState(0);
    const gameValues = {map, setMap, multiplayer, setMultiplayer};
    return (
        <GameSelectContext.Provider value={gameValues}>
            {children}
        </GameSelectContext.Provider>
    );
}

export default ChoseModeContext;