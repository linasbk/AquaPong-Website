import styles from './gamePage.module.css';
import dynamic from 'next/dynamic';
const GameMaps = dynamic(() => import('../../components/gameSelector/gameMaps'),{
        ssr:false,
})


function  GamePage()
{
    return (
            <div className={styles.gameContainer}>
                    <GameMaps />

            </div>
    )
}

export default GamePage;