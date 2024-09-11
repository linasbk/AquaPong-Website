import styles from './animation.module.css';

const Animation = () => {

    return (
        <div className={styles.wrapper}>
            <div className={styles.left_wall}></div>
            <div className={styles.ball}></div>
            <div className={styles.right_wall}></div>
        </div>
    );
};

export default Animation;
