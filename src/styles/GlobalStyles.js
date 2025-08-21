// client/src/styles/GlobalStyles.js

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Roboto+Mono:wght@400;700&display=swap');

    *,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html, body, #root {
        height: 100%;
        overflow: hidden;
    }

    body {
        background-color: ${({ theme }) => theme.colors.background};
        color: ${({ theme }) => theme.colors.primary};
        font-family: ${({ theme }) => theme.fonts.main};
        width: 100vw;
    }

    #root {
        width: 100%;
        position: relative;
        z-index: 1;
    }

    body::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.1), transparent 40%),
                    radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.1), transparent 40%),
                    radial-gradient(circle at 80% 30%, rgba(255, 0, 255, 0.1), transparent 40%);
        animation: aurora 20s infinite linear;
        will-change: background;
        z-index: -1;
    }

    @keyframes aurora {
        0% {
            background-position: 0% 50%, 50% 100%, 100% 0%;
        }
        50% {
            background-position: 100% 50%, 0% 0%, 50% 100%;
        }
        100% {
            background-position: 0% 50%, 50% 100%, 100% 0%;
        }
    }

    h1, h2, h3 {
        font-family: ${({ theme }) => theme.fonts.heading};
        font-weight: 700;
        color: ${({ theme }) => theme.colors.primary};
        letter-spacing: 1.5px;
    }

    a {
        /* THIS IS THE CORRECTED LINE */
        color: ${({ theme }) => theme.colors.accent};
        text-decoration: none;
    }
`;