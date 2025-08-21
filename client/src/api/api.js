// /client/src/api/api.js
import axios from 'axios';

// This line reads the VITE_API_BASE_URL from your Vercel environment variables.
// When you run locally (`npm run dev`), Vite is smart enough to know this variable doesn't exist
// and it will probably work fine, but for deployment this is essential.
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const api = axios.create({
    baseURL: `${API_URL}/api`, // Use the variable here
    headers: {
        'Content-Type': 'application/json'
    }
});

export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['x-auth-token'] = token;
    } else {
        delete api.defaults.headers.common['x-auth-token'];
    }
};