// /client/src/components/specific/TaskColumn.jsx

import React from 'react';
import styled from 'styled-components';
import { Reorder } from 'framer-motion';
import TaskCard from './TaskCard';
import { FiPlus } from 'react-icons/fi';

const ColumnContainer = styled.div` background: ${({ theme }) => theme.colors.glassBackground}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; border-radius: 16px; padding: ${({ theme }) => theme.spacing.medium}; display: flex; flex-direction: column; height: 100%; `;
const ColumnHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 0 ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium}; `;
const ColumnTitle = styled.h2` font-size: 1.5rem; color: ${({ theme }) => theme.colors.secondary}; font-weight: 500; `;
const AddTaskButton = styled.button` background: none; border: none; color: ${({ theme }) => theme.colors.secondary}; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; transition: color 0.2s ease; &:hover { color: ${({ theme }) => theme.colors.accent}; } `;
const TaskList = styled(Reorder.Group)` flex-grow: 1; overflow-y: auto; padding: 0 ${({ theme }) => theme.spacing.small}; list-style: none; `;

const TaskColumn = ({ status, tasks, socket, onEditRequest }) => {
    const columnTasks = tasks
        .filter(task => task.status === status)
        .sort((a, b) => a.order - b.order);

    const handleCreate = () => {
        if (socket) socket.emit('task:create', { title: "New Task", status });
    };

    const handleReorder = (reorderedColumnTasks) => {
        const tasksFromOtherColumns = tasks.filter(task => task.status !== status);
        const updatedColumnTasks = reorderedColumnTasks.map((task, index) => ({ ...task, order: index }));
        const newFullTasksList = [...tasksFromOtherColumns, ...updatedColumnTasks];
        // We optimistically update the state and emit the change
        // Note: For this to work, the parent's `setTasks` would need to be passed down.
        // But the current architecture has the parent listening for the broadcast.
        if (socket) socket.emit('tasks:updateOrder', { tasks: newFullTasksList });
    };

    return (
        <ColumnContainer>
            <ColumnHeader>
                <ColumnTitle>{status}</ColumnTitle>
                <AddTaskButton onClick={handleCreate}><FiPlus /></AddTaskButton>
            </ColumnHeader>
            <TaskList values={columnTasks} onReorder={handleReorder}>
                {columnTasks.map(task => (
                    <TaskCard 
                        key={task._id} 
                        task={task} 
                        socket={socket}
                        onEditRequest={onEditRequest}
                    />
                ))}
            </TaskList>
        </ColumnContainer>
    );
};

export default TaskColumn;