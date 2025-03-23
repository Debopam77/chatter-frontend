import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
    const { loginUser } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const navigate = useNavigate();
    const [error, setError] = useState<string|null>(null);

    // if(user!== undefined) {
    //     useContext(AuthContext).user = user;
    //     navigate('/');
    // }
    // useEffect(()=> {
    //     if(newUser) {
    //         user = newUser;
    //         isAuthenticated = true;
    //         navigate('/');
    //     }
    // }, [newUser]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        try {
            
            await loginUser({email, password});
            navigate('/');
        } catch(error: any) {
            setError(error.message || 'Login failed');
        }
    };

    return (
    <div className={styles.authContainer}>
      <h2>Login</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <a href="/register">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
