"use client";

import { createContext } from "react";

const getProfiledata = createContext();

function GetProfiledataProvider({ children }) {
    
  return (
    <getProfiledata.Provider >
        {children}
    </getProfiledata.Provider>
  );
}