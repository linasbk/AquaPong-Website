// isJoined.js

"use client";

import { useEffect, useContext, useState } from 'react';
import { GroupContext } from '../../contexts/groupContext';
import ClanJoined from '../../components/clansTools/clanJoined';
import ClanUnjoined from '../../components/clansTools/clanUnjoined'; // If you have this component
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';
import Loading from '../../components/loading/loading';
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const IsJoined = () => {
    const { isConnected, conversationRef} = useContext(GroupContext);
    const { userInfo } = useContext(UserContext);
    const [joined, setJoined] = useState(null);
    useEffect(() => {
        const fetchClanData = async () => {
            if (userInfo?.id) {
                try {
                    const response = await axios.post(`${API_ADDRESS}/groups/check_user_joined`, {
                        my_userID: userInfo.id
                    });
                    setJoined(response.data.result);
                } catch (error) {
                    console.error('Error:', error.response ? error.response.data : error.message);
                    setJoined(false);
                }
            }
        };
        fetchClanData();
    }, [userInfo,conversationRef.current]);

    if (joined === null) {
        return <Loading/>;
    }

    return (
        <>
            {joined ? <ClanJoined /> : <ClanUnjoined />}
        </>
    );
};

export default IsJoined;
