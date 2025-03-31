import React, {useEffect} from 'react';
import { User } from '../../types/types';
import styles from './Avatar.module.css'

interface AvatarProps  {
    user: User|null;
}

const Avatar: React.FC<AvatarProps> = ({user}) => {

    let usernameArray: string[] = [];
    if(user?.username)
        usernameArray = user?.username.split(' ');
    let usernameInitials = '';
    if(usernameArray.length > 0) {
        usernameInitials += usernameArray[0][0];
    }
    // Get second character of initials
    if(usernameArray.length > 1) {
        usernameInitials += usernameArray[1][0];
    }

    return(
    <div className={styles.avatarContainer}>
        {(user?.profilePicture) ? <div className={styles.avatarPic}/> : <div className={styles.avatarInitials}>{usernameInitials}</div>}
        <div className={styles.avatarName}>{usernameArray[0]}</div>
    </div>);

}

export default Avatar;