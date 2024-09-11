"use client";

import React, {useEffect, useRef, useState,useContext} from 'react';
import './joinedTools/mainClan.css';
import TopBarJoined from './joinedTools/TopBarJoined';
import ClanStatistic from './joinedTools/clanStatistic';
import { UserContext } from '../../contexts/UserContext';
import Loading from '../loading/loading';
import Groupchat from '../../group_chat/page'
import {GroupContext} from '../../contexts/groupContext';

const ClanJoined = () => {
    const { userInfo } = useContext(UserContext);
    const { conversationRef, isConnected } = useContext(GroupContext);
    const [ClanData, setClanData] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        if (isConnected && conversationRef.current) {
            conversationRef.current.send(
                JSON.stringify({
                    my_userID: userInfo?.id,
                    create_or_add: "get_all_users",
                })
            );

            conversationRef.current.onmessage = (e) => {
                const data = JSON.parse(e.data);
                
                if(data?.users)
                    {
                        setClanData(data);
                        setLoading(false); 
                    }
                   
            };

            return () => {
                conversationRef.current.onmessage = null;
            };
        }
    }, [isConnected, conversationRef, userInfo]);

    if (loading) {
        return <Loading/>
    }

    return (
        <div className='mainClan'>
            <TopBarJoined clanData={ClanData} />
            <div className='clanStatus'>
                <ClanStatistic clanData={ClanData} id={userInfo.id}/>
                <div className='flex flex-wrap sm:w-[60%] h-full  w-full bg-profile-bg'>
                    <Groupchat Channel_name={ClanData.name}/>
                </div>
            </div>
        </div>
    );
};


export default ClanJoined;
