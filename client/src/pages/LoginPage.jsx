// /client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth

// ... (All styled components remain the same)
const PageContainer = styled(motion.div)` display: flex; justify-content: center; align-items: center; height: 100vh; width: 100vw; `;
const GlassCard = styled(motion.div)` width: 400px; padding: ${({ theme }) => theme.spacing.large}; background: ${({ theme }) => theme.colors.glassBackground}; border: 1px solid ${({ theme }) => theme.colors.glassBorder}; border-radius: 16px; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); z-index: 10; `;
const Title = styled.h1` font-size: ${({ theme }) => theme.fontSizes.large}; text-align: center; margin-bottom: ${({ theme }) => theme.spacing.large}; text-shadow: 0 0 10px ${({ theme }) => theme.colors.accentGlow}; `;
const Form = styled.form` display: flex; flex-direction: column; gap: ${({ theme }) => theme.spacing.medium}; `;
const InputWrapper = styled.div` position: relative; `;
const InputField = styled(motion.input)` width: 100%; padding: 14px; background-color: transparent; border: 1px solid ${({ theme }) => theme.colors.secondary}; border-radius: 8px; color: ${({ theme }) => theme.colors.primary}; font-size: ${({ theme }) => theme.fontSizes.medium}; outline: none; transition: border-color 0.3s ease; &:focus { border-color: ${({ theme }) => theme.colors.accent}; box-shadow: ${({ theme }) => theme.shadows.glow}; } `;
const SubmitButton = styled(motion.button)` padding: 14px; border-radius: 8px; border: none; background: ${({ theme }) => theme.colors.accent}; color: ${({ theme }) => theme.colors.background}; font-size: ${({ theme }) => theme.fontSizes.medium}; font-weight: 700; cursor: pointer; outline: none; box-shadow: ${({ theme }) => theme.shadows.glow}; transition: transform 0.2s ease, box-shadow 0.2s ease; &:hover { transform: scale(1.05); box-shadow: 0 0 25px ${({ theme }) => theme.colors.accentGlow}, 0 0 40px rgba(0, 255, 255, 0.4); } `;
const SubText = styled.p` text-align: center; margin-top: ${({ theme }) => theme.spacing.medium}; color: ${({ theme }) => theme.colors.secondary}; font-size: ${({ theme }) => theme.fontSizes.small}; `;
const StyledLink = styled(Link)` color: ${({ theme }) => theme.colors.accent}; text-decoration: none; font-weight: bold; &:hover { text-decoration: underline; } `;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Get login function from context

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(email, password);
    };

    return (
        <PageContainer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <GlassCard initial={{ scale: 0.8, y: 50, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.3 }}>
                <Title>LOGIN</Title>
                <Form onSubmit={handleSubmit}>
                    <InputWrapper>
                        <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required whileFocus={{ scale: 1.02 }} />
                    </InputWrapper>
                    <InputWrapper>
                        <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required whileFocus={{ scale: 1.02 }} />
                    </InputWrapper>
                    <SubmitButton type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        Enter Singularity
                    </SubmitButton>
                </Form>
                <SubText>
                    Don't have an account? <StyledLink to="/signup">Sign Up</StyledLink>
                </SubText>
            </GlassCard>
        </PageContainer>
    );
};

export default LoginPage;