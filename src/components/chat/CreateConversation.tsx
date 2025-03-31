import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Conversation } from '../../types/types';
import SearchPeople from '../shared/SearchPeople';
import styles from './CreateConversation.module.css'
import { startConversation } from '../../services/chatService';

interface CreateConversationProps {
    onConversationSelect: (conversationId: string) => void;
}

const CreateConversation: React.FC<CreateConversationProps>= ({onConversationSelect}) => {

    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleUserSelect = async (event: any) => {
        if (window.confirm(`Chat with ${event.target.name}?`)) {
            console.log("Handle chat with", event.target.name, event.target.value);
            if (user?._id) {
                const conversation: Conversation | null = await startConversation(user._id, event.target.value);
                if (conversation) {
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

    return (
        <div className={styles.searchContainer}>
            <h1>Search for people</h1>
            <SearchPeople
                setLoading={setLoading}
                setSearchResults={setSearchResults}
                setError={setError}
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
                                className={styles.chatButton}
                                >Chat
                            </button>
                        </span></li>
                ))}
            </ul>
        </div>
    );
}

export default CreateConversation;