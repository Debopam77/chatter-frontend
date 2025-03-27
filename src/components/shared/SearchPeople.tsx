import React, {useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {searchUsers} from '../../services/userService';
import { startConversation } from '../../services/chatService';
import {Conversation, User} from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import styles from './SearchPeople.module.css';

interface SearchPeopleProps {
    onConversationSelect: (conversationId: string) => void;
}

const SearchPeople: React.FC<SearchPeopleProps> = ({ onConversationSelect }) => {
    const [searchItem, setSearchItem] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const timeoutRef = useRef<any> (null);
    const {user} = useAuth();
    const navigate = useNavigate();

    const handleSearch = async () => {
        if(!searchItem) {
            setSearchResults([]);
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            const results = await searchUsers(searchItem);
            setSearchResults(results);
        } catch(err: any) {
            setError(err.message || 'Search failed');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(()=> {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            if(searchItem === '' || searchItem.length > 2)
                handleSearch();
        }, 500);

        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchItem]);

    const handleUserSelect = async (event: any) => {
        if(window.confirm(`Chat with ${event.target.name}?`)) {
            console.log("Handle chat with", event.target.name, event.target.value);
            if (user?._id) {
                const conversation: Conversation|null = await startConversation(user._id, event.target.value);
                if(conversation) {
                    onConversationSelect(conversation._id);
                    navigate('/');
                } else {
                    console.error("Unable to Initiate conversation");
                }
                
            } else {
                console.error("Please login to continue");
                navigate('/login');
            }
        }
        // Naviate to the conversation list with the chat pane open for the 
    }

    return(
        <div className={styles.searchContainer}>
            <input
                type="text"
                placeholder='Search by email'
                value={searchItem}
                onChange={(e) => setSearchItem(e.target.value)}
                className={styles.searchInput}
            />
            {loading && <p>Loading....</p>}
            {error && <p className={styles.error}>{error}</p>}
            <ul className={styles.searchResults}>
                {searchResults.map((user) => (
                    <li 
                        key={user._id}
                        className={styles.searchResultItem} 
                    >Name: {user.username} Mail: {user.email} <span>
                            <button 
                                key={user._id} 
                                onClick={handleUserSelect} 
                                value={user._id} 
                                name={user.username}
                                >Chat
                            </button>
                        </span></li>
                ))}
            </ul>
        </div>
    );
}

export default SearchPeople;