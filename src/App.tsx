//import React, {useContext} from 'react';
//import React, {useContext} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
//import Login from './components/auth/Login'
//import Register from './components/auth/Register'
import ConversationList from './components/chat/ConversationList';
import ChatArea from './components/chat/ChatArea';
import PrivateRoute from './components/shared/PrivateRoute';
import { useEffect, useState } from 'react';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { AuthProvider } from './contexts/AuthContext';
import ProfileDropdown from './components/shared/ProfileDropdown';
import SearchPeople from './components/shared/SearchPeople';
function App() {

  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isMobileChatActive, setIsMobileChatActive] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [profileDropdownIsOpen, setProfileDropdownIsOpen] = useState<boolean>(false);
  // Handle light and dark mode changes
  useEffect(()=> {
    const val = (isDarkMode) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', val);
  }, [isDarkMode]);

  // Handles the tansfer of conversationId 
  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversation(conversationId);
    // To do, find a better way to do this
    if(window.innerWidth <= 600) {
      setIsMobileChatActive(true);
    }
  }
  // Handles backButton
  const handleBackButtonClick = () => {
    setIsMobileChatActive(false);
    setSelectedConversation('');
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={
            <PrivateRoute>
              <div className="app-container">
                <div className="header">
                  <h1>Chatter</h1>
                  <button className="back-button" onClick={handleBackButtonClick}>Back</button>
                  <div className="theme-toggle-profile-container">
                    <div className="view-mode-toggle" onClick={()=> {setIsDarkMode(!isDarkMode)}}></div>
                    <ProfileDropdown opened={profileDropdownIsOpen}/>
                  </div>
                </div>
                <div className='chat-layout'>
                  <div className={`chat-list-container ${isMobileChatActive ? 'active' : ''}`}>
                    <ConversationList onConversationSelect={handleConversationSelect}></ConversationList>
                  </div>
                  <div className={`chat-area-container ${isMobileChatActive ? 'active' : ''}`}>
                    {(selectedConversation !== '') ? <ChatArea conversationId={selectedConversation}/> : ''}
                  </div>
                </div>
              </div>
            </PrivateRoute>}/>
            <Route path="search" element={
              <PrivateRoute>
                <SearchPeople onConversationSelect={handleConversationSelect}/>
              </PrivateRoute>
            }/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
