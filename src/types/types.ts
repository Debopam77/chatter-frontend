export interface User {
    _id: string,
    username: string,
    email: string, 
    profilePicture?: string
}

export interface Conversation {
    _id: string,
    type: 'private' | 'group',
    participants: User[],
    name?: string, // For group chats
    createdAt: Date,
    lastMessageAt: Date
}

export interface Message {
    _id: string,
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    type: 'text' | 'image' | 'file',
    timestamp: Date,
    readBy: string[]
}