

"use client";

import { useCallback, useContext} from 'react';
import { GameSelectContext } from '../../contexts/gameSelectContext';
import styles from './css/map.module.css';
import MapSlider from './mapSlider';
import SlideMode from './slideMode';
import { useRouter } from 'next/navigation'
import axios from 'axios';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;

const GameMaps = () => {
    const router = useRouter();
    const { map, setMap, multiplayer, setMultiplayer } = useContext(GameSelectContext);
    const OPTIONS = { loop: true }
    const SLIDEIMAPS = [{mapPath: '/maps/aqua.png', id: 0, mapName: 'AQUA'},
    {mapPath: '/maps/darkaqua.png', id: 1, mapName: 'DARKAQUA'},
    {mapPath: '/maps/goldaqua.png', id: 2, mapName: 'GOLDAQUA'}];
    const SLIDEMODES = [{mapPath: '/maps/solo.png', id: 0, mapName: 'SOLO'}, 
    {mapPath: '/maps/tournament.png', id: 1, mapName: 'TOURNAMENT'}];

    const gameRedirection = useCallback(async () => {
        await axios.post(`${API_ADDRESS}/Dashboard_home/set_selected_map`, {
            map_name: map,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        multiplayer ? router.push('/tournament') : router.push('/playground');
    }, [multiplayer, map]);

    return (
        <>
            <div className={styles.containerofmap}>
                <MapSlider  map={map} setMap={setMap} SLIDEIMAPS={SLIDEIMAPS}  options={OPTIONS} />
            </div>
            <div className={styles.containerForMode}>
                <SlideMode Multiplayer={multiplayer} SetMultiplayer={setMultiplayer} SLIDEMODES={SLIDEMODES} options={OPTIONS} />
            </div>
            <div className='h-[50px] w-full flex justify-center items-center'>
                <div className='flex flex-col items-center justify-center w-[150px] h-[50px] bg-aqua-pong bg-opacity-60 rounded-md text-black hover:bg-opacity-100 cursor-pointer'
                    onClick={gameRedirection}>
                    <span className=' sm:text-2xl text-xl'>Play</span>

                </div>
            
            </div>
        </>
    );
}

export default GameMaps;