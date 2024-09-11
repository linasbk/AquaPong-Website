"use client";
import styles from './fAvatar.module.css';
import FreindModal from '../freindModal/fmodal';
import { useState} from 'react';
import { QueryClient, QueryClientProvider} from 'react-query';
import Image from 'next/image'




function FAvatar({ id, image, name, width, height, status="none",userr, ...params })
{
    const queryClient = new QueryClient();
    const [openModal, setOpenModal] = useState(false);
    const lineStatus = (statu) =>
    {
        if (statu === "online")
            return 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,1)]';
        else if (statu === "offline")
            return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]';
        else if (statu === "ingame")
            return 'bg-[#66FCF1] shadow-[0_0_10px_rgba(102,252,241,1)]';
        else
            return 'bg-none shadow-none';
    }
    return (
        <>
            <QueryClientProvider client={queryClient}>
            <div className={styles.avatar} {...params}>
                <span className={`${styles.status} ${lineStatus(status)}`}></span>
                <button onClick={() => {setOpenModal(true)}}>
                    <div className={`${styles.image}`} >
                    <Image
                        src={image}
                        alt={name}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        style={{ objectFit: 'cover' }}
                        title={name}
                        fill
                        className='obgect-cover h-full w-full'                    />
                    </div>
                </button>
            </div>
            {openModal && <FreindModal open={openModal} setOpen={setOpenModal} id={id} name={name} image={image} userr={userr}/>}
            </QueryClientProvider>
        </>
    );
}

export default FAvatar;
