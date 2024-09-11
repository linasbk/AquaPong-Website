
"use client";
import React, {useContext, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './fmodal.module.css';
import { RxEyeClosed } from "react-icons/rx";
import { MdRemoveRedEye } from "react-icons/md";
import Link from 'next/link';
import Button from '../button/button';
import ReactDOM from 'react-dom';
import Blockuser from '../blockuser/blockuser';
import { UserContext } from '../../contexts/UserContext';
import { useQuery } from "react-query";
import Image from 'next/image'


const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
const Fmodal = (props) => {
    return (
            <FmodalContent {...props} />
 
    );
};


const fetchUsersStatus = async ( targetUser) => {
    const response = await fetch(`${API_ADDRESS}/notification/show_block/${targetUser}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return data;
};

const FmodalContent = ({ setOpen, name, id, image, userr }) => {
    const {set_current_user} = useContext(UserContext);
    const { userInfo } = useContext(UserContext);
    const [showBlockPopup, setShowBlockPopup] = useState(false);
    const { data } = useQuery(["blockuser",userInfo.id, id], () => fetchUsersStatus(id));

    return ReactDOM.createPortal(
        <div className={styles.background} key={id} onClick={() => setOpen(false)}>
            <div className={styles.modal}  onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setOpen(false)} className={styles.closeButton}>
                    <RxEyeClosed className={`${styles.eye} ${styles.closedEye}`} />
                    <MdRemoveRedEye className={`${styles.eye} ${styles.openEye}`} />
                </button>
                <div className={styles.modalHeader}>
                    <div className={styles.imageContainer}>
                        <Image  src={image} alt={name} height={500} width={200} priority={true} />
                    </div>
                    <h2 className='text-aqua-pong'>{userr.username}</h2>
                </div>
                <div className={styles.modalContent} onClick={() => setOpen(false)}>
                    <Link href={`/profilePage/${name}`}>
                        <Button fsize={"text-sm"}>
                            View&nbsp;Profile
                        </Button>
                    </Link>
                    <Link href={`/chatPage/`}>
                    <Button 
                        fsize={"text-sm"} 
                        onClick={() => {
                            set_current_user({
                            id: 0,
                            user: userr,
                            friends: null,
                            typing: false,
                            interaction_time: new Date().toISOString(),
                            });
                        }}
                        >
                            Send&nbsp;Message
                    </Button>
                    </Link>
                    {userInfo.id !== id && data?.status !== 2  && (
                        <Button onClick={(e) => {
                            e.stopPropagation();
                            setShowBlockPopup(true);
                        }} style={`${data?.status === 0 ? 'bg-red-500' : 'bg-aqua-pong'}`} fsize={"text-sm"}>
                                {data?.status === 0 ? (
                        <span className="text-white">Block&nbsp;Friend</span>
                        ) : (
                        <span className=" text-black">Unblock&nbsp;Friend</span>
                        )}
                        </Button>
                    )}
                </div>
                {showBlockPopup && <Blockuser currentUser={userr} targetUser={id} setShowBlockPopup={setShowBlockPopup} />}
                {showBlockPopup && <Blockuser currentUser={userInfo.id} targetUser={id} status={data?.status} setShowBlockPopup={setShowBlockPopup} />}
            </div>
        </div>,
        document.body
    );
};


FmodalContent.propTypes = {
    setOpen: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    user: PropTypes.object.isRequired,
};



export default Fmodal;
