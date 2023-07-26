import { useRef, useState, useEffect, FC } from "react";
import { BroomRegular, SquareRegular } from "@fluentui/react-icons";
import ReactMarkdown from "react-markdown";
import styled from "styled-components";
import { conversationApi } from "../../api";
import { QuestionInput } from "../QuestionInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import {
  UserMessage,
  AssistantMessage,
  ErrorMessage,
  LoadingMessage,
} from "./ChatMessages";
import {
  ChatBotIteratorProps,
  IChatHistory,
  IMessage,
  IMutationResponse,
  IMutationArgs,
} from "../../types";

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ChatRoot = styled.div`
  flex: 1;
  display: flex;
  margin-top: 0px;
  gap: 20px;
  justify-content: center;
  height: calc(100vh - 100px);
  width: 100%;
`;

const ChatContainer = styled.div`
  flex: 1;
  max-width: 1028px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    108.78% 108.78% at 50.02% 19.78%,
    #ffffff 57.29%,
    #eef6fe 100%
  );
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.14), 0px 0px 2px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  overflow-y: auto;
  height: calc(100vh - 100px);
  max-height: calc(100vh - 200px);
`;

const ChatHeader = styled.h2`
  margin: 12px 0 0 0;
  font-size: 22px;
`;

const PoweredBy = styled.span`
  margin: 12px 0 0 0;
  font-size: 12px;
`;

const ChatMessageStream = styled.div`
  flex-grow: 1;
  width: 85%;
  overflow-y: auto;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  margin-top: 24px;
`;

const StopGeneratingContainer = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px 16px;
  gap: 4px;
  position: absolute;
  width: 161px;
  height: 32px;
  left: calc(50% - 161px / 2 + 25.8px);
  bottom: 116px;
  border: 1px solid #d1d1d1;
  border-radius: 16px;
`;

const StopGeneratingIcon = styled.div`
  width: 14px;
  height: 14px;
  color: #424242;
`;

const StopGeneratingText = styled.span`
  width: 103px;
  height: 20px;
  font-family: "Segoe UI";
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  color: #242424;
  flex: none;
  order: 0;
  flex-grow: 0;
`;

const ChatInput = styled.div`
  position: sticky;
  flex: 0 0 120px;
  padding-top: 12px;
  padding-bottom: 24px;
  padding-left: 24px;
  padding-right: 24px;
  width: calc(100% - 100px);
  margin-top: 8px;
`;

const ClearChatBroom = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px;
  position: absolute;
  width: 40px;
  height: 40px;
  left: 12px;
  top: 60px;
  color: #ffffff;
  border: 1px solid #d1d1d1;
  border-radius: 20px;
  z-index: 1;
  cursor: pointer;
`;

