// /server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config(); // Loads environment variables from .env locally, or from Render's settings when deployed
const connectDB = require('./config/db');
const initializeSocket = require('./sockets/socketHandler');

// --- 1. INITIALIZATION ---
// Connect to the database immediately. If this fails, the app will exit.
connectDB();

const app = express();
const server = http.createServer(app);

// --- 2. MIDDLEWARE ---
// This allows our server to accept and parse JSON data in request bodies
app.use(express.json({ extended: false }));

// This is the permissive CORS setup for production deployment.
// It allows your Vercel frontend (and any other origin) to make requests to this server.
const corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));


// --- 3. API ROUTES ---
// Any request to '/api/auth' will be handled by the authRoutes file.
app.use('/api/auth', require('./routes/authRoutes'));
// Any request to '/api/tasks' will be handled by the taskRoutes file.
app.use('/api/tasks', require('./routes/taskRoutes'));


// --- 4. SOCKET.IO REAL-TIME ENGINE ---
const io = new Server(server, {
    cors: corsOptions // Important to use the same CORS options for sockets
});

// Pass the 'io' instance to our dedicated socket handler logic
initializeSocket(io);


// --- 5. SERVER STARTUP ---
// Render will provide the PORT via its own environment variables.
// For local development, it will fall back to 3001 if not defined in .env.
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
    console.log(`[Server] Singularity Core online. Listening on port ${PORT}`);
});