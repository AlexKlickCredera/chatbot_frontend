import { IMessage, IMutationResponse } from "../types";

export async function conversationApi(input: { userInput: any; chat_history: any; }): Promise<IMutationResponse> {
    const {userInput, chat_history} = input
    try {
        const apiURL = process.env.REACT_QUERY_URL || 'http://localhost:5000/conversation';
        let destructed_chat
        if (chat_history && chat_history.messages){
            destructed_chat = chat_history.messages.map((message:IMessage)=>{
                return message.content
            })
        } else {
            destructed_chat = []
        }
        destructed_chat = destructed_chat.slice(0,-1)
        const body = JSON.stringify({
            model: chat_history.model,
            question: userInput,
            chat_history: destructed_chat,
            azure_cog_search_index: 'azure_cog_search_index'
        })
        const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: body
            });
        const data: IMutationResponse = await response.json();

        return data;
    } catch(exception) {
            throw new Error(`ERROR: ${exception}`);
        }

}

