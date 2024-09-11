"use client";

import styles from './matchHistory.module.css';
import FAvatar from '../../friendsAvatar/fAvatar';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

import React, { useState } from 'react';

const formatTime = (timestamp) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleTimeString('en-US', options);
  };

const SoloRow = (soloData, index) => {
    const date = soloData.time || "2024-08-31";

    return (
        <div className='w-full h-auto bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,1)] flex justify-evenly relative flex-wrap text-rfs' key={index}>
            <div className='flex justify-start items-center w-[30%] flex-wrap'>
                <FAvatar id={soloData.CurrentUser.userID} userr={soloData.CurrentUser} image={`${API_ADDRESS}${soloData.CurrentUser.profile_image}`} name={soloData.CurrentUser.username} width={50} height={50} />
                <span className='text-my-grey'>{soloData.CurrentUser.username}</span>
            </div>
            <div className='flex justify-center items-center w-[30%] h-full flex-col relative'>
                <span className='text-my-grey'>Score</span>
                <span className={`${(soloData.StatusMatch === "Win" ? 'text-aqua-pong' : 'text-red-400')}`}>{soloData.MatchResault}</span>
                <div
                    className="absolute flex-row-reverse top-0 left-0 w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 hover:bg-black"
                    style={{ content: `"${formatTime(date)}"` }}
                >
                    <span className="text-gray-400 text-xs">{formatTime(date)}</span>
                </div>
            </div>
            <div className='flex justify-end items-center w-[30%] flex-wrap-reverse'>
                <span className='text-my-grey'>{soloData.TargetUser.username}</span>
                <FAvatar id={soloData.TargetUser.userID} userr={soloData.TargetUser} image={`${API_ADDRESS}${soloData.TargetUser.profile_image}`} name={soloData.TargetUser.username} width={50} height={50} />
            </div>
        </div>
    );
};


const TornRow = (tournamentData, index) => {
    
    const date = tournamentData.time || "2024-08-31";
    const getRankIcon = (ranking) => {
        if (ranking === 1)
            return (<span className='text-aqua-pong' >#1</span>);
        else if (ranking === 2)
            return (<span className='text-aqua-pong' >#2</span>);
        else if (ranking === 3)
            return (<span className='text-aqua-pong' >#3</span>);
        else
            return (<span className='text-my-grey' >#4</span>);
    }
    
    return (
        <div className='w-full h-auto bg-[rgba(0,0,0,0.1)] hover:bg-[rgba(0,0,0,1)] flex justify-evenly relative flex-wrap ' key={index}>
            <div className='flex justify-start items-center w-[30%] flex-wrap-reverse'>
                <FAvatar
                    id={tournamentData.CurrentUser.userID}
                    userr={tournamentData.CurrentUser} 
                    image={`${API_ADDRESS}${tournamentData.CurrentUser.profile_image}`} 
                    name={tournamentData.CurrentUser.username} 
                    width={50} 
                    height={50} 
                />
                <span className='text-my-grey'>{tournamentData.CurrentUser.username}</span>
            </div>
            <div className='flex justify-center items-center w-[30%] h-full flex-col'>
                <div
                    className="z-[1000] absolute top-0 left-0 w-full h-full flex justify-center items-center opacity-0 hover:opacity-100 hover:bg-black"
                    style={{ content: `"${formatTime(date)}"` }}>
                    <span className="text-gray-400 text-xs">{formatTime(date)}</span>
                </div>
                {getRankIcon(tournamentData.Ranking)}
                <span className={`${(tournamentData.StatusMatch === "Win" ? 'text-aqua-pong ' : 'text-my-grey flex')}`}>{tournamentData.MatchResult}</span>
            </div>
            <div className='flex justify-end items-center w-[30%] flex-wrap-reverse'>
                <span className='text-my-grey'>{tournamentData.TargetUser.username}</span>
                <FAvatar 
                    userr={tournamentData.TargetUser} 
                    image={`${API_ADDRESS}${tournamentData.TargetUser.profile_image}`} 
                    name={tournamentData.TargetUser.username} 
                    width={50} 
                    height={50}
                    id={tournamentData.TargetUser.userID} 
                />
            </div>
        </div>
    );
}

const Tournament = (matchHistoryTour) => {
    return (
        <div className={styles.tournament}>
            {matchHistoryTour.map((data, index) => (
                TornRow(data, index)
            ))}
        </div>
    );
}

const soloGames = (matchHistorySolo) => {
    return (
        <div className={styles.soloGames}>
            {matchHistorySolo.map((data, index) => {
                 return (
                    SoloRow(data, index)
                );
            }
            )}
        </div>
    );
} 

const MatchHistory = (props) => {
    const { matchHistorySolo, matchHistoryTour } = props;
    const [soloTorn, setSoloTorn] = useState(true);

    const getButtonColor = (soloTorn) => {
        if (soloTorn) {
            return 'text-aqua-pong bg-profile-bg shadow-pf';
        }
        return 'text-my-grey opacity-50 hover:opacity-100 transition duration-300 ease-in-out';
    }

    return (
        <div className='w-full h-full relative flex flex-col '>
            <span className='h-[15%] w-full text-2xl text-white flex justify-center text-center items-center'>Match history</span>
            <div className='h-[10%] w-full  flex items-center justify-evenly '>
                <button className={`text-rfs w-[50%] h-full  ${getButtonColor(!soloTorn)}`} onClick={() => setSoloTorn(false)}>Solo game</button>
                <button className={`text-rfs w-[50%] h-full  ${getButtonColor(soloTorn)}`} onClick={() => setSoloTorn(true)}>Tournament</button>
            </div>
            {soloTorn ? Tournament(matchHistoryTour) : soloGames(matchHistorySolo)}
        </div>
    );
}

export default MatchHistory;
