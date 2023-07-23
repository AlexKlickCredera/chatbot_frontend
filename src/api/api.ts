interface IMessage {
    author: string;
    content: string;
}

export async function conversationApi(input: { userInput: any; chat_history: any; }): Promise<Response> {
    const {userInput, chat_history} = input
    try {
        const apiURL = process.env.REACT_QUERY_URL;
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
        return await response.json();
    } catch(exception) {
            throw new Error(`ERROR: ${exception}`);
        }

}

