// /client/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { api } from '../api/api';
import TaskColumn from '../components/specific/TaskColumn';
import EditTaskModal from '../components/specific/EditTaskModal';

const DashboardContainer = styled.div` height: 100vh; width: 100vw; padding: ${({ theme }) => theme.spacing.large}; display: flex; flex-direction: column; `;
const Header = styled.header` display: flex; justify-content: space-between; align-items: center; margin-bottom: ${({ theme }) => theme.spacing.large}; `;
const Title = styled.h1` font-size: ${({ theme }) => theme.fontSizes.large}; text-shadow: 0 0 10px ${({ theme }) => theme.colors.accentGlow}; `;
const HeaderActions = styled.div` display: flex; gap: ${({ theme }) => theme.spacing.medium}; `;
const ActionButton = styled.button` padding: 10px 20px; font-size: 0.9rem; background-color: transparent; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; color: ${({ theme }) => theme.colors.secondary}; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; &:hover { background-color: ${({ theme }) => theme.colors.glassBackground}; color: ${({ theme }) => theme.colors.primary}; border-color: ${({ theme }) => theme.colors.accent}; } `;
const Board = styled.div` display: grid; grid-template-columns: repeat(3, 1fr); gap: ${({ theme }) => theme.spacing.large}; flex-grow: 1; `;

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const DashboardPage = () => {
    const { logout } = useAuth();
    const socket = useSocket();
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);

    // Initial data fetch
    useEffect(() => {
        api.get('/tasks')
            .then(res => setTasks(res.data))
            .catch(err => console.error("Failed to fetch tasks", err));
    }, []);

    // Socket listeners - This is the single source of truth for state changes
    useEffect(() => {
        if (!socket) return;

        const handleTaskCreated = (newTask) => setTasks(prev => [...prev, newTask]);
        const handleTaskUpdated = (updatedTask) => setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        const handleTaskDeleted = ({ taskId }) => setTasks(prev => prev.filter(t => t._id !== taskId));
        const handleTasksReordered = (reorderedTasks) => setTasks(reorderedTasks);

        socket.on('task:created', handleTaskCreated);
        socket.on('task:updated', handleTaskUpdated);
        socket.on('task:deleted', handleTaskDeleted);
        socket.on('tasks:reordered', handleTasksReordered);

        return () => {
            socket.off('task:created', handleTaskCreated);
            socket.off('task:updated', handleTaskUpdated);
            socket.off('task:deleted', handleTaskDeleted);
            socket.off('tasks:reordered', handleTasksReordered);
        };
    }, [socket]);

    return (
        <DashboardContainer>
            <Header>
                <Title>Singularity Board</Title>
                <HeaderActions>
                    <ActionButton onClick={logout}>Log Out</ActionButton>
                </HeaderActions>
            </Header>
            <Board>
                {COLUMNS.map(status => (
                    <TaskColumn
                        key={status}
                        status={status}
                        // We pass the tasks and the socket directly
                        tasks={tasks}
                        socket={socket}
                        // This allows child components to trigger edits
                        onEditRequest={setEditingTask}
                    />
                ))}
            </Board>
            {editingTask && (
                <EditTaskModal 
                    task={editingTask} 
                    onClose={() => setEditingTask(null)} 
                    socket={socket} // Pass the socket to the modal too
                />
            )}
        </DashboardContainer>
    );
};

export default DashboardPage;