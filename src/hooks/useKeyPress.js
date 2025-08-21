// /client/src/hooks/useKeyPress.js

import { useEffect } from 'react';

export const useKeyPress = (callback, targetKey, metaKey = 'ctrlKey') => {
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (event.key === targetKey && (event.ctrlKey || event.metaKey)) { // metaKey for Cmd on Mac
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [callback, targetKey, metaKey]);
};