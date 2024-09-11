"use client";

import React, { useEffect, useState } from 'react';0
import './clanstatus.css';
import Image from 'next/image';
import { HiMiniUserGroup } from "react-icons/hi2";
import FAvatar from '../../../friendsAvatar/fAvatar';
import ClanBottomBar from './clanBottomBar';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

export const getImageUrl = (imagePath) => {
  if (imagePath && imagePath != 'lol') {
    if (imagePath.startsWith('/media/media/')) {
      imagePath = imagePath.substring(6);
    }
    return `${API_ADDRESS}${imagePath}`;
  } else if (imagePath == 'lol') {
    return 'https://i.pinimg.com/736x/6e/37/4f/6e374fd5eb3d81dc0e50643d2710a906.jpg';
  }
  else {
    return 'https://cdn-icons-png.flaticon.com/512/5220/5220262.png';
  }
};


const MumbersRow = ({mumber, status="admin"}) => {
    return (
            <div className='flex justify-between items-center h-[60px] w-[90%] text-gray-400 bg-black bg-opacity-60
                           hover:bg-aqua-pong hover:text-black hover:bg-opacity-100  animate-out-slow sm:scale-100 scale-75
                           rounded-lg p-2'>
                <div className='flex justify-evenly items-center h-full flex-grow'>
                  <FAvatar
                      image={getImageUrl(mumber?.profile_image)}
                      id={mumber?.userID}
                      name={mumber?.username}
                      width={40}
                      height={40}
                      status={""}
                      userr={mumber}
                  />
                  <div className='flex flex-col justify-center items-start h-full flex-grow text-xs'>
                    <p >{mumber?.username}</p>
                    <p >{status}</p>
                  </div>
                </div>
                <div className='flex justify-center items-center h-full w-[42%] text-center'>
                  <p className='text-xl'>{mumber?.score}</p>
                </div>
            </div>
    );
}

                

const getTargetClan = (selectedClan, conversationRef) => {

    const clanMumbers = () => {
        return (
          <div className='clanMumbers'>
              <MumbersRow key={1} mumber={selectedClan?.admin} />
              {selectedClan?.users.map((mumber, index ) => (
                mumber.username !== selectedClan.admin.username && 
                <MumbersRow key={index + 1} mumber={mumber} status="mumber" />
              ))}
            </div>
        );
    }
    

    const TopBar = () => {
        return (
            <nav className='flex justify-evenly items-center flex-row-reverse  h-[80px] w-full bg-aqua-pong opacity-60 rounded-t-xl '>
                <div className='flex justify-center items-center h-full w-[50%] sm:scale-100 scale-75  '>
                    <HiMiniUserGroup className='text-4xl' />
                    <p className='text-xl'>{selectedClan?.users?.length}/10</p> 
                </div>
                <div className='flex justify-center gap-2 items-center h-full w-[50%] sm:scale-100 scale-75 '>
                    <label htmlFor="clan-icon" className='cursor-pointer '>
                        <Image 
                        src={`/clans/blackIcons/${selectedClan?.icon}.png`} 
                        alt="clanIcon" 
                        width={40} 
                        height={40} 
                        />
                    </label>
                    <p className='text-xl'>{selectedClan?.name}</p> 
                </div>
            </nav>
        );
    }

    return(
        <div className='flex justify-center items-center flex-col h-full w-full '>
            <TopBar />
            {clanMumbers()}
            <ClanBottomBar selectedClan={selectedClan} conversationRef={conversationRef} />
        </div>
    );
}


const ClansIconAnimation = () => {
    const ClansIcons = ["Bios", "Commodore", "Freax", "Pandora"];
    const [currentIconIndex, setCurrentIconIndex] = useState(0);
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIconIndex((prevIndex) => (prevIndex + 1) % ClansIcons.length);
      }, 2100);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <label className="flex justify-center items-center h-auto w-auto animate-pulse rounded-full cursor-pointer overflow-hidden sm:scale-100 scale-75 ">
        <Image 
          src={`/clans/${ClansIcons[currentIconIndex]}.png`} 
          alt="clanIcon" 
          width={150} 
          height={150} 
        />
      </label>
    );
  }


const Clanstatus = ({selectedClan, conversationRef}) => {

  return (
    <div className='clanstatus'>
      {selectedClan?.length === 0 ? <ClansIconAnimation /> : getTargetClan(selectedClan,conversationRef )}
    </div>
  );
}

export default Clanstatus;
