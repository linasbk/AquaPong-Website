"use client";
import { useRef, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from '../../contexts/UserContext';
import ReactDOM from 'react-dom';
import FAvatar from '../friendsAvatar/fAvatar';
import Image from 'next/image';
import "./extraStyles.css";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

async function addFriend(userId, notificationUserID) {
    try {
        axios.post(`${API_ADDRESS}/notification/add_friend/${notificationUserID}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error("Add Friend Error:", error.response ? error.response.data : error.message);
    }
  }
  
const FriendsList = ({ setPlusModal }) => {
    const { userInfo } = useContext(UserContext);
    const userId = userInfo?.id;
    const [usersData, setUserData] = useState([]);
    useEffect(() => {
        axios.post(`${API_ADDRESS}/chat/Users`,
        {
            username: userInfo?.username
        })
            .then(response => {

                setUserData(response.data);

            })
            .catch(error => console.error(error));
    }, [userId]);
    return ReactDOM.createPortal(
        <div className="row-start-2 col-start-2 relative bg-[rgba(0,0,0,0.3)] backdrop-blur-sm h-full w-full z-[100] flex justify-center items-center shadow-xl" onClick={() => setPlusModal(false)}>
            <ul className='modal flex  relative  gap-2 flex-col w-[50%] min-w-[300px] h-[50%] min-h-[300px] bg-[rgba(0,0,0,1)] rounded-lg'  onClick={(e) => e.stopPropagation()}>
                {usersData.length > 0 ? usersData?.map((item) => (
                    <li key={item.username} className="flex text-white bg-black bg-opacity-60 justify-evenly items-center relative h-[80px] w-[100%]"  onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-center w-[33%]">
                            <FAvatar
                                id={item.userID}
                                name={item.username}
                                image={`${API_ADDRESS}${item.profile_image}`}
                                width={50}
                                height={50}
                                status={item.status}
                                userr={item}
                            />
                        </div>
                        <span className="text-left flex justify-center w-[33%]">{item.username}</span>
                        <div className="flex items-center justify-center w-[33%] ">
                            <Image
                                className="cursor-pointer "
                                src={
                                    item.friends == 2 ? "/requestfriend.svg" :
                                        "/addfriend.svg"
                                }
                                alt="friend action"
                                width={30}
                                height={30}
                                onClick={async () => {
                                    try {
                                        if (item.friends == 1) 
                                            await addFriend(userInfo.id, item.userID);
                                        }  
                                    catch (error) {
                                        console.error("Error handling friend action:", error);
                                    }
                                    setPlusModal(false);
                                }}
                            />
                        </div>
                    </li>
                )) : 
                <li className="flex justify-center items-center h-full w-full">
                    <h1 className="text-white">No Users Found</h1>
                </li>
            }

            </ul>
        </div>,
        document.body
    );
};

export default FriendsList;