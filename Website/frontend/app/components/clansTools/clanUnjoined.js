"use client";
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import FindClans from './unjoinedTools/findClan/findClans';
import Clanstatus from './unjoinedTools/clansStatus/clanstatus';
import { GroupContext } from '../../contexts/groupContext';
import Loading from '../loading/loading';

const ClanUnjoined = () => {
  const { userInfo } = useContext(UserContext);
  const { conversationRef, isConnected } = useContext(GroupContext);
  const [clansData, setClansData] = useState([]);
  const [selectedClan, setSelectedClan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const id = userInfo?.id;
  useEffect(() => {
    if (isConnected && conversationRef.current) {
      conversationRef.current.send(JSON.stringify({
        my_userID: id,
        create_or_add: "get_groups",
        search: searchTerm
      }));
      conversationRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setClansData(data);
        setIsLoading(false);
      };
    } else {
      setIsLoading(false);
    }
  }, [isConnected, searchTerm]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <FindClans id={id} Clans={clansData} setSelectedClan={setSelectedClan} selectedClan={selectedClan} 
                conversationRef={conversationRef} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
      <Clanstatus selectedClan={selectedClan} conversationRef={conversationRef} />
    </>
  );
}

export default ClanUnjoined;