
import styles from './infoRank.module.css';
import Image from 'next/image';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;


const avatarContent = (data, userName) => {
    return (
        <div className='w-[25%] h-auto flex flex-row justify-evenly items-center  flex-wrap '>
            <div className={styles.profileImage}>
                <img src={`${API_ADDRESS}/${data.user_image_url}`} alt={userName} width={400} height={400}/>
            </div>

        </div>
    );
}

const getRank = (score) => {
    if (score < 10) {
        return <Image src="/ranks/Iron.png" alt="rank1" width={200} height={200} />
    }
    if (score < 20) {
        return <Image src="/ranks/Bronze.png" alt="rank2" width={200} height={200} />
    }
    if (score < 40) {
        return <Image src="/ranks/Silver.png" alt="rank3" width={200} height={200} />
    }
    if (score < 80) {
        return <Image src="/ranks/Gold.png" alt="rank4" width={200} height={200} />
    }
    if (score <= 160) {
        return <Image src="/ranks/Platinum.png" alt="rank5" width={200} height={200} />
    }
    if (score > 160) {
        return <Image src="/ranks/Master.png" alt="rank6" width={200} height={200} />
    }
}


const InfoRank = ({data, userName }) => {

    return (
        <div className="w-full h-full relative flex justify-between flex-col ">
            <span className='h-[15%] w-full text-white flex justify-center items-center text-2xl'>Info</span>
            <div className={styles.infoContent}>
                {avatarContent(data.list_backend.list_info, userName )}
                <div className=' h-auto w-[25%] flex flex-col justify-center text-center items-center flex-wrap text-rfs'>
                    <span className='text-aqua-pong'>{userName}</span>
                    <span className={`text-aqua-pong `}>LVL.{data.list_backend.list_info.mainLvl}-{data.list_backend.list_info.level}Xp </span>
                </div>
                <div className='w-[25%] h-[70%] flex flex-col justify-center items-center text-center flex-wrap text-rfs '>
                    <span className='text-my-grey '>Best arena</span>
                    <span className={`text-aqua-pong `} >{data.list_backend.list_info.Best_Arena}</span>
                </div>
                <div className='w-[25%] h-auto flex flex-col justify-center text-center items-center flex-wrap text-rfs'>
                    <span className='text-my-grey'>Leader board</span>
                    <span className={`text-aqua-pong `}>#{data.list_backend.list_info.ordre}</span>
                </div>
            </div>
                <span className='h-[15%] text-white flex justify-center text-center items-center text-2xl'>Rank</span>
            <div className={styles.rank}>
                <div className='h-[70%] w-full flex justify-center items-center '>
                    <div className='lg:scale-[1.8] h-10 flex items-center bg-rank-bg'>
                        {getRank(data.list_backend.list_statistic.score)}
                    </div>
                </div>
            </div>

        </div>
    );
};


export default InfoRank;
