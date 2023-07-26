import { useRef, useState, useEffect } from "react";
import ChatbotInstance from "../../../components/Chatbot/ChatbotInstance";
import { useParams } from "react-router-dom";
import styled from 'styled-components';

const Container = styled.div`
    top: 200px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: absolute;
    right: 5vw;
    width: 90vw;
    height: 100%;
    max-height: calc(100vh - 200px);
    justify-content: center;
`;

const SingleChat = () => {
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const { model } = useParams();
  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );

  return (
    <Container role="main">
        <ChatbotInstance model={model ? model : ""} />
    </Container>
  );
};

export default SingleChat;
