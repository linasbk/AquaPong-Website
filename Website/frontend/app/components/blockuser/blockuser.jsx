"use client";

import React, { useEffect, useState } from 'react';
import styles from './blockuser.module.css';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Button from '../button/button';
import axios from 'axios';

const API_ADDRESS = process.env.NEXT_PUBLIC_API_URL;
function blockFriend(notificationUserID) {
    try {
      axios.post(`${API_ADDRESS}/notification/blocker_friend/${notificationUserID}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }
  
  
  function unblockFriend(notificationUserID) {
    try {
      axios.post(`${API_ADDRESS}/notification/deblocker_friend/${notificationUserID}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  const Blockuser = ({ currentUser , targetUser , status ,setShowBlockPopup}) => {
    const blockOrDeblockUserColor = () => {
        return status === 0 ? 'bg-red-500' : 'bg-aqua-pong';
    }
    const blockOrDeblockUserText = () => {
        return status === 0 ? 'Block' : 'Unblock';
    }
    return ReactDOM.createPortal(
        <div className={styles.background}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    Block User
                </div>
                <div className={styles.modalContent}>
                    <>Are you sure you want to {blockOrDeblockUserText()} this user?</>
                    <div className={styles.buttonContainer}>
                        <Button style={`${blockOrDeblockUserColor()}`} onClick={() =>  {status === 0 ? blockFriend(targetUser) :unblockFriend(targetUser) ,setShowBlockPopup(false)} }> {/* TODO send block request */}
                            &nbsp;{blockOrDeblockUserText()}&nbsp;
                        </Button>
                        <Button style='bg-white'  onClick={() => {
                            setShowBlockPopup(false)
                        }}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}


Blockuser.propTypes = {
    currentUser: PropTypes.number,
    targetUser: PropTypes.number,
    status: PropTypes.bool,
    setShowBlockPopup: PropTypes.func.isRequired
};

export default Blockuser;
