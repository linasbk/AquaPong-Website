import styles from './HomePage.module.css';
import ShortMap from '../../components/shortMap/shortMap';
import Leaderboard from '../../components/leaderboard/leaderboard';
import Globalchat from '../../globalchat/globalchat'
function HomePage(){
    return (
        <div className={styles.homeContainer}>
                <ShortMap/>
                <Leaderboard/>
                <div className={styles.globalChat}>
                    <Globalchat/>
                </div>
        </div>
    )
}

export default HomePage;
