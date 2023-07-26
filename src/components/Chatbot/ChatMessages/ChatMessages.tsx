import styled, { keyframes } from 'styled-components';
import { FC, HTMLAttributes } from "react";

interface IMessageProps {
  author: string;
  content: string;
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: ${spin} 2s linear infinite;
`;

const MessageDiv = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
`;

interface MessageContentProps extends HTMLAttributes<HTMLDivElement> {
  user?: boolean;
}

const MessageContent = styled.div<MessageContentProps>`
  padding: 20px;
  background: ${props => props.user ? '#EDF5FD' : '#ffffff'};
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);
  font-family: "Segoe UI";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #242424;
  flex: none;
  order: 0;
  flex-grow: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 80%;
`;

const ErrorDiv = styled.div`
  padding: 12px;
  border-radius: 8px;
  box-shadow: rgba(182, 52, 67, 1) 1px 1px 2px, rgba(182, 52, 67, 1) 0px 0px 1px;
  color: #242424;
  flex: none;
  order: 0;
  flex-grow: 0;
  max-width: 800px;
`;

const ErrorMessageContent = styled.span`
  font-family: "Segoe UI";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  white-space: pre-wrap;
  word-wrap: break-word;
  gap: 12px;
  align-items: center;
`;

export const UserMessage: FC<IMessageProps> = ({ author, content }) => (
  <MessageDiv tabIndex={0}>
    <MessageContent user>{content}</MessageContent>
    {/* <ChatAvatar message_sender={author} /> */}
  </MessageDiv>
);

export const AssistantMessage: FC<IMessageProps> = ({ author, content }) => (
  <MessageDiv tabIndex={0}>
    <MessageContent>{content}</MessageContent>
    {/* <ChatAvatar message_sender={author} /> */}
  </MessageDiv>
);

export const ErrorMessage: FC<IMessageProps> = ({ content }) => (
  <ErrorDiv>
    <ErrorMessageContent>
      <div
        style={{ color: "rgba(182, 52, 67, 1)" }}
      />
      <span>Error</span>
    </ErrorMessageContent>
    <ErrorMessageContent>{content}</ErrorMessageContent>
  </ErrorDiv>
);

export const LoadingMessage: FC = () => (
  <MessageDiv>
    <Spinner></Spinner>
  </MessageDiv>
);
