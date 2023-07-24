import styles from "./ChatMessages.module.css";
import { FC } from "react";

interface IMessageProps {
  author: string;
  content: string;
}

export const UserMessage: FC<IMessageProps> = ({ author, content }) => (
  <div className={styles.chatMessageUser} tabIndex={0}>
    <div className={styles.chatMessageUserMessage}>{content}</div>
    {/* <ChatAvatar message_sender={author} /> */}
  </div>
);

export const AssistantMessage: FC<IMessageProps> = ({ author, content }) => (
  <div className={styles.chatMessageGpt} tabIndex={0}>
    {/* <ChatAvatar message_sender={author} /> */}
    <div className={styles.chatMessageResponse}>{content}</div>
  </div>
);

export const ErrorMessage: FC<IMessageProps> = ({ content }) => (
  <div className={styles.chatMessageError}>
    <div className={styles.chatMessageErrorContent}>
      <div
        className={styles.errorIcon}
        style={{ color: "rgba(182, 52, 67, 1)" }}
      />
      <span>Error</span>
    </div>
    <span className={styles.chatMessageErrorContent}>{content}</span>
  </div>
);

export const LoadingMessage: FC = () => (
  <div className={styles.chatMessageGpt}>
    <div className={styles.spinner}></div>
  </div>
);

