import styles from './profilePage.module.css';
import InfoRank from '../../../components/profileTools/infoRank/infoRank';
import Statistic from '../../../components/profileTools/statistic/statistic';
import MatchHistory from '../../../components/profileTools/matchHistory/matchHistory';
import Clans from '../../../components/profileTools/clans/clans';
import {getDataProfile} from '../../../components/profileTools/getDataProfile';
import { notFound } from 'next/navigation';



async function ProfilePage({params}){
    const userName = params.id;

    const userData = await getDataProfile(userName, "Statistic");
    const matchHistorySolo = await getDataProfile(userName, "MatchHistorySolo");
    const matchHistoryTour = await getDataProfile(userName, "History_tournaments");
    const Clan = await getDataProfile(userName, "group_info");
    if (!userData || !matchHistorySolo || !Clan) {
        notFound();
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.infoRank}>
                <InfoRank data={userData} userName={userName}/>
            </div>
            <div className={styles.matchHistory}>
                <MatchHistory matchHistorySolo={matchHistorySolo}  matchHistoryTour={matchHistoryTour}/>
            </div>
            <div className={styles.yourClan}>
                <Clans Clan={Clan}/>
            </div>
            <div className={styles.statistics}>
                <Statistic data={userData.list_backend} userName={userName}/>
            </div>
        </div>
    )
}

export default ProfilePage;