import React, {createContext, useState, useEffect, useContext} from 'react';
import {User} from '../types/types';
import {login, register, logout} from '../services/authService';

interface AuthContextProps {
    user: User | null,
    isAuthenticated: boolean,
    loginUser: (credentials: any) => Promise<void>,
    registerUser: (credentials: any) => Promise<void>,
    logoutUser: () => void;
}

const AuthContext = createContext<AuthContextProps>({
    user: null,
    isAuthenticated: false,
    loginUser: async () => {},
    registerUser: async () => {},
    logoutUser: () => {},
});

interface AuthProviderProps {
    children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || "null");
                if(userData) {
                    setUser(userData);
                    setIsAuthenticated(true);
                }
            }catch (error) {
                console.error("Error in parsing user data from local storage", error);
                logoutUser();
            }
        }
        setIsLoading(false);
    }, []);

    const loginUser = async (credentials: any) => {
        try {
            const responseData = await login(credentials);
            if(responseData?.user && responseData?.token) {
                // Setting stuff in Local Storage, To Do, will need to change
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', JSON.stringify(responseData.user));
                setUser(responseData.user);
                setIsAuthenticated(true);
            }
        }catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const registerUser = async (userData: any) => {
        try {
            const {user: registeredUser, token} = await register(userData);
            // Setting stuff in Local Storage, To Do, will need to change
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(registeredUser));
            setUser(registeredUser);
            setIsAuthenticated(true);
        }catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logoutUser = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        logout();
    };

    const value = {
        user,
        isAuthenticated,
        loginUser,
        registerUser,
        logoutUser,
    };

    if(isLoading) {
        return <div>Loading...</div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => useContext(AuthContext);

export {AuthContext, AuthProvider, useAuth};