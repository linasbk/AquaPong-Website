"use client";
import React from 'react';
import { HiMiniUserGroup } from "react-icons/hi2";
import Image from 'next/image';

const TopBarJoined = ({clanData}) => {
    return (
        <nav className='flex justify-evenly items-center flex-row-reverse  sm:h-[80px] h-[60px] w-full bg-aqua-pong opacity-60 rounded-t-xl '>
        <div className='flex justify-center items-center h-full w-[50%] sm:scale-100 scale-75  '>
            <HiMiniUserGroup className='text-4xl' />
            <p className='sm:text-xl text-xs'>{clanData?.users?.length}/10</p>
        </div>
        <div className='flex justify-center gap-2 items-center h-full w-[50%] sm:scale-100 scale-75 '>
            <label htmlFor="clan-icon" className='cursor-pointer '>
                <Image 
                src={`/clans/blackIcons/${clanData.icon}.png`} 
                alt="clanIcon" 
                width={40} 
                height={40} 
                />
            </label>
            <p className='sm:text-xl text-xs'>{clanData.name}</p> 
        </div>
    </nav>
    );
}

export default TopBarJoined;
