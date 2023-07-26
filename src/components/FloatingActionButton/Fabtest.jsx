import React, { useState } from'react';
import styled from'styled-components';
import { motion } from 'framer-motion';

export const FloatingButton = () => {
  const [showChat, setShowChat] = useState(false);

  const handleClick = () => {
    setShowChat(!showChat);
  };

  return (
    <Wrapper>
      <Avatar
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
      />
      {showChat && (
        <ChatWindow>
          <ChatBubble>
            <ChatText>Hello, how can I help you?</ChatText>
          </ChatBubble>
        </ChatWindow>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
`;

const Avatar = styled(motion.div)`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #fff;
  cursor: pointer;
`;

const ChatWindow = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ChatBubble = styled(motion.div)`
  position: relative;
  background-color: #fff;
  padding: 10px;
  border-radius: 10px;
  max-width: 300px;
  text-align: center;
`;

const ChatText = styled.p`
  font-size: 18px;
  margin: 0;
`;

