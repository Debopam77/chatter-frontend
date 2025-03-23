import React, {useState, useEffect, useRef} from 'react';
import {Message} from '../../types/types';
import {connectSocket, disconnectSocket, getMessages, joinRoom, onMessage, sendMessage} from '../../services/chatService';
import styles from './ChatArea.module.css';
import MessageComponent from './Message';
import { useAuth } from '../../contexts/AuthContext';

interface ChatAreaProps {
    conversationId: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({conversationId}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const {user} = useAuth();

    const newMessageListner = (message: Message) => {
        if(message.conversationId === conversationId) {
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    }

    useEffect(()=> {
        // Connect to the socket
        // To replace with actual token To do
        connectSocket('temporary-fake-token');
        joinRoom(conversationId);
        onMessage(newMessageListner);


        const fetchMessages = async () => {
            const fetchedMessages = await getMessages(conversationId);
            setMessages(()=>fetchedMessages);
        }

        fetchMessages();

        return () => {
            //To do
            // Cleanup listners
            disconnectSocket();
        }
    }, [conversationId]);

    useEffect(() => {
        //messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages, conversationId]);

    const handleSendMessage = () => {
        if(!inputMessage.trim() || !user || !conversationId) {
            return;
        }

        const newMessage: Message = {
            _id: '', 
            conversationId: conversationId,
            senderId: user._id,
            senderName: user.username,
            content: inputMessage,
            type: 'text',
            timestamp: new Date(),
            readBy: [],
        }
        sendMessage(newMessage);
        setInputMessage(''); // Clear input
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(event.target.value);
    }

    return (
        <div className = {styles.chatArea}>
            <div className={styles.MessageContainer}>
                {messages.map((message) => (
                    <MessageComponent key={message._id} message={message}/>
                ))}
                <div ref={messagesEndRef}/>
            </div>
            <div className={styles.inputContainer}>
                <input 
                    type="text" 
                    value={inputMessage} 
                    onChange={handleInputChange} 
                    placeholder="Type a Message"
                    className={styles.input}
                />
                <button onClick={handleSendMessage} className={styles.sendButton}>Send</button>
            </div>
        </div>
    );
};

export default ChatArea;