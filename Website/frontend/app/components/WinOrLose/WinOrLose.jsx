"use client";

import React from 'react';
import {createPortal} from 'react-dom';
import { useRouter } from 'next/navigation';
import './WinOrLose.css';

const WinOrLose = ({winOrLose}) => {

    const router = useRouter();
    return (
        createPortal(
            <div className="container flex sm:text-4xl text-xl bg-black fixed bg-opacity-50 backdrop-blur-md h-[50%] max-h-[500px] max-w-[600px] w-[50%] z-[10001] justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <h1 style={{"--color--hover": `${winOrLose.toLowerCase() === "win" ? "aqua" : "#ef4444"}`}} onClick={() => router.push("/homePage")}>
                <span>You</span><span>{winOrLose}</span>
                </h1>
            </div>,
            document.body
        )
    );
}

export default WinOrLose;
