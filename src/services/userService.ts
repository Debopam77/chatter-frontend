import api from './api';
import {User} from '../types/types';

export const searchUsers = async (searchItem: string): Promise<User[]> => {
    try {
        const response = await api.get(`/user?email=${searchItem}`);
        return response.data;
    } catch (error: any) {
        console.error('Search users failed', error.response?.data || error.message);
        throw error;
    }
};

export const getUserById = async (userId: string): Promise<User| null> => {
    try{
        const response = await api.get(`/user/${userId}`);
        return response.data;
    } catch(error: any) {
        console.error('Get user by ID failed', error.response?.data || error.message);
    }
    return null;
}