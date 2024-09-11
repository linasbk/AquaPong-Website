"use client";

import './findClans.css';
import { useState } from 'react';
import SearchClans from './searchClans';
import CreatClans from '../createClans/creatClans';
import { IoCreate } from "react-icons/io5";
import Image from 'next/image';

const ClanRow = ({id, clan, index, setSelectedClan, selectedClan, conversationRef }) => {

  const handleClanSelected = () => {
    if (conversationRef && conversationRef.current) {
      conversationRef.current.send(JSON.stringify({
        my_userID: id,
        create_or_add: "get_all_users",
        Group_name: clan.name,
        search: ""
      }));
      
      conversationRef.current.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if(data?.users)
          {
              setSelectedClan(data);
          }
      };
    } 
  };
  
  return (
    <div key={index} onClick={handleClanSelected} className='w-[80%] h-[80px] relative flex items-center bg-white bg-opacity-20 rounded-lg text-white'>
      <div className='flex items-center justify-end w-[25%] p-2 h-full text-center'>
        <Image src={`/clans/${clan.icon}.png`} alt="clanIcon" width={40} height={40} />
      </div>
      <span className='flex  justify-start items-center flex-grow  w-[25%] h-full '>{clan.name}</span>
      <div className='flex items-center justify-center w-[50%] h-full flex-grow text-center'>
        <span>{clan.status}</span>
      </div>
      {selectedClan?.id === clan.id && <div className='w-[3%] h-full rounded-r-lg absolute right-0 bg-aqua-pong'></div>}
    </div>
  );
};

const FindClans = ({id, setSelectedClan, Clans, selectedClan, conversationRef, setSearchTerm, searchTerm }) => {
  const [showCreateClans, setShowCreateClans] = useState(false);
  const handleShowCreateClans = () => setShowCreateClans(!showCreateClans);
  
  
  return (
    <div className="findClans">
      <SearchClans placeholder='Search Clans...' setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
      <div className='clansRowsContainer'>
        {Clans && Array.isArray(Clans) && Clans.map((clan, index) => (
          <ClanRow id={id} key={index} clan={clan} index={index} setSelectedClan={setSelectedClan} selectedClan={selectedClan} conversationRef={conversationRef} />
        ))}
      </div>
      <div className='sm:w-full  w-[200px] h-[50px] relative flex items-center justify-center sm:bg-white sm:bg-opacity-20 rounded-b-lg text-white'>
        <button className='hover:text-aqua-pong h-[50px] w-full flex justify-center gap-1 items-center' onClick={handleShowCreateClans}>
          Create Clans
          <IoCreate className='text-xl' />
        </button>
      </div>
      {showCreateClans && <CreatClans setShowCreateClans={setShowCreateClans} />}
    </div>
  );
};

export default FindClans;

