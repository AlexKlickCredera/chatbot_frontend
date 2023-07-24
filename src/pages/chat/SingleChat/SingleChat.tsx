import { useRef, useState, useEffect, SetStateAction } from "react";
import FloatingActionButton from "../../../components/FloatingActionButton/FloatingActionButton";
import styles from "./SingleChat.module.css";
import ChatbotInstance from "../../../components/Chatbot/ChatbotInstance";
import { useParams } from "react-router-dom";

const SingleChat = () => {
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [visibility, setVisibility] = useState(false);
  const selectModel = (selectedModel: SetStateAction<string | undefined>) => {
    setVisibility(!visibility);
  };
  const { model } = useParams();
  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );

  return (
    <div className={`${styles.container} ${styles.singleChatStack}`} role="main">
        <ChatbotInstance model={model ? model : ""} />
    </div>
  );
};


export default SingleChat;
