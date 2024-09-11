import { createContext } from "react";

const webSocketContext = createContext({
    val : 'default',
    game : {},
    user : 0
});

const ThemeContext = createContext(null);

export {webSocketContext} ;
export {ThemeContext};


