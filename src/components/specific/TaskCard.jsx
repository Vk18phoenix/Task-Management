// /client/src/components/specific/TaskCard.jsx

import React from 'react';
import styled, { css } from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Tilt from 'react-parallax-tilt';
import { FiTrash2, FiEdit2, FiClock } from 'react-icons/fi'; // Add Clock icon

const CardContainer = styled.div` background: rgba(255, 255, 255, 0.08); border-radius: 12px; padding: ${({ theme }) => theme.spacing.medium}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; position: relative; transform-style: preserve-3d; `;
const CardTitle = styled.h3` font-size: 1.1rem; color: ${({ theme }) => theme.colors.primary}; margin-bottom: ${({ theme }) => theme.spacing.small}; font-family: ${({ theme }) => theme.fonts.main}; font-weight: 500; padding-right: 50px; `;
const CardDescription = styled.p` font-size: 0.9rem; color: ${({ theme }) => theme.colors.secondary}; line-height: 1.4; padding-right: 50px; margin-bottom: ${({ theme }) => theme.spacing.medium}; `;
const IconContainer = styled.div` position: absolute; top: 16px; right: 16px; display: flex; gap: 10px; opacity: 0; transition: opacity 0.2s ease-in-out; ${CardContainer}:hover & { opacity: 1; } `;
const IconButton = styled.button` background: none; border: none; color: ${({ theme }) => theme.colors.secondary}; cursor: pointer; font-size: 1rem; transition: color 0.2s ease-in-out; &:hover { color: ${({ theme, deleteBtn }) => deleteBtn ? theme.colors.error : theme.colors.accent}; } `;
const DraggableWrapper = styled.div` margin-bottom: ${({ theme }) => theme.spacing.medium}; `;

// NEW STYLED COMPONENTS
const CardFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: ${({ theme }) => theme.spacing.medium};
`;

const PriorityTag = styled.div`
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    
    ${({ priority, theme }) => {
        if (priority === 'High') return css` background: rgba(255, 80, 80, 0.2); color: rgba(255, 120, 120, 0.9); box-shadow: 0 0 8px rgba(255, 80, 80, 0.3);`;
        if (priority === 'Medium') return css` background: rgba(255, 165, 0, 0.2); color: rgba(255, 185, 40, 0.9); box-shadow: 0 0 8px rgba(255, 165, 0, 0.3);`;
        if (priority === 'Low') return css` background: rgba(0, 200, 255, 0.2); color: rgba(40, 220, 255, 0.9); box-shadow: 0 0 8px rgba(0, 200, 255, 0.3);`;
    }}
`;

const DueDate = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.secondary};
`;

const TaskCard = ({ task, index, socket, onEditRequest }) => {
    const handleDelete = () => { if (socket) socket.emit('task:delete', { taskId: task._id }); };

    const formattedDueDate = task.dueDate 
        ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : null;

    return (
        <Draggable draggableId={task._id} index={index}>
            {(provided) => (
                <DraggableWrapper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} >
                    <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} glareEnable={true} glareMaxOpacity={0.1} glarePosition="all" scale={1.02}>
                        <CardContainer>
                            <CardTitle>{task.title}</CardTitle>
                            {task.description && <CardDescription>{task.description}</CardDescription>}
                            
                            <CardFooter style={{ transform: 'translateZ(10px)' }}>
                                <PriorityTag priority={task.priority}>{task.priority}</PriorityTag>
                                {formattedDueDate && (
                                    <DueDate><FiClock /> {formattedDueDate}</DueDate>
                                )}
                            </CardFooter>

                            <IconContainer style={{ transform: 'translateZ(20px)' }}>
                                <IconButton onClick={() => onEditRequest(task)}><FiEdit2 /></IconButton>
                                <IconButton deleteBtn onClick={handleDelete}><FiTrash2 /></IconButton>
                            </IconContainer>
                        </CardContainer>
                    </Tilt>
                </DraggableWrapper>
            )}
        </Draggable>
    );
};

export default TaskCard;