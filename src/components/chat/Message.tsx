import React from 'react';
import {Message} from '../../types/types';
import styles from './Message.module.css';
import { useAuth } from '../../contexts/AuthContext';

interface MessageProps {
    message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({message}) => {
    const {user} = useAuth();
    return (
        <div className={`${styles.message} ${message.senderId === user?._id ? styles.sent : styles.received}`}>
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