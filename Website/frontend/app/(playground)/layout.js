import React from 'react';
import RightSideBar from '../components/rightSideBar/rightSideBar'
import AuthWrapper from "../components/authWrapper/authWrapper";
import axios from 'axios';
import "./playgroundStyles.css"

const GameLayout= ({children}) =>{
    return(
        <>
         <AuthWrapper>
            {children}
         </AuthWrapper>
        </>
    )
}
export default GameLayout;