import React from 'react';
import ProfileDropdown from './ProfileDropdown';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css'

interface HeaderProps {
    isMobileChatActive: boolean;
    handleBackButtonClick: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
    profileDropdownIsOpen: boolean;
};

const Header: React.FC<HeaderProps> = ({ isMobileChatActive, handleBackButtonClick, isDarkMode, setIsDarkMode, profileDropdownIsOpen }) => {
    const navigate = useNavigate();

    return (
        <div className="header">
            <h1 
                className={styles.h1}
                onClick={()=> {navigate('/')}}
                >Chatter
            </h1>
            <button className={`back-button ${isMobileChatActive ? 'active' : ''}`} onClick={handleBackButtonClick} />
            <div className="theme-toggle-profile-container">
                <div className="view-mode-toggle" onClick={() => { setIsDarkMode(!isDarkMode) }}></div>
                <ProfileDropdown opened={profileDropdownIsOpen} />
            </div>
        </div>
    );
}

export default Header;