import React, { useState, useEffect, useRef } from 'react';
import { searchUsers } from '../../services/userService';
import { User} from '../../types/types';
import styles from './SearchPeople.module.css';

interface SearchPeopleProps {
    setLoading: (loading: boolean) => void;
    setSearchResults: (UserArray: User[]) => void;
    setError: (value: string|null) => void;
}

const SearchPeople: React.FC<any> = ({ setLoading, setSearchResults, setError }) => {
    const [searchItem, setSearchItem] = useState<string>('');
    const timeoutRef = useRef<any>(null);
    const handleSearch = async () => {
        if (!searchItem) {
            setSearchResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const results = await searchUsers(searchItem);
            setSearchResults(results);
        } catch (err: any) {
            setError(err.message || 'Search failed');
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            if (searchItem === '' || searchItem.length > 2)
                handleSearch();
        }, 500);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchItem]);

    return (
        <input
            type="text"
            placeholder='Search by email'
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            className={styles.searchInput}
        />
    );
}

export default SearchPeople;