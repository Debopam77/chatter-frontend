import api from './api';
import {User} from '../types/types';

interface LoginResponse {
    user: User,
    token: string
};

interface RegisterResponse {
    user: User,
    token: string
}

export const login = async (credentials: any): Promise<LoginResponse|null> => {
    try {
        const response = await api.post('/user/login', credentials);
        if(response?.data) {
            return response.data;
        }
        return null;
    } catch(error: any) {
        console.error('Login failed:', error.response?.data || error.message);
        throw error;
    }
};

export const register = async (userData: any): Promise<RegisterResponse> => {
    try {
        const response = await api.post('/user/', userData);
        return response.data;
    }catch (error: any) {
        console.error('Registration failed:', error.response?.data || error.message);
        throw error;
    }
}

export const logout = () => {
    // Could do api call to invalidate user token if required
    console.log('User logged out.');
}