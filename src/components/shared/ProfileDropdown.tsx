import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './ProfileDropdown.module.css';

interface ProfileDropdownProps {
    opened: boolean;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure to logout?")) {
        logoutUser();
        navigate('/login');
        setIsOpen(false);
    } else {
        console.log("Logout selected by mistake");
    }
    
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.profileDropdown} ref={dropdownRef}>
      <div className={styles.profileIcon} onClick={handleToggle}>
        {/* Replace with your profile icon */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22C7.9 14.43 9.89 13 12 13c2.1 0 4.1 1.43 5.9 2.98-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
      </div>
      {isOpen && (
        <div className={styles.dropdownContent}>
          <button onClick={() => { navigate('/profile'); setIsOpen(false); }}>Profile Page</button>
          <button onClick={() => { navigate('/search'); setIsOpen(false); }}>Search for People</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;