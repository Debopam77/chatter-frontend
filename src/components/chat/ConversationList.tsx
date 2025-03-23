// src/components/Chat/ConversationList.tsx
import React, { useState, useEffect } from 'react';
import { Conversation } from '../../types/types'; // Assuming you have this type
import { getConversations } from '../../services/chatService';
import styles from './ConversationList.module.css'; // Import CSS module
import { useAuth } from '../../contexts/AuthContext';

interface ConversationListProps {
  onConversationSelect: (conversationId: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({ onConversationSelect }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {user} = useAuth();
  const userId = user?._id;

  useEffect(() => {
    // To do - get user id
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const fetchedConversations = await getConversations(userId);
        setConversations(fetchedConversations);    
      } catch (err: any) {
        setError('Heya ' +err.message || 'Failed to load conversations.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

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
    </div>
  );
};

export default ConversationList;