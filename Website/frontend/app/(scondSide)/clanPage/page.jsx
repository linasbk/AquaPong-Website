import styles from './clanPage.module.css';
import {GroupProvider} from '../../contexts/groupContext';

import IsJoined from './isJoined';

const ClanPage = () => {
    return (
        <div className={styles.clanPage}>
            <GroupProvider>
                < IsJoined />
            </GroupProvider>

        </div>
    )
}

export default ClanPage;