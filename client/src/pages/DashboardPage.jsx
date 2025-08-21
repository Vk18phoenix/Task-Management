// /client/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import { motion } from 'framer-motion'; // NEW IMPORT
import toast from 'react-hot-toast'; // NEW IMPORT
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { api } from '../api/api';
import TaskColumn from '../components/specific/TaskColumn';
import EditTaskModal from '../components/specific/EditTaskModal';
import CommandPalette from '../components/specific/CommandPalette';
import { useMousePosition } from '../hooks/useMousePosition';
import { useKeyPress } from '../hooks/useKeyPress';

const DashboardContainer = styled(motion.div)` height: 100vh; width: 100vw; padding: ${({ theme }) => theme.spacing.large}; display: flex; flex-direction: column; `;
const Header = styled.header` display: flex; justify-content: space-between; align-items: center; margin-bottom: ${({ theme }) => theme.spacing.large}; `;
const Title = styled.h1` font-size: ${({ theme }) => theme.fontSizes.large}; text-shadow: 0 0 10px ${({ theme }) => theme.colors.accentGlow}; `;
const HeaderActions = styled.div` display: flex; align-items: center; gap: ${({ theme }) => theme.spacing.medium}; `;
const ActionButton = styled.button` padding: 10px 20px; font-size: 0.9rem; background-color: transparent; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; color: ${({ theme }) => theme.colors.secondary}; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; &:hover { background-color: ${({ theme }) => theme.colors.glassBackground}; color: ${({ theme }) => theme.colors.primary}; border-color: ${({ theme }) => theme.colors.accent}; } `;
const HintText = styled.span` color: ${({ theme }) => theme.colors.secondary}; font-size: 0.9rem; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; padding: 6px 10px; border-radius: 6px; `;
const Board = styled(motion.div)` display: grid; grid-template-columns: repeat(3, 1fr); gap: ${({ theme }) => theme.spacing.large}; flex-grow: 1; `;

// ANIMATION VARIANTS
const boardVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1 // Each column will animate in 0.1s after the previous one
        }
    }
};

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const DashboardPage = () => {
    const { logout } = useAuth();
    const socket = useSocket();
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const { x, y } = useMousePosition();
    useKeyPress(() => setIsPaletteOpen(true), 'k');
    useEffect(() => { document.body.style.setProperty('--mouse-x', `${x}px`); document.body.style.setProperty('--mouse-y', `${y}px`); }, [x, y]);
    useEffect(() => { api.get('/tasks').then(res => setTasks(res.data)).catch(err => console.error("Failed to fetch tasks", err)); }, []);

    // UPGRADED SOCKET LISTENERS WITH TOASTS
    useEffect(() => {
        if (!socket) return;
        const handleTaskCreated = (newTask) => {
            setTasks(prev => [...prev, newTask]);
            // Only show toast if the task was created by another client
            // A simple check could be to see if the user ID matches, but for now we'll show for all.
            toast.success(`New Task Added: "${newTask.title}"`);
        };
        const handleTaskUpdated = (updatedTask) => setTasks(prev => prev.map(t => t._id === updatedTask._id ? updatedTask : t));
        const handleTaskDeleted = ({ taskId }) => {
            const deletedTask = tasks.find(t => t._id === taskId);
            setTasks(prev => prev.filter(t => t._id !== taskId));
            if(deletedTask) toast.error(`Task Deleted: "${deletedTask.title}"`);
        };
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
    }, [socket, tasks]); // Add tasks dependency to get the title on delete

    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;
        const startColumnStatus = source.droppableId, endColumnStatus = destination.droppableId;
        let allTasks = Array.from(tasks), movedTask = allTasks.find(t => t._id === draggableId);
        let startColumnTasks = allTasks.filter(t => t.status === startColumnStatus).sort((a,b) => a.order - b.order);
        startColumnTasks.splice(source.index, 1);
        let endColumnTasks = allTasks.filter(t => t.status === endColumnStatus).sort((a,b) => a.order - b.order);
        if (startColumnStatus !== endColumnStatus) movedTask.status = endColumnStatus;
        endColumnTasks.splice(destination.index, 0, movedTask);
        const reorder = (list) => list.forEach((t, index) => t.order = index);
        reorder(startColumnTasks); reorder(endColumnTasks);
        const tasksFromUnchangedColumns = allTasks.filter(t => t.status !== startColumnStatus && t.status !== endColumnStatus);
        const newTasksState = [...tasksFromUnchangedColumns, ...startColumnTasks, ...endColumnTasks];
        setTasks(newTasksState);
        if (socket) socket.emit('tasks:updateOrder', { tasks: newTasksState });
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <DashboardContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <Header>
                    <Title>Singularity Board</Title>
                    <HeaderActions>
                        <HintText>Press Ctrl+K</HintText>
                        <ActionButton onClick={logout}>Log Out</ActionButton>
                    </HeaderActions>
                </Header>
                <Board variants={boardVariants} initial="hidden" animate="visible">
                    {COLUMNS.map(status => ( <TaskColumn key={status} status={status} tasks={tasks.filter(t => t.status === status).sort((a,b) => a.order - b.order)} socket={socket} onEditRequest={setEditingTask}/> ))}
                </Board>
                {editingTask && <EditTaskModal task={editingTask} onClose={() => setEditingTask(null)} socket={socket}/>}
                <CommandPalette isOpen={isPaletteOpen} setIsOpen={setIsPaletteOpen} tasks={tasks} socket={socket} logout={logout}/>
            </DashboardContainer>
        </DragDropContext>
    );
};

export default DashboardPage;