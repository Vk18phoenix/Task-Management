// /client/src/components/specific/CommandPalette.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const PaletteBackdrop = styled(motion.div)` position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; padding-top: 15vh; z-index: 2000; backdrop-filter: blur(5px); `;
const PaletteContainer = styled(motion.div)` width: 600px; max-height: 400px; background: ${({ theme }) => theme.colors.glassBackground}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; border-radius: 12px; box-shadow: 0 16px 70px rgba(0,0,0,0.5); overflow: hidden; display: flex; flex-direction: column; `;
const SearchInput = styled.input` width: 100%; padding: 16px; font-size: 1.1rem; background: transparent; border: none; border-bottom: 1px solid ${({ theme }) => theme.colors.glassBorder}; color: ${({ theme }) => theme.colors.primary}; outline: none; &:focus { border-bottom-color: ${({ theme }) => theme.colors.accent}; } `;
const ResultsList = styled.ul` list-style: none; margin: 0; padding: 8px; overflow-y: auto; `;
const ResultItem = styled.li` padding: 12px 16px; color: ${({ theme, $isActive }) => $isActive ? theme.colors.primary : theme.colors.secondary}; background-color: ${({ theme, $isActive }) => $isActive ? 'rgba(0, 255, 255, 0.1)' : 'transparent'}; border-radius: 6px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; transition: all 0.1s ease-in-out; `;
const CommandLabel = styled.span``;
const CommandHint = styled.span` font-size: 0.8rem; color: ${({ theme }) => theme.colors.secondary}; `;

const CommandPalette = ({ isOpen, setIsOpen, tasks, socket, logout }) => {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const commands = useMemo(() => [
        { id: 'todo', label: "Create new 'To Do' task", action: () => socket.emit('task:create', { title: "New Task", status: "To Do" }) },
        { id: 'inprogress', label: "Create new 'In Progress' task", action: () => socket.emit('task:create', { title: "New Task", status: "In Progress" }) },
        { id: 'done', label: "Create new 'Done' task", action: () => socket.emit('task:create', { title: "New Task", status: "Done" }) },
        { id: 'logout', label: "Log Out", action: logout },
        ...tasks.map(task => ({
            id: task._id,
            label: task.title,
            hint: `in ${task.status}`,
            action: () => console.log(`Highlight task ${task._id}`) // Placeholder for future functionality
        }))
    ], [tasks, socket, logout]);

    const filteredCommands = useMemo(() => 
        commands.filter(cmd => cmd.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query]);

    const closePalette = useCallback(() => {
        setIsOpen(false);
        setQuery('');
        setActiveIndex(0);
    }, [setIsOpen]);

    const executeCommand = useCallback((command) => {
        if (command) {
            command.action();
            closePalette();
        }
    }, [closePalette]);
    
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % filteredCommands.length);
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                executeCommand(filteredCommands[activeIndex]);
            }
            if (e.key === 'Escape') {
                closePalette();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, filteredCommands, executeCommand, closePalette]);
    
    useEffect(() => {
        // Reset active index when query changes
        setActiveIndex(0);
    }, [query]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <PaletteBackdrop initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closePalette} >
                <PaletteContainer
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <SearchInput
                        autoFocus
                        type="text"
                        placeholder="Type a command or search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <ResultsList>
                        {filteredCommands.map((cmd, index) => (
                            <ResultItem
                                key={cmd.id}
                                $isActive={index === activeIndex}
                                onMouseDown={() => executeCommand(cmd)} // onMouseDown fires before onBlur
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <CommandLabel>{cmd.label}</CommandLabel>
                                {cmd.hint && <CommandHint>{cmd.hint}</CommandHint>}
                            </ResultItem>
                        ))}
                    </ResultsList>
                </PaletteContainer>
            </PaletteBackdrop>
        </AnimatePresence>
    );
};

export default CommandPalette;