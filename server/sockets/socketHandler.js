// /server/sockets/socketHandler.js

const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error'));
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded.user;
            next();
        } catch (err) { next(new Error('Authentication error')); }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket.io] Authenticated user connected: ${socket.id} (User ID: ${socket.user.id})`);
        socket.join(socket.user.id);

        socket.on('task:create', async (data) => {
            try {
                const { title, status } = data;
                const highestOrderTask = await Task.findOne({ user: socket.user.id, status }).sort({ order: -1 });
                const order = highestOrderTask ? highestOrderTask.order + 1 : 0;
                // We now create with a default priority
                const newTask = new Task({ user: socket.user.id, title, status, order, priority: 'Medium' });
                const task = await newTask.save();
                io.to(socket.user.id).emit('task:created', task);
            } catch (err) {
                console.error(`[Socket Error on task:create] ${err.message}`);
                socket.emit('error:task', { message: 'Failed to create task' });
            }
        });

        socket.on('task:updateContent', async (data, callback) => {
            try {
                const { taskId, updates } = data; // updates can now include priority and dueDate
                const task = await Task.findOneAndUpdate(
                    { _id: taskId, user: socket.user.id },
                    { $set: updates },
                    { new: true }
                );
                if (!task) return typeof callback === 'function' && callback({ success: false, message: 'Task not found' });
                io.to(socket.user.id).emit('task:updated', task);
                if (typeof callback === 'function') callback({ success: true, task });
            } catch (err) {
                console.error(`[Socket Error on task:updateContent] ${err.message}`);
                if (typeof callback === 'function') callback({ success: false, message: 'Failed to update content' });
            }
        });
        
        // ... (tasks:updateOrder and task:delete remain unchanged) ...
        socket.on('tasks:updateOrder', async (data) => {
            try {
                const { tasks } = data;
                const bulkOps = tasks.map(task => ({
                    updateOne: { filter: { _id: new mongoose.Types.ObjectId(task._id), user: socket.user.id }, update: { $set: { order: task.order, status: task.status } } }
                }));
                if (bulkOps.length > 0) await Task.bulkWrite(bulkOps);
                const updatedTasks = await Task.find({ user: socket.user.id }).sort({ order: 'asc' });
                socket.broadcast.to(socket.user.id).emit('tasks:reordered', updatedTasks);
            } catch (err) {
                console.error(`[Socket Error on tasks:updateOrder] ${err.message}`);
                socket.emit('error:task', { message: 'Failed to update task order' });
            }
        });
        socket.on('task:delete', async (data) => {
            try {
                const { taskId } = data;
                const task = await Task.findOneAndDelete({ _id: taskId, user: socket.user.id });
                if (!task) return;
                io.to(socket.user.id).emit('task:deleted', { taskId });
            } catch (err) {
                console.error(`[Socket Error on task:delete] ${err.message}`);
                socket.emit('error:task', { message: 'Failed to delete task' });
            }
        });
    });
};