"use client";
import { useRouter } from 'next/navigation';
import styles from './shortMap.module.css';
import { GameSelectContext } from '../../contexts/gameSelectContext';
import {Image, useContext, Button} from "../index";
import { useCallback } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ShortMap = () => {
    const { map,  multiplayer } = useContext(GameSelectContext);
    const router = useRouter();

    const gameRedirection = useCallback(async () => {
        const response = await axios.post(`${API_URL}/Dashboard_home/set_selected_map`, {
            map_name: map,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        multiplayer ? router.push('/tournament') : router.push('/playground');
    }, [multiplayer, map]);

    const  getMode = useCallback(() => {
        if (multiplayer)
            return `${map}/Tournamet`;
        else
            return `${map}/Solo`;
    }
    , [map, multiplayer]);
    function getMapImage() {
        switch (map) {
            case "AQUA":
                return "/maps/aqua.png";
            case "DARKAQUA":
                return "/maps/darkaqua.png";
            case "GOLDAQUA":
                return "/maps/goldaqua.png";
        }
    }

    return (
        <div className={styles.ShortMap}>
                <Image src={getMapImage()} alt={map} fill={true} priority={true} sizes="(max-width: 768px) 100vw, 50vw"/>
            <div className={styles.Image}>
                <h1>{getMode()}</h1>
                <span className={styles.playButton}>
                    <Button style='bg-aqua-pong' onClick={gameRedirection}>&nbsp;&nbsp;Play&nbsp;&nbsp;</Button>
                </span>
                <span className={styles.selectButton}>
                    <Button style='bg-white opacity-70' onClick={() => router.push('/gamePage')}>&nbsp;Select&nbsp;</Button>
                </span>
            </div>
        </div>
    );
}

export default ShortMap;
