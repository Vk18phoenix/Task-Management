// /client/src/contexts/SocketContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            // Establish connection only when token is available
            const newSocket = io('http://localhost:3001', {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('[Socket.io] Connected to server.');
            });

            newSocket.on('connect_error', (err) => {
                console.error('[Socket.io] Connection Error:', err.message);
            });

            setSocket(newSocket);

            // Cleanup on component unmount or token change
            return () => {
                console.log('[Socket.io] Disconnecting...');
                newSocket.disconnect();
            };
        } else if (socket) {
            // If token is removed (logout), disconnect the existing socket
            console.log('[Socket.io] Token removed, disconnecting...');
            socket.disconnect();
            setSocket(null);
        }
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};