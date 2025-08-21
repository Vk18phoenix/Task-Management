// /client/src/components/specific/TaskCard.jsx

import React from 'react';
import styled from 'styled-components';
import { Reorder } from "framer-motion";
import { FiTrash2, FiEdit2 } from 'react-icons/fi';

const CardContainer = styled.div` background: rgba(255, 255, 255, 0.08); border-radius: 12px; padding: ${({ theme }) => theme.spacing.medium}; margin-bottom: ${({ theme }) => theme.spacing.medium}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; position: relative; cursor: grab; &:active { cursor: grabbing; } `;
const CardTitle = styled.h3` font-size: 1.1rem; color: ${({ theme }) => theme.colors.primary}; margin-bottom: ${({ theme }) => theme.spacing.small}; font-family: ${({ theme }) => theme.fonts.main}; font-weight: 500; padding-right: 50px; `;
const CardDescription = styled.p` font-size: 0.9rem; color: ${({ theme }) => theme.colors.secondary}; line-height: 1.4; padding-right: 50px; `;
const IconContainer = styled.div` position: absolute; top: 16px; right: 16px; display: flex; gap: 10px; opacity: 0; transition: opacity 0.2s ease-in-out; ${CardContainer}:hover & { opacity: 1; } `;
const IconButton = styled.button` background: none; border: none; color: ${({ theme }) => theme.colors.secondary}; cursor: pointer; font-size: 1rem; transition: color 0.2s ease-in-out; &:hover { color: ${({ theme, deleteBtn }) => deleteBtn ? theme.colors.error : theme.colors.accent}; } `;

const TaskCard = ({ task, socket, onEditRequest }) => {
    const handleDelete = () => {
        if (socket) socket.emit('task:delete', { taskId: task._id });
    };

    return (
        <Reorder.Item 
            value={task} 
            id={task._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeInOut' } }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: 'easeIn' } }}
            whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
        >
            <CardContainer>
                <CardTitle>{task.title}</CardTitle>
                {task.description && <CardDescription>{task.description}</CardDescription>}
                <IconContainer>
                    <IconButton onClick={() => onEditRequest(task)}><FiEdit2 /></IconButton>
                    <IconButton deleteBtn onClick={handleDelete}><FiTrash2 /></IconButton>
                </IconContainer>
            </CardContainer>
        </Reorder.Item>
    );
};

export default TaskCard;