import api from './api';
import {io, Socket} from 'socket.io-client';
import {Message, Conversation} from '../types/types';

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
    if(!socket) {
        socket = io(import.meta.env.VITE_BASE_URL, {
            auth: {
                token: token,
            },
        });
        return socket;
    }
};

export const disconnectSocket = () => {
    if(socket) {
        socket.disconnect();
        socket = null;
    }
};

export const joinRoom = (conversationId: string) => {
    if(socket) {
        socket.emit("joinRoom", conversationId);
    }
} 

export const sendMessage = (messageData: Message) => {
    if (socket) {
        socket.emit("sendMessage", messageData);
    }
};

export const onMessage = (callback: (message: Message) => void) => {
    if(socket) {
        socket.on('newMessage', callback);
    }
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
    const response = await api.get(`/message/${conversationId}`);
    return response.data;
};

export const getConversations = async (userId: string|undefined): Promise<Conversation[]> => {
    if(userId) {
        const response = await api.get(`/convo/${userId}`);
        return response.data;
    } else {
        return [];
    }

    return [];
}

export const startConversation = async(userId1: string, userId2: string): Promise<Conversation|null> => {
    if(userId1 && userId2) {
        const payload = {
            type: "private",
            participants: [userId1, userId2]
        }
        try {
            const response = await api.post(`/convo/`, payload);
            return response.data;
        } catch(error: any) {
            console.error(`Could not initiate conversation:`, error.message);
        }
    }

    return null;
}