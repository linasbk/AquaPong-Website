"use client";

import React, {useEffect, useRef, useState,useContext} from 'react';
import ReactDOM from 'react-dom';
import './createClan.css';
import Image from 'next/image';
import Button from '../../../button/button';
import { UserContext } from '../../../../contexts/UserContext';
import {GroupContext} from '../../../../contexts/groupContext';

const CreatClans = ({setShowCreateClans}) => {
    const createClansPortal = useRef(null);
    const [ClanIcon , setClanIcon] = useState("Bios"); // Commodore Freax Pandora Bios
    const [Clantype, setClantype] = useState("Public");
    const [clanName, setClanName] = useState("");
    const [alertMsg , setErrormsg] = useState("");
    const { userInfo } = useContext(UserContext);
    const { conversationRef , isConnected } = useContext(GroupContext);



    useEffect(() => {
        const handleCloseCreateClans = (e) => {
            if (createClansPortal.current && !createClansPortal.current.contains(e.target)) {
                setShowCreateClans(false);
            }
        };
        document.addEventListener('click', handleCloseCreateClans);
        return () => {
            document.removeEventListener('click', handleCloseCreateClans);
        };
    }, []);

    const handleCreateClans = () => {
        if (clanName.length < 3 || clanName.length > 10) {
            setErrormsg("Clan name must be between 3 and 10 characters");
            return;
        }
        else {
            if(isConnected)
                {
                    conversationRef.current.send(JSON.stringify({
                    my_userID: userInfo?.id,
                    create_or_add: "create_group",
                    status:Clantype,
                    icon:ClanIcon,
                    Group_name:clanName
        
                }));
                }
   
                
                conversationRef.current.onmessage = (event) => {
                    const data = event.data;
                    setErrormsg(data); 
                    if (data == "successfully created") {
                        setTimeout(() => {
                            window.location.reload();
                        }, 500);
                    }
                  };
        }
    };
    return ReactDOM.createPortal(
        <div className="row-start-2 col-start-2 z-[1001] h-full w-full flex flex-col items-center justify-center bg-[rgba(0,0,0,0.7)] backdrop-blur-sm">
            <div className="cardForm flex-wrap " ref={createClansPortal}>
                <span className='text-white h-[10%] w-full flex justify-center items-center' >Create Clan</span>
                <div className="h-[60%] w-full  flex flex-col justify-center items-center">
                    <div className="flex justify-center items-center">
                        <input type="file" id="file" className="hidden" />
                        <label className="flex justify-center items-center h-[150px] w-[150px] animate-pulse  rounded-full cursor-pointer overflow-hidden">
                            <Image src={`/clans/${ClanIcon}.png`} alt="clanIcon" width={100} height={100} />
                        </label>
                    </div>
                    <div className="flex justify-center items-center mt-4">
                        <select name="clanIcon" id="clanIcon" className="cursor-pointer flex text-center bg-aqua-pong  hover:bg-opacity-50  w-40 h-10" onChange={(e) => setClanIcon(e.target.value)}>
                            <option value="Bios">Bios</option>
                            <option value="Commodore">Commodore</option>
                            <option value="Freax">Freax</option>
                            <option value="Pandora">Pandora</option>
                        </select>
                        
                    </div>
                    <div className="flex justify-center items-center mt-4 flex-col gap-3">
                        <input type="text" placeholder="Clan Name" className=" w-40 h-10 text-center text-white bg-aqua-pong bg-opacity-0 border-[#b7faf9]  focus:border-aqua-pong  border-[1px]  focus:border-2 focus:outline-none" onChange={(e) => setClanName(e.target.value)} />
                        <div className='text-white w-full flex justify-around items-center flex-col'>
                        <span className='text-white w-full flex justify-evenly items-center'>
                            <input 
                            type="radio" 
                            name="Clantype" 
                            id="public" 
                            value="Public" 
                            onChange={(e) => setClantype(e.target.value)} 
                            className='w-[50%]'
                            checked={Clantype === "Public"}
                            />
                            <label htmlFor="public" className='text-white opacity-80 w-[50%] cursor-pointer'>Public</label>
                        </span>
                        <span className='text-white w-full flex justify-evenly items-center'>
                            <input 
                            type="radio" 
                            name="Clantype" 
                            id="private" 
                            value="Private" 
                            onChange={(e) => setClantype(e.target.value)} 
                            className='w-[50%]'
                            checked={Clantype === "Private"}
                            />
                            <label htmlFor="private" className='text-white w-[50%] opacity-80 cursor-pointer'>Private</label>
                        </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-grow justify-evenly items-center w-full flex-col ">
                    <Button value="Creat" style="bg-aqua-pong" onClick={handleCreateClans} />
                    {alertMsg && <span className={`${alertMsg === "successfully created" ? 'text-aqua-pong ': 'text-red-500' } text-center text-xs`}>{alertMsg}</span>}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default CreatClans;