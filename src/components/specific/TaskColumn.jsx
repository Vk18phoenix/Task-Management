// /client/src/components/specific/TaskColumn.jsx

import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion'; // NEW IMPORT
import TaskCard from './TaskCard';
import { FiPlus } from 'react-icons/fi';

const ColumnContainer = styled(motion.div)` background: ${({ theme }) => theme.colors.glassBackground}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; border-radius: 16px; padding: ${({ theme }) => theme.spacing.medium}; display: flex; flex-direction: column; height: 100%; `;
const ColumnHeader = styled.div` display: flex; justify-content: space-between; align-items: center; padding: 0 ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium}; `;
const ColumnTitle = styled.h2` font-size: 1.5rem; color: ${({ theme }) => theme.colors.secondary}; font-weight: 500; `;
const AddTaskButton = styled.button` background: none; border: none; color: ${({ theme }) => theme.colors.secondary}; font-size: 1.5rem; cursor: pointer; display: flex; align-items: center; transition: color 0.2s ease; &:hover { color: ${({ theme }) => theme.colors.accent}; } `;
const TaskList = styled.div` flex-grow: 1; overflow-y: auto; padding: 0 ${({ theme }) => theme.spacing.small}; `;

// ANIMATION VARIANT for each column
const columnVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0
    }
};

const TaskColumn = ({ status, tasks, socket, onEditRequest }) => {
    const handleCreate = () => { if (socket) socket.emit('task:create', { title: "New Task", status }); };

    return (
        <ColumnContainer variants={columnVariants}>
            <ColumnHeader>
                <ColumnTitle>{status}</ColumnTitle>
                <AddTaskButton onClick={handleCreate}><FiPlus /></AddTaskButton>
            </ColumnHeader>
            <Droppable droppableId={status}>
                {(provided) => (
                    <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                        {tasks.map((task, index) => (
                            <TaskCard key={task._id} task={task} index={index} socket={socket} onEditRequest={onEditRequest} />
                        ))}
                        {provided.placeholder}
                    </TaskList>
                )}
            </Droppable>
        </ColumnContainer>
    );
};

export default TaskColumn;