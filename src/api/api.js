// /client/src/api/api.js

import axios from 'axios';

// Create an instance of axios
export const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Your backend API URL
    headers: {
        'Content-Type': 'application/json'
    }
});

// A function to set the auth token on subsequent requests
export const setAuthToken = (token) => {
    if (token) {
        // Apply authorization token to every request if logged in
        api.defaults.headers.common['x-auth-token'] = token;
    } else {
        // Delete auth header
        delete api.defaults.headers.common['x-auth-token'];
    }
};