const ChatBotInstance: FC<ChatBotIteratorProps> = ({ model }) => {
  const lastQuestionRef = useRef<string>("");
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const abortFuncs = useRef([] as AbortController[]);
  const [chat_history, SetChatHistory] = useState<IChatHistory>({
    model: model,
    messages: [],
  });
  //load data with unique id. queryKey can be used to cache data for unique conversations for fast retrieval without making api calls.
  const uuid = uuidv4();
  const { data, isLoading } = useQuery(["chatHistory", uuid, model], (key) => {
    // return the existing chat history
    return chat_history;
  });

  const makeApiRequest = async (userInput: string) => {
    const tempUserInputObj: IMessage = { author: "user", content: userInput };
    let copyChatHistory: IChatHistory | undefined = chat_history;
    let tempChatHistory: IMessage[] = [];

    if (copyChatHistory?.messages) {
      tempChatHistory = [...copyChatHistory.messages, tempUserInputObj];
    }

    if (copyChatHistory) {
      copyChatHistory.messages = tempChatHistory;
      SetChatHistory(copyChatHistory);
    }

    const response: IMutationResponse = await mutation.mutateAsync({
      userInput,
      chat_history: copyChatHistory,
    } as IMutationArgs);

    const messages: IMessage[] = copyChatHistory?.messages || [];
    const coverted_data: IMessage = {
      author: "assistant",
      content: response.answer,
    };
    const tempChat: IMessage[] = [...messages, coverted_data];

    if (copyChatHistory) {
      copyChatHistory.messages = tempChat;
      SetChatHistory(copyChatHistory);
    }

    setShowLoadingMessage(false);
    console.log(copyChatHistory);
  };

  const clearChat = () => {
    lastQuestionRef.current = "";

    SetChatHistory({
      model: model,
      messages: [],
    });
  };

  const stopGenerating = () => {
    abortFuncs.current.forEach((a) => a.abort());
    setShowLoadingMessage(false);
  };

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );

  const mutation = useMutation<IMutationResponse, Error, IMutationArgs>(
    conversationApi,
    {
      onMutate: async (variables: IMutationArgs) => {
        lastQuestionRef.current = variables.userInput;
        setShowLoadingMessage(true);
      },
      onSuccess: (data, variables, context) => {
        console.log(data, variables);
        if (data.source_documents?.length) {
          data.answer +=
            '\n\nSource: "' +
            data.source_documents[0].metadata.source +
            '", page ' +
            data.source_documents[0].metadata.page;
        }
      },
      onError: (error, variables, context) => {
        const coverted_data = { author: "error", content: error };
        return coverted_data;
      },
      onSettled: (data, error, variables, context) => {},
    }
  );

  return (
    <Container role="main">
      <ChatRoot>
        <ChatContainer>
          <ChatHeader>Credera Chat</ChatHeader>
          <PoweredBy>powered by {model}</PoweredBy>
          <ChatMessageStream
            style={{ marginBottom: isLoading ? "40px" : "0px" }}
            role="log"
          >
            {chat_history &&
              chat_history.messages &&
              chat_history.messages.map((answer, index) => (
                <>
                  {answer.author === "user" ? (
                    <UserMessage
                      author={answer.author}
                      content={answer.content}
                    />
                  ) : answer.author === "assistant" ? (
                    <AssistantMessage
                      author={answer.author}
                      content={answer.content}
                    />
                  ) : answer.author === "error" ? (
                    <ErrorMessage content={answer.content} author={"error"} />
                  ) : null}
                </>
              ))}

            {showLoadingMessage && <LoadingMessage />}
            <div ref={chatMessageStreamEnd} />
          </ChatMessageStream>

          <ChatInput>
            {isLoading && (
              <StopGeneratingContainer
                role="button"
                aria-label="Stop generating"
                tabIndex={0}
                onClick={stopGenerating}
                onKeyDown={(e: { key: string }) =>
                  e.key === "Enter" || e.key === " " ? stopGenerating() : null
                }
              >
                <StopGeneratingIcon aria-hidden="true" />
                <StopGeneratingText aria-hidden="true">
                  Stop generating
                </StopGeneratingText>
              </StopGeneratingContainer>
            )}
            <div
              role="button"
              tabIndex={0}
              onClick={clearChat}
              onKeyDown={(e) =>
                e.key === "Enter" || e.key === " " ? clearChat() : null
              }
              aria-label="Clear session"
            >
              <ClearChatBroom
                style={{
                  background:
                    isLoading || chat_history.messages.length === 0
                      ? "#BDBDBD"
                      : "radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)",
                  cursor:
                    isLoading || chat_history.messages.length === 0
                      ? ""
                      : "pointer",
                }}
                aria-hidden="true"
              />
            </div>
            <QuestionInput
              clearOnSend
              placeholder="Type a new question..."
              disabled={isLoading}
              onSend={(question) => makeApiRequest(question)}
            />
          </ChatInput>
        </ChatContainer>
      </ChatRoot>
    </Container>
  );
};

export default ChatBotInstance;
