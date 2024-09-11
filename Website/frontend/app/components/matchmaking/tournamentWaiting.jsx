import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import {createPortal} from 'react-dom';
import { Player} from "@lottiefiles/react-lottie-player";

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

const noOpponent = () => {
    let loadingAnimation = "https://lottie.host/3624e31d-18f8-4894-91e4-76dd27671345/rEJBUzNNhv.json";
    return(
        <>
             <div className='relative  flex flex-col items-center justify-center bg-black   md:w-28 md:h-28 w-20 h-20  rounded-full overflow-hidden border-4 border-solid border-aqua-pong'
            >
                <Player
                    autoplay
                    loop
                    src={loadingAnimation}
                    style={{ height: "50vh", width: "50vw" }}
                />
                <div className='text-center sm:text-sm text-xs text-gray-300'>Waiting...</div>
            </div>
    </>
    )
}
const profileAvatar = (name, image) => { 
    return (
       image &&  image !== "waiting" ? (
            <div className='relative flex  flex-col items-center justify-center  '>
                <Image
                    src={`${API_ADDRESS}/${image}`}
                    className='sm:w-[120px] sm:h-[120px] w-[80px] h-[80px] object-cover rounded-full animate-pulse  border-4  border-solid border-aqua-pong'
                    alt='profile'
                    width={400}
                    height={400}
                />
                <div className='text-center sm:text-xl text-xs text-gray-300'>{name}</div>
            </div>
        ) : (
            noOpponent()
        )
    );
}

const rightSide = (users) => {
    return(
        <div className='flex flex-col items-center justify-evenly w-[30%] h-full '>
            {profileAvatar(users.first_player, users.first_image)}
            {profileAvatar(users.second_player, users.second_image)}
        </div>
    )
}

const leftSide = (users) => {
    return(
        <div className='relative flex flex-col items-center justify-evenly w-[30%] h-full '>
            {profileAvatar(users.first_player, users.first_image)}
            {profileAvatar(users.second_player, users.second_image)}
        </div>
    )
}

const middleSide = (users) => {
    return(
        <div className='relative  flex sm:flex-row flex-col items-center justify-evenly w-[40%] h-full  '>
            {users ? profileAvatar(users.first_player, users.first_image) : profileAvatar("marone")}
            <Image    
                src={`/final.png`} 
                className='object-cover '
                alt='final'
                width={150}
                height={150}
            />
            {users ? profileAvatar(users.second_player, users.second_image) : profileAvatar("marone")}

        </div>
    )
}

const TournamentWaiting = (props) => {
    const { gameTournament, websock, userInfo} = props;

    return (
        createPortal(
            <div className='fixed inset-0 flex  justify-center items-center z-[1000] bg-black'>
                <div
                 style={{
                    background: `linear-gradient(rgba(135,60,255,1),rgba(135,60,255,0) 0%), linear-gradient(-70deg, rgba(28, 190, 179, 0.87) 50%, rgba(34, 34, 34, 0.5) 0%)`,
                }}
                className='backdrop-blur-sm bg-black bg-opacity-40 flex flex-col items-center relative w-[80%] max-w-[1200px] h-[60%]  rounded-lg shadow-md'>
                    <div className='relative w-full h-full  flex flex-wrap'>
                        {leftSide(gameTournament.first_demi_final)}
                        {middleSide(gameTournament.final)}
                        {rightSide(gameTournament.second_demi_final)}
                    </div>
                    {!gameTournament.final.running && <Link href="/gamePage">
                        <div
                       
                            className={`flex bg-aqua-pong mb-5 items-center justify-center w-40 h-12  hover:opacity-50 rounded-lg cursor-pointer mt-5`}
                            onClick={()=>{
                                websock.current.send(JSON.stringify({
                                    type: "cancel",
                                    data: {
                                        tourID: gameTournament.tournamentID,
                                        userID: userInfo.id,
                                    }
                                }));
                                websock.current.close();
                            }}
                        >
                            <span className="text-lg font-bold">Cancel</span>
                        </div>
			        </Link>}
                </div>
            </div>,
        document.body
    ));
}

export default TournamentWaiting;