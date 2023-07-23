import { useRef, useState, useEffect, SetStateAction } from "react";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import styles from "./Chat.module.css";
import { getUserInfo } from "../../api";
import ChatBotIterator from "../../components/ChatBotIterator/ChatBotIterator";
import { Stack } from "@fluentui/react";
import Chat from "./MultiChat";
import { useParams } from "react-router-dom";

const SingleChat = () => {
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [isCitationPanelOpen, setIsCitationPanelOpen] =
    useState<boolean>(false);
  const [showAuthMessage, setShowAuthMessage] = useState<boolean>(true);
  const [visibility, setVisibility] = useState(false);
  // const [model, setModel] = useState<string | undefined>(undefined);
  const getUserInfoList = async () => {
    const userInfoList = await getUserInfo();
    if (userInfoList.length === 0 && window.location.hostname !== "127.0.0.1") {
      setShowAuthMessage(true);
    } else {
      setShowAuthMessage(false);
    }
  };
  const selectModel = (selectedModel: SetStateAction<string | undefined>) => {
    setVisibility(!visibility);
    // setModel(selectedModel)
  };
  useEffect(() => {
    getUserInfoList();
  }, []);
  const { model } = useParams();
  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );
  
  return (
    <div className={styles.container} role="main">
      <Stack horizontal className={styles.singleChatStack}>
        <ChatBotIterator model={model ? model : ''} />
      </Stack>
    </div>
  );
};

export default SingleChat;
