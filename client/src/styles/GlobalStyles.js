// /client/src/styles/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    /* ... (font import and reset styles remain the same) ... */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Roboto+Mono:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; overflow: hidden; }

    body {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.primary};
        font-family: ${({ theme }) => theme.fonts.main};
        width: 100vw;
        /* Define fallback values for our CSS variables */
        --mouse-x: 50%;
        --mouse-y: 50%;
    }

    #root { width: 100%; position: relative; z-index: 1; }

    body::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        /* THE AURORA IS NOW CENTERED ON OUR CSS VARIABLES */
        background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(0, 255, 255, 0.15), transparent 30%),
                    radial-gradient(circle at calc(var(--mouse-x) + 10%) calc(var(--mouse-y) - 20%), rgba(138, 43, 226, 0.1), transparent 40%),
                    radial-gradient(circle at calc(var(--mouse-x) - 20%) calc(var(--mouse-y) + 30%), rgba(255, 0, 255, 0.1), transparent 40%);
        
        will-change: background;
        z-index: -1;
        transition: background 0.5s linear; /* Add a smooth transition */
    }

    /* ... (rest of the styles h1, a, etc. remain the same) ... */
    h1, h2, h3 { font-family: ${({ theme }) => theme.fonts.heading}; font-weight: 700; color: ${({ theme }) => theme.colors.primary}; letter-spacing: 1.5px; }
    a { color: ${({ theme }) => theme.colors.accent}; text-decoration: none; }
`;