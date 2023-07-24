export interface IMessage {
    author: string;
    content: string;
  }
  export interface IChatHistory {
    model: string;
    messages: IMessage[];
  }
  export interface ChatBotIteratorProps {
    model: string;
  }
  
  export interface IMutationArgs {
    userInput: string;
    chat_history: IChatHistory;
  }
  
  export interface IMutationResponse {
    source_documents: any;
    answer: string;
  }