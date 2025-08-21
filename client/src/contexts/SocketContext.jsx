// /client/src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

// This line does the same as in api.js
const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { token } = useAuth();

    useEffect(() => {
        if (token) {
            // Create a new socket connection with auth token
            const newSocket = io(SOCKET_URL, {
                auth: { token }
            });

            newSocket.on('connect', () => {
                console.log('[Socket.io] Connected to server.');
            });

            newSocket.on('connect_error', (err) => {
                console.error('[Socket.io] Connection Error:', err.message);
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        // ✅ Add socket in dependency array to avoid stale closure
    }, [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>   {/* ✅ fixed closing tag */}
    );
};
