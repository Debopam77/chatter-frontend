import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../../services/chatService'; // Assuming you have a searchUsers function
import { startGroupConversation } from '../../services/chatService'; // Assuming you have a startGroupConversation function
import { User } from '../../types/types'; // Assuming you have a User type
import styles from './CreateGroup.module.css';
import SearchPeople from '../shared/SearchPeople';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../shared/Avatar';

const CreateGroup: React.FC = () => {
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [selectedUsers, setSelectedUsers] = useState<User[]>((user) ? [user]:[]);

    const handleUserAdd = async (selectedUser: User) => {
        if(!selectedUser) return;
        let alreadyPresent: boolean = false;
        for(let i=0; i<selectedUsers.length; i++) {
            if(selectedUser._id === selectedUsers[i]._id) {
                alreadyPresent=true;
                break;
            }
        }
        if (!alreadyPresent)
            setSelectedUsers([...selectedUsers, selectedUser]);
    }

    const handleCreateGroupConversation = () => {
        console.log("Handle creation of conversation with", selectedUsers);
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
            <div className={styles.selectedContainer}>
                {selectedUsers.map((selectedUser) => (<Avatar key={'selected'+selectedUser._id} user={selectedUser}/>))}
            </div>
            {(selectedUsers.length>1) && <button className={styles.button} onClick={handleCreateGroupConversation}>Create Group</button>}
            <ul className={styles.searchResults}>
                {searchResults.map((user: User) => (
                    <li
                        key={user._id}
                        className={styles.searchResultItem}
                    >Name: {user.username} Mail: {user.email} <span>
                            <button
                                key={user._id}
                                onClick={()=> {handleUserAdd(user)}}
                                value={user._id}
                                name={user.username}
                                className={styles.chatButton}
                            >Add
                            </button>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CreateGroup;