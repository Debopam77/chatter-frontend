// src/components/Chat/ConversationList.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Conversation } from '../../types/types'; // Assuming you have this type
import { getConversations, connectSocket, disconnectSocket } from '../../services/chatService';
import styles from './ConversationList.module.css'; // Import CSS module
import { useAuth } from '../../contexts/AuthContext';

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onConversationSelect }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddButtonsVisible, setIsAddButtonsVisible] = useState(false);
  const navigate = useNavigate();
  const addButtonRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const userId = user?._id;

  useEffect(()=> {
    const fetchConversations = async ()=> {
      try {
        setLoading(true);
        const fetchedConversations = await getConversations(userId);
        setConversations(fetchedConversations);
      } catch (error: any) {
        setError((error.message || 'Failed to load conversations.'));
      } finally {
        setLoading(false);
      }
    }; 
    fetchConversations();

    //connectSocket('temporary-fake-token');

    // Listen for new Conversations
    // Replace true, with proper user token, To Do
    if(true) {
      const handleNewConversation = (newConversation: Conversation) => {
        setConversations((conversations)=> {
          const conversationExists = conversations.find((conversation) => conversation._id === newConversation._id);
          if(conversationExists) {
            return conversations;
          }
          console.log(newConversation);
          const arr = new Array();
          arr.push(newConversation);
          arr.push(...conversations);
          console.log(arr);
          return arr;

        });
      }
      const socket = connectSocket('temporary-fake-token');
      socket?.on('newConversation', handleNewConversation);

      return () => {
        socket?.off('newConversation', handleNewConversation);
        disconnectSocket();
      };
    }
  }, [user]);

  const handleAddButtonClick = () => {
    setIsAddButtonsVisible(!isAddButtonsVisible);
  };

  const handleNewConversationClick = () => {
    navigate('/new-chat');
  };

  const handleNewGroupClick = () => {
    navigate('/new-group'); // Assuming you have a CreateGroup page
  };

  if (loading) {
    return <p>Loading conversations...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.conversationList}>
      <h2>Conversations</h2>
      <div>
        {conversations.map((conversation) => (
          <div key={conversation._id} className={styles.conversationItem}>
            <div

              onClick={() => onConversationSelect(conversation._id)}
              className={styles.conversationLink}
            >
              {conversation.type === 'group'
                ? conversation.name
                : conversation.participants.map((participant) => {
                  if(participant._id !== userId) return participant.username;})}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.addButtonContainer} ref={addButtonRef}>
        {isAddButtonsVisible && (
          <div className={styles.addButtons}>
            <button className={styles.addButton} onClick={handleNewConversationClick}>New Conversation</button>
            <button className={styles.addButton} onClick={handleNewGroupClick}>New Group</button>
          </div>
        )}
        <button className={styles.addButton} onClick={handleAddButtonClick}>+</button>
      </div>
    </div>
  );
};

export default ConversationList;