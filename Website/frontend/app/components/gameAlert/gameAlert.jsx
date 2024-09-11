"use client";
import {useEffect} from 'react';
import '../../../node_modules/react-toastify/dist/ReactToastify.css';
import "./gameAlert.css"
import { ToastContainer, toast } from 'react-toastify';
import {createPortal} from 'react-dom';
import axios from 'axios';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
async function accept_game_play(my_id,user_id,data,set_current_user,router)
 {

    try {
        const response = await  axios.post(`${API_ADDRESS}/notification/accept_game_req/${user_id}`,
        {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        });
   if(response.data.status === "online")
    {
        set_current_user(
            {
                id: 0,
                user:data.userID,
                friends: null,
                typing: false,
                interaction_time: new Date().toISOString(),
              }
        )
        router.push('/privateGame/');

    }
} catch (error) {
         console.error(error);
       }
return(false)
}


const GameAlert = ({GameRequestt,  userInfo,current_user ,set_current_user, setDialog,useRouter}) => {
    const router = useRouter();
    useEffect(() => {
        if (GameRequestt.length > 0) {
            GameRequestt.map(data => {
                toast(`🕹️ You have a new game request from ${data.userID.username}`, {
                    position: "top-center",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClick: () => 
                    {
                        accept_game_play(userInfo.id,data.userID.userID,data,set_current_user,router) 
                    }
                });
            });
        }
    }, [GameRequestt]);
    return (
        createPortal(
            <ToastContainer
                position="top-center"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                />
            , document.body)
    );
}

export default GameAlert;
