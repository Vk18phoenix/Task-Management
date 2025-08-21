// /server/server.js

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const initializeSocket = require('./sockets/socketHandler'); // Import the handler

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Init Middleware
app.use(express.json({ extended: false }));

// Setup CORS
const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));

// Define API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes')); // Use the task routes

// Initialize Socket.io
const io = new Server(server, {
    cors: corsOptions
});

// Pass the 'io' instance to our handler
initializeSocket(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`[Server] Singularity Core online. Listening on port ${PORT}`);
});