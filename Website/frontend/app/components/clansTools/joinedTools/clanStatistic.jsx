import React from 'react';
import ClanBottomBarJ from './clanBottomBarJ';
import FAvatar from '../../../components/friendsAvatar/fAvatar'

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


const MumbersRow = ({mumber, status="admin"}) => {
    return (
            <div className='flex justify-between items-center h-[60px] sm:w-[90%] w-full text-gray-400 bg-black bg-opacity-60
                           hover:bg-aqua-pong hover:text-black hover:bg-opacity-100  animate-out-slow sm:scale-100 scale-75
                           rounded-lg p-2'>
                <div className='flex justify-evenly items-center h-full flex-grow'>
                  <FAvatar
                      image={getImageUrl(mumber?.profile_image)}
                      id={mumber?.userID}
                      name={mumber?.username}
                      width={40}
                      height={40}
                      status={""}
                      userr={mumber}
                  />
                  <div className='flex flex-col justify-center items-start h-full flex-grow text-xs'>
                    <p >{mumber.username}</p>
                    <p >{status}</p>
                  </div>
                </div>
                <div className='flex justify-center items-center h-full w-[42%] text-center'>
                  <p className='text-xl'>{mumber.score}</p>
                </div>
            </div>
    );
}



const ClanStatistic = ({clanData,id}) => {
    const clanMumbers = () => {
        return (
          <div className='clanMumbers w-full flex-grow relative'>
              <MumbersRow key={1} mumber={clanData.admin} />
              {clanData.users.map((mumber, index ) => (
                mumber.username !== clanData.admin.username && 
                <MumbersRow key={index + 1} mumber={mumber} status="mumber" />
              ))}
            </div>
        );
    }
    return (
        <div className='flex flex-col justify-center items-center sm:w-[40%] w-full sm:h-[100%] h-[40%] '>
            {clanMumbers()}
            <ClanBottomBarJ clanData={clanData} id={id} />
            
        </div>
    );
}

export default ClanStatistic;
