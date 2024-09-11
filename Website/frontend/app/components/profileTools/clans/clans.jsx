import React from 'react';
import Image from 'next/image';


const Clans = ({Clan}) => {
    
    const getClan = () =>{
        var ClanPath = "/clans/" + Clan.group_image + ".png";
        return(
            <div className='flex w-full  flex-grow flex-col justify-center items-center bg-profile-bg relative '>
                <div className='h-[10vw] w-[10vw] min-w-[100px] min-h-[100px] flex items-center justify-center'>
                    <Image src={ClanPath} alt={Clan.group_image} className="w-full h-full object-contain" />
                </div>
                <span className='text-rfs text-my-grey'>{Clan.group_name}</span>
            </div>
        );
    }
    return (
        <div className='flex justify-between  items-center h-full w-full relative flex-col text-white'>
            <span className='flex justify-center items-center w-full h-[20%] text-2xl '>Clan</span>
            {getClan()}
        </div>
    );
}

export default Clans;
