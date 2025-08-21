// /client/src/components/specific/EditTaskModal.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ModalBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; `;
const ModalContent = styled(motion.div)` width: 500px; padding: ${({ theme }) => theme.spacing.large}; background: ${({ theme }) => theme.colors.glassBackground}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; border-radius: 16px; backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); `;
const ModalTitle = styled.h2` margin-bottom: ${({ theme }) => theme.spacing.medium}; color: ${({ theme }) => theme.colors.primary}; `;
const Input = styled.input` width: 100%; padding: 12px; margin-bottom: ${({ theme }) => theme.spacing.medium}; background-color: rgba(0,0,0,0.2); border: 1px solid ${({ theme }) => theme.colors.secondary}; border-radius: 8px; color: ${({ theme }) => theme.colors.primary}; font-size: ${({ theme }) => theme.fontSizes.medium}; outline: none; transition: all 0.2s ease-in-out; &:focus { border-color: ${({ theme }) => theme.colors.accent}; box-shadow: ${({ theme }) => theme.shadows.glow}; } `;
const TextArea = styled.textarea` width: 100%; padding: 12px; margin-bottom: ${({ theme }) => theme.spacing.medium}; background-color: rgba(0,0,0,0.2); border: 1px solid ${({ theme }) => theme.colors.secondary}; border-radius: 8px; color: ${({ theme }) => theme.colors.primary}; font-size: ${({ theme }) => theme.fontSizes.medium}; outline: none; resize: vertical; min-height: 100px; font-family: inherit; transition: all 0.2s ease-in-out; &:focus { border-color: ${({ theme }) => theme.colors.accent}; box-shadow: ${({ theme }) => theme.shadows.glow}; } `;
const ButtonContainer = styled.div` display: flex; justify-content: flex-end; gap: ${({ theme }) => theme.spacing.medium}; `;
const Button = styled.button` padding: 10px 20px; border-radius: 8px; border: 1px solid transparent; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s ease-in-out; background: ${({ theme, $primary }) => $primary ? theme.colors.accent : 'transparent'}; color: ${({ theme, $primary }) => $primary ? theme.colors.background : theme.colors.primary}; border-color: ${({ theme, $primary }) => $primary ? 'transparent' : theme.colors.glassBorder}; &:hover { transform: translateY(-2px); } `;

// NEW STYLED COMPONENTS
const OptionsContainer = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.large};
    margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const FieldGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.small};
`;

const Label = styled.label`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.secondary};
`;

const Select = styled.select`
    padding: 10px;
    background-color: rgba(0,0,0,0.2);
    border: 1px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 8px;
    color: ${({ theme }) => theme.colors.primary};
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.accent}; }
`;

const DateInput = styled(Input)`
    /* Style the date picker's calendar icon */
    &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
`;

const EditTaskModal = ({ task, onClose, socket }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority || 'Medium');
            // Format the date for the date input field (YYYY-MM-DD)
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        }
    }, [task]);
    
    if (!task) return null;

    const handleSave = () => {
        if (!socket) return;
        const updates = { 
            title, 
            description,
            priority,
            dueDate: dueDate || null // Send null if the date is cleared
        };
        socket.emit('task:updateContent', { taskId: task._id, updates }, (res) => {
            if (res.success) onClose();
            else alert('Failed to save changes: ' + res.message);
        });
    };

    return (
        <AnimatePresence>
            <ModalBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} >
                <ModalContent initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} >
                    <ModalTitle>Edit Task</ModalTitle>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
                    <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task Description"/>
                    
                    <OptionsContainer>
                        <FieldGroup>
                            <Label htmlFor="priority">Priority</Label>
                            <Select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </Select>
                        </FieldGroup>
                        <FieldGroup>
                            <Label htmlFor="dueDate">Due Date</Label>
                            <DateInput id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                        </FieldGroup>
                    </OptionsContainer>

                    <ButtonContainer>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button $primary onClick={handleSave}>Save</Button>
                    </ButtonContainer>
                </ModalContent>
            </ModalBackdrop>
        </AnimatePresence>
    );
};

export default EditTaskModal;