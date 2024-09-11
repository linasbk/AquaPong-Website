"use client";

import React, {useContext} from 'react';
import { createPortal } from 'react-dom';
import FAvatar from '../../friendsAvatar/fAvatar';
import './mainClan.css';
import {GroupContext} from '../../../contexts/groupContext';
import { UserContext } from '../../../contexts/UserContext';
import { MdHeartBroken } from "react-icons/md";
import { MdRoomPreferences } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

export const getImageUrl = (imagePath) => {
  if (imagePath && imagePath != 'lol') {
    if (imagePath.startsWith('/media/media/')) {
      imagePath = imagePath.substring(6);
    }
    return `${API_ADDRESS}/${imagePath}`;
  } else if (imagePath == 'lol') {
    return 'https://i.pinimg.com/736x/6e/37/4f/6e374fd5eb3d81dc0e50643d2710a906.jpg';
  }
  else {
    return 'https://cdn-icons-png.flaticon.com/512/5220/5220262.png';
  }
};


  
  const ClanPreference = ({ isOpen, onClose, clanData }) => {

    const { userInfo } = useContext(UserContext);
    const { conversationRef, isConnected } = useContext(GroupContext);
    if (!isOpen) return null;

    const DeleteClan = () => {

      return(<button onClick={() =>{
        if (isConnected && conversationRef.current) {
         conversationRef.current.send(
             JSON.stringify({
                 my_userID: userInfo?.id,
                 create_or_add: "delete_group",
             })
         );
       }
       window.location.reload()
      }} className='text-xl  flex justify-center items-center hover:text-black text-white bg-red-400 scale-75 sm:scale-100 rounded-md px-2 py-1'>Delete Clan<MdDeleteForever className='text-2xl'  /></button>
    );
  }

    const KickOrUpgrade = () => {
      return clanData.users.map((mumber, index) => (
        mumber.username != clanData.admin.username && 
      <div key={index} className='flex flex-row w-full h-[80px] pl-2 bg-black bg-opacity-70  justify-between items-center '>
        <div className='flex h-[80px] flex-row rela items-center w-[50%]'>
          <FAvatar image={getImageUrl(mumber.profile_image)} 
          name={mumber.username}
          width={50}
          height={50}
          status="none"
          id={mumber.userID}
          userr={mumber}
          />
          <p className='text-xs text-white'>{mumber.username}</p>
        </div>
        <div className='flex h-[80px] flex-row justify-evenly items-center w-[50%]'>
            <button onClick={() =>{
                   if (isConnected && conversationRef.current) {
                    conversationRef.current.send(
                        JSON.stringify({
                            my_userID: userInfo?.id,
                            create_or_add: "add_admin_user",
                            user_token:mumber.userID,
                            Group_name:clanData.name
                        })
                    );
                  }
              window.location.reload()
            }} className='text-xs text-black bg-aqua-pong scale-75 sm:scale-100 rounded-md px-2 py-1'>Upgrade</button>
            <button onClick={() =>{
                   if (isConnected && conversationRef.current) {
                    conversationRef.current.send(
                        JSON.stringify({
                            my_userID: userInfo?.id,
                            create_or_add: "remove_user",
                            user_token:mumber.userID,
                            Group_name:clanData.name
                        })
                    );
                  }
                  window.location.reload()
            }} className='text-xs text-white bg-red-400 scale-75 sm:scale-100 rounded-md px-2 py-1'>Kick</button>
        </div>
      </div>
      ))}
    
    return createPortal(
      <div className="modalContainer" onClick={onClose}>
      <div className="mumbersPreference relative flex justify-center flex-col gap-2 sm:w-[50%] w-[90%] h-[50%] overflow-scroll  bg-white " onClick={e => e.stopPropagation()}>
        {(clanData.users.length > 1) ?  KickOrUpgrade() : DeleteClan()}
      </div>
    </div>,
    document.body
  );
}

const ClanBottomBarJ = ({clanData, id}) => {
  const { userInfo } = useContext(UserContext);
  const { conversationRef, isConnected } = useContext(GroupContext);

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    if(clanData.admin.userID == id)
       var userStatus = "admin"
    else
     var userStatus = "mamber"
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    return (
      <>
        <div className='flex flex-row justify-evenly items-center w-full h-[60px]'>
          {userStatus === "admin" ? (
            <button 
              onClick={openModal} 
              className='flex justify-center gap-1 items-center h-full rounded-b-md w-full bg-white bg-opacity-20 hover:text-aqua-pong  text-white text-xs'
            >
              Clan Preferences <MdRoomPreferences className='text-xl' />
            </button>
          ) : (
            <button onClick={() =>{
              if (isConnected && conversationRef.current) {
                conversationRef.current.send(
                    JSON.stringify({
                        my_userID: userInfo?.id,
                        create_or_add: "leave_clan",
                        Group_name:clanData.name
                    })
                );
              }
              window.location.reload()
            }} className='h-full flex justify-center gap-1 items-center rounded-b-md w-full bg-white bg-opacity-20 hover:text-red-400   text-white text-xs'>
              Leave Clan<MdHeartBroken className='text-xl' />
            </button>
          )}
        </div>
        <ClanPreference isOpen={isModalOpen} onClose={closeModal} clanData={clanData} />
      </>
    );
  }

export default ClanBottomBarJ;
