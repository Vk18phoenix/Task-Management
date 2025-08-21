// /server/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // process.env.MONGO_URI is loaded from your Render environment variables
        await mongoose.connect(process.env.MONGO_URI);

        console.log('[Database] Connection to MongoDB established successfully.');
    } catch (err) {
        // This log is crucial for debugging in Render
        console.error(`[Database] Error connecting to MongoDB: ${err.message}`);
        
        // This tells the Render service to stop if it can't connect to the DB.
        // It's better for it to stop and alert you than to run in a broken state.
        process.exit(1);
    }
};

module.exports = connectDB;