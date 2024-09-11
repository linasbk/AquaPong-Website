"use client";

import './Leaderboard.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
async function fetchdata() {
    try {
        let response = await fetch(`${API_ADDRESS}/Dashboard_home/leaderboard`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('Failed to fetch data', response.statusText);
            return [];
        }

        let data = await response.json();
        if (Array.isArray(data)) {
            return data;
        } else {
            console.error('Data is not an array', data);
            return [];
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

const Leaderboard = () => {
    const router = useRouter();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const data = await fetchdata();
            setPlayers(data);
        };
        loadData();
    }, []);

    return (
        <div className='Leaderboard'>
            <h1 className='title'>LeaderBoard</h1>
            <div className='content'>
                <ul className='mainTable'>
                    <li className='bar'>
                        <span className='rank'>Rank</span>
                        <span className='username'>Player</span>
                        <span className='score'>Score</span>
                    </li>
                    {players && players?.map((player, index) => (
                        <li className='playerRow' key={player.key || player.username || index} onClick={() => {
                            router.push(`/profilePage/${player.username}`);
                        }}>
                            <span className='rank'>{index + 1}</span>
                            <span className='username'>{player.username}</span>
                            <span className='score'>{player.score}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Leaderboard;
