"use client";

import React, { useEffect, useState, useContext, use } from 'react';
import styles from './rightSideBar.module.css';
import FAvatar from '../friendsAvatar/fAvatar';
import { FaCirclePlus } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { MdMessage } from "react-icons/md";
import { UserContext } from '../../contexts/UserContext';
import Freindlist from '../freindsList/freindsList';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const API_ADDRESS_WS = process.env.NEXT_PUBLIC_WS_URL;


const getImageUrl = (imagePath) => {
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


  


function RightSideBar() {
  
  const [plusModal, setplusModal] = useState(false);
  const { userInfo } = useContext(UserContext);
  
  const userId = userInfo?.id;
  const [userData, setUserData] = useState([]);
  const [msg_usersData, set_msg_UserData] = useState([]);

  useEffect(() => {
    if (!userId) 
      return;

    const usersSocket = new WebSocket(`${API_ADDRESS_WS}/UserI/`);

    usersSocket.onopen = () => {
      if (usersSocket.readyState === WebSocket.OPEN) {
        usersSocket.send(JSON.stringify({ my_username: userInfo.username,online:"online" }));
      }
    };
  
    usersSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const userExists = data.some(user => user.user);
      if (userExists) {
        set_msg_UserData(data);

      } else {
        setUserData(data);
      }

    };
  
    usersSocket.onerror = (error) => {
      console.error('WebSocket (users) Error:', error);
    };
  
    return () => {

      if (usersSocket.readyState === WebSocket.OPEN || usersSocket.readyState === WebSocket.CONNECTING) {
        usersSocket.close();
      }
    };
  }, [ ]);
  return (
      <div className={styles.barContainer}>
        <span className={`${styles.freinds} `}><FaUserFriends /></span>
        <div className={styles.statusBar}>
        {userData  && userData.map((friend , index) => (
          <span key={index}>
            <FAvatar 
              keys={index}
              image={`${API_ADDRESS}/${friend.profile_image}`}  
              name={friend.username}
              width={40}
              height={40} 
              id={friend.userID}
              status={friend.status}
              userr={friend}
            />
          </span>
          ))}
          <span className={`${styles.plus} `} onClick={() => setplusModal(true)}><FaCirclePlus /></span>
          {plusModal && <Freindlist setPlusModal={setplusModal}/>}
        </div>
        <span className={`${styles.message} `}><MdMessage /></span>
        <div className={styles.messageBar}>
        {msg_usersData.map((friendsData, index) => (
          friendsData.unread_messages > 0 && (
            <span key={index}>
              <FAvatar
                keys={friendsData.user.userID}
                id={friendsData.user.userID}
                name={friendsData.user.username}
                image={getImageUrl(friendsData.user.profile_image)}
                width={50}
                height={50}
                status={friendsData.user.status}
                userr={friendsData.user}
              />
            </span>
          )
        ))}
              </div>
      </div>
  );
}

export default RightSideBar;