import { useRef, useState, useEffect } from "react";
import styles from "./MultiChat.module.css";
import ChatBotIterator from "../../../components/Chatbot/ChatbotInstance"
import { useParams } from "react-router-dom";

const MultiChat = () => {
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [visibility, setVisibility] = useState(true);

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );
  const { models } = useParams();
  const modelArray = models?.split("&");
  return (
    <div className={styles.container} role="main">
      <div className={styles.containerBtn} role="main">
        {/* <FloatingActionButton
          visibility={visibility}
          disabled={false}
        /> */}
      </div>
      {visibility ? (
        <div className={styles.chatbotStack}>
          {modelArray && modelArray.map((model) => <ChatBotIterator model={model} />)}
        </div>
      ) : null}
    </div>
  );
};

export default MultiChat;
