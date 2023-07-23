import { useRef, useState, useEffect } from "react";
import FloatingActionButton from "../../components/FloatingActionButton/FloatingActionButton";
import styles from "./Chat.module.css";
import { getUserInfo } from "../../api";
import ChatBotIterator from "../../components/ChatBotIterator/ChatBotIterator";
import { Stack } from "@fluentui/react";
import { useParams } from "react-router-dom";

const MultiChat = () => {
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [isCitationPanelOpen, setIsCitationPanelOpen] =
    useState<boolean>(false);
  const [showAuthMessage, setShowAuthMessage] = useState<boolean>(true);
  const [visibility, setVisibility] = useState(true);
  const getUserInfoList = async () => {
    const userInfoList = await getUserInfo();
    if (userInfoList.length === 0 && window.location.hostname !== "127.0.0.1") {
      setShowAuthMessage(true);
    } else {
      setShowAuthMessage(false);
    }
  };

  useEffect(() => {
    getUserInfoList();
  }, []);

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );
  const { models } = useParams();
  //@ts-ignore
  const modelArray = models.split("&");
  return (
    <div className={styles.container} role="main">
      <div className={styles.containerBtn} role="main">
        <FloatingActionButton
          selectModel={function (): void {
            setVisibility(!visibility);
          }}
          visibility={visibility}
          disabled={false}
        />
      </div>
      {visibility ? (
        <Stack horizontal gap={20}>
          {modelArray && modelArray.map((model) => <ChatBotIterator model={model} />)}

        </Stack>
      ) : null}
    </div>
  );
};

export default MultiChat;
