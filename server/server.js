// /server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors'); // We will use this in the simplest, most powerful way
require('dotenv').config();
const connectDB = require('./config/db');
const initializeSocket = require('./sockets/socketHandler');

// --- 1. INITIALIZATION ---
connectDB();
const app = express();
const server = http.createServer(app);

// --- 2. MIDDLEWARE ---
app.use(express.json({ extended: false }));

// THIS IS THE SLEDGEHAMMER.
// This tells our server: "I DO NOT CARE where a request comes from.
// Whether it's Vercel, a local machine, or anything else, LET IT IN."
app.use(cors());


// --- 3. API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));


// --- 4. SOCKET.IO REAL-TIME ENGINE ---
const io = new Server(server, {
    // We apply the same sledgehammer policy to our sockets.
    cors: {
        origin: "*", // Allow any origin
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
initializeSocket(io);


// --- 5. SERVER STARTUP ---
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`[Server] Singularity Core online with Universal CORS. Listening on port ${PORT}`);
});