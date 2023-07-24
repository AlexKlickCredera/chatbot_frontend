import { useRef, useState, useEffect, FC } from "react";
import { BroomRegular, SquareRegular } from "@fluentui/react-icons";
import ReactMarkdown from "react-markdown";
import styles from "./Chat.module.css";
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
    <div className={styles.chatContainer} role="main">
      <div className={styles.chatRoot}>
        <div className={styles.chatContainer}>
          <h4 className={styles.chatHeader}>Credera Chat</h4>
          <h5 className={styles.poweredBy}>powered by {model}</h5>
          <div
            className={styles.chatMessageStream}
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
          </div>

          <div className={styles.chatInput}>
            {isLoading && (
              <div
                className={styles.stopGeneratingContainer}
                role="button"
                aria-label="Stop generating"
                tabIndex={0}
                onClick={stopGenerating}
                onKeyDown={(e: { key: string }) =>
                  e.key === "Enter" || e.key === " " ? stopGenerating() : null
                }
              >
                <SquareRegular
                  className={styles.stopGeneratingIcon}
                  aria-hidden="true"
                />
                <span className={styles.stopGeneratingText} aria-hidden="true">
                  Stop generating
                </span>
              </div>
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
              <BroomRegular
                className={styles.clearChatBroom}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBotInstance;
