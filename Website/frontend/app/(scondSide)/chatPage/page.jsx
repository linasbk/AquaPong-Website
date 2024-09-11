"use client"

import styles from './chatPage.module.css';
import Popup from 'reactjs-popup';
import Mainchat from '../../chat/page'
function ChatPage(){
    return (
        <div className={styles.chatContainer}>
         
            <Mainchat/>
        </div>
    )
}

export default ChatPage;

