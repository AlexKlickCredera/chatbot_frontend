import { useRef, useState, useEffect, FC } from "react";
import { Spinner, Stack } from "@fluentui/react";
import {
  BroomRegular,
  DismissRegular,
  SquareRegular,
  ErrorCircleRegular,
} from "@fluentui/react-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import styles from "./Chat.module.css";
import NovartisLogo from "../../assets/novartis.png";
import {
  ChatMessage,
  ConversationRequest,
  conversationApi,
  Citation,
  ToolMessageContent,
  getConversations,
  getUserInfo,
} from "../../api";
import { QuestionInput } from "../../components/QuestionInput";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChatAvatar } from "../ChatAvatar/ChatAvatar";

interface IMessage {
  author: string;
  content: string;
}
interface IChatHistory {
  model: string;
  messages: IMessage[];
}
interface ChatBotIteratorProps {
  model: string;
}

const ChatBotIterator: FC<ChatBotIteratorProps> = ({ model }) => {
  const lastQuestionRef = useRef<string>("");
  const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
  const [showLoadingMessage, setShowLoadingMessage] = useState<boolean>(false);
  const [activeCitation, setActiveCitation] =
    useState<
      [
        content: string,
        id: string,
        title: string,
        filepath: string,
        url: string,
        metadata: string
      ]
    >();
  const [isCitationPanelOpen, setIsCitationPanelOpen] =
    useState<boolean>(false);
  const [answers, setAnswers] = useState<ChatMessage[]>([]);
  const abortFuncs = useRef([] as AbortController[]);
  const [showAuthMessage, setShowAuthMessage] = useState<boolean>(true);
  const [chat_history, SetChatHistory] = useState<IChatHistory>({
    model: model,
    messages: [],
  });

  const { data, isLoading } = useQuery({
    //@ts-ignore
    queryKey: ["chatHistory", "07B4866D-23DF-4A76-9974-F15A159F966D", model],
    queryFn: (key: any, conversationId: string, model: string) => {
      const incomingChat = getConversations(conversationId, model);
      return null;
    },
  });

  const getUserInfoList = async () => {
    const userInfoList = await getUserInfo();
    if (userInfoList.length === 0 && window.location.hostname !== "127.0.0.1") {
      setShowAuthMessage(true);
    } else {
      setShowAuthMessage(false);
    }
  };

  const makeApiRequest = async (userInput: React.FormEvent) => {
    const tempUserInputObj = { author: "user", content: userInput, order: 1 };
    let tempH;
    let temp: any[];
    if (chat_history) {
      tempH = chat_history;
    } else {
      tempH = { messages: [] };
    }
    if (chat_history?.messages) {
      //@ts-ignore
      temp = [...chat_history.messages, tempUserInputObj];
    } else {
      temp = [];
    }
    // @ts-ignore
    tempH.messages = temp;
    console.log(tempH);
    // @ts-ignore
    SetChatHistory(tempH);
    //@ts-ignore
    const response = await mutation.mutateAsync({
      userInput,
      chat_history: tempH,
    });
    //@ts-ignore
    const messages = chat_history.messages;
    //@ts-ignore
    const coverted_data = { author: "assistant", content: response.answer };
    //@ts-ignore
    const tempChat = [...messages, coverted_data];
    //@ts-ignore
    temp = chat_history;
    //@ts-ignore
    temp.messages = tempChat;
    setShowLoadingMessage(false);
    console.log(temp);
    //@ts-ignore
    SetChatHistory(temp);
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
    // setIsLoading(false);
  };

  useEffect(() => {
    getUserInfoList();
  }, []);

  useEffect(
    () => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }),
    [showLoadingMessage]
  );

  const onShowCitation = (citation: Citation) => {
    setActiveCitation([
      citation.content,
      citation.id,
      citation.title ?? "",
      citation.filepath ?? "",
      "",
      "",
    ]);
    setIsCitationPanelOpen(true);
  };

  const parseCitationFromMessage = (message: ChatMessage) => {
    if (message.role === "tool") {
      try {
        const toolMessage = JSON.parse(message.content) as ToolMessageContent;
        return toolMessage.citations;
      } catch {
        return [];
      }
    }
    return [];
  };

  const mutation = useMutation({
    //@ts-ignore
    mutationFn: conversationApi,
    //@ts-ignore
    onMutate: async (question: string) => {
      lastQuestionRef.current = question;
      setShowLoadingMessage(true);
    },
    onSuccess: (data: any, variables: any, context: any) => {
      console.log(data, variables);
      if (data.source_documents?.length) {
        data.answer +=
          '\n\nSource: "' +
          data.source_documents[0].metadata.source +
          '", page ' +
          data.source_documents[0].metadata.page;
      }
    },
    onError: (error: any, variables: any, context: any) => {
      const coverted_data = { author: "error", content: error };
    },
    onSettled: (data: any, error: any, variables: any, context: any) => {},
  });
  return (
    <div className={styles.chatContainer} role="main">
      <Stack horizontal className={styles.chatRoot}>
        <div className={styles.chatContainer}>
          <h4 className={styles.chatHeader}>Novartis AI Chatbot POC</h4>
          <h5 className={styles.poweredBy}>Selected Model: {model}</h5>
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
                    <div className={styles.chatMessageUser} tabIndex={0}>
                      <div className={styles.chatMessageUserMessage}>
                        {answer.content}
                      </div>
                      <ChatAvatar message_sender={answer.author} />
                    </div>
                  ) : answer.author === "assistant" ? (
                    <div className={styles.chatMessageGpt} tabIndex={0}>
                      <ChatAvatar message_sender={answer.author} />
                      <div className={styles.chatMessageResponse}>
                        {answer.content}
                      </div>
                    </div>
                  ) : answer.author === "error" ? (
                    <div className={styles.chatMessageError}>
                      <Stack
                        horizontal
                        className={styles.chatMessageErrorContent}
                      >
                        <ErrorCircleRegular
                          className={styles.errorIcon}
                          style={{ color: "rgba(182, 52, 67, 1)" }}
                        />

                        <span>Error</span>
                      </Stack>

                      <span className={styles.chatMessageErrorContent}>
                        {answer.content}
                      </span>
                    </div>
                  ) : null}
                </>
              ))}

            {showLoadingMessage && (
              <div className={styles.chatMessageGpt}>
                <Spinner
                  label="Loading..."
                  ariaLive="assertive"
                  labelPosition="right"
                />
              </div>
            )}
            <div ref={chatMessageStreamEnd} />
          </div>

          <Stack horizontal className={styles.chatInput}>
            {isLoading && (
              <Stack
                horizontal
                className={styles.stopGeneratingContainer}
                role="button"
                aria-label="Stop generating"
                tabIndex={0}
                onClick={stopGenerating}
                onKeyDown={(e) =>
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
              </Stack>
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
                    isLoading || answers.length === 0
                      ? "#BDBDBD"
                      : "radial-gradient(109.81% 107.82% at 100.1% 90.19%, #0F6CBD 33.63%, #2D87C3 70.31%, #8DDDD8 100%)",
                  cursor: isLoading || answers.length === 0 ? "" : "pointer",
                }}
                aria-hidden="true"
              />
            </div>
            <QuestionInput
              clearOnSend
              placeholder="Type a new question..."
              disabled={isLoading}
              //@ts-ignore
              onSend={(question) => makeApiRequest(question)}
            />
          </Stack>
        </div>
        {answers.length > 0 && isCitationPanelOpen && activeCitation && (
          <Stack.Item
            className={styles.citationPanel}
            tabIndex={0}
            role="tabpanel"
            aria-label="Citations Panel"
          >
            <Stack
              horizontal
              className={styles.citationPanelHeaderContainer}
              horizontalAlign="space-between"
              verticalAlign="center"
            >
              <span className={styles.citationPanelHeader}>Citations</span>
              <DismissRegular
                className={styles.citationPanelDismiss}
                onClick={() => setIsCitationPanelOpen(false)}
              />
            </Stack>
            <h5 className={styles.citationPanelTitle} tabIndex={0}>
              {activeCitation[2]}
            </h5>
            <div tabIndex={0}>
              <ReactMarkdown
                linkTarget="_blank"
                className={styles.citationPanelContent}
                children={activeCitation[0]}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              />
            </div>
          </Stack.Item>
        )}
      </Stack>
    </div>
  );
};

export default ChatBotIterator;
