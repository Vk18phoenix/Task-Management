// /client/src/contexts/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setAuthToken } from '../api/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            setAuthToken(token);
            setUser({ isAuthenticated: true });
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { token } = res.data;

            localStorage.setItem('token', token);
            setToken(token);
            setAuthToken(token);
            setUser({ isAuthenticated: true });
            navigate('/dashboard');
        } catch (err) {
            console.error('Login failed', err);
            
            if (err.response) {
                alert('Login Failed: ' + err.response.data.msg);
            } else {
                alert('Login Failed: Cannot connect to the server. Please make sure the backend is running.');
            }
        }
    };

    const signup = async (username, email, password) => {
        try {
            const res = await api.post('/auth/register', { username, email, password });
            const { token } = res.data;

            localStorage.setItem('token', token);
            setToken(token);
            setAuthToken(token);
            setUser({ isAuthenticated: true });
            navigate('/dashboard');
        } catch (err) {
            console.error('Signup failed', err);
            if (err.response) {
                alert('Signup Failed: ' + err.response.data.msg);
            } else {
                alert('Signup Failed: Cannot connect to the server.');
            }
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthToken(null);
        setUser(null);
        navigate('/login');
    };

    const value = { user, token, loading, login, signup, logout };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider> // <-- THIS IS THE CORRECTED CLOSING TAG
    );
};