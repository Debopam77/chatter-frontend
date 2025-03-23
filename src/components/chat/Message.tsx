import React from 'react';
import {Message} from '../../types/types';
import styles from './Message.module.css';

interface MessageProps {
    message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({message}) => {
    const loggedInId = '67d7b252d857aa8be27fe012';
    return (
        <div className={`${styles.message} ${message.senderId === loggedInId ? styles.sent : styles.received}`}>
            <div className={styles.messageContent}>
                {message.content}</div>
            <div className={styles.messageMeta}>
                <span className={styles.sender}>
                    {(message.senderName)? message.senderName: message.senderId}
                </span>
                <span className={styles.timestamp}>
                    {new Date(message.timestamp).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
};

export default MessageComponent;