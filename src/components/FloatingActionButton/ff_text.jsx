import React, { useState } from 'react';
        import styled, { keyframes } from 'styled-components';
        import { motion } from 'framer-motion';

        const FloatingAvatar = () => {
            const [isOpen, setIsOpen] = useState(false);
            const toggleWindow = () => {
                setIsOpen(!isOpen);
            }

            const avatarAnimation = keyframes`
                0% {
                    transform: translateY(-100%);
                }
                100% {
                    transform: translateY(0%);
                }
            `;

            return (
                <>
                    {isOpen && (
                        <Window
                            variants={windowVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                        >
                            <WindowContent>
                                <WindowHeader>
                                    <h1>Chat Window</h1>
                                </WindowHeader>
                                <WindowBody>
                                    <p>This is a chat window.</p>
                                </WindowBody>
                            </WindowContent>
                        </Window>
                    )}
                    <Button onClick={toggleWindow}>
                        <Avatar animate={isOpen ? 'open' : 'closed'}>
                            <span>A</span>
                            <span>V</span>
                            <span>A</span>
                            <span>T</span>
                            <span>R</span>
                            <span>O</span>
                            <span>F</span>
                            <span>T</span>
                        </Avatar>
                    </Button>
                </>
            );
        };

        const windowVariants = {
            open: {
                y: 0,
                opacity: 1,
                transition: {
                    duration: 0.3,
                    ease: [0.6, -0.05, 0.9, 0.9],
                },
            },
            closed: {
                y: '100%',
                opacity: 0,
                transition: {
                    duration: 0.3,
                    ease: [0.6, -0.05, 0.9, 0.9],
                },
            },
        };

        const Button = styled.button`
            position: absolute;
            top: 100px;
            right: 100px;
            background-color: #fff;
            padding: 8px;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
            cursor: pointer;
        `;

        const Avatar = styled(motion.div)`
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #fff;
            padding: 8px;
            border-radius: 50%;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
        `;

        const Window = styled(motion.div)`
            position: fixed;
            bottom: 0;
            right: 0;
            width: 300px;
            background-color: #fff;
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 0 8px rgba(0,0,0,0.2);
        `;

        const WindowContent = styled.div`
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
        `;

        const WindowHeader = styled.div`
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
        `;

        const WindowBody = styled.div`
            flex: 1;
            padding: 8px;
        `;

        export default FloatingAvatar;