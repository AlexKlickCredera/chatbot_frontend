import "./App.css";
import Chat from "./pages/chat/MultiChat/MultiChat";
import SingleChat from "./pages/chat/SingleChat/SingleChat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FloatingActionButton from "./components/FloatingActionButton/FloatingActionButton";
import FloatingAvatar from "./components/FloatingActionButton/ff_text";
import { FloatingButton } from "./components/FloatingActionButton/Fabtest";
import Sample from "./components/Chatbot/WebViewer";

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<SingleChat />} />
          <Route path="/many_chats/:models" element={<Chat />} />
          <Route path="/chat/:model" element={<SingleChat />} />
        </Routes>
      </BrowserRouter> */}
      <div style={{position:'absolute', left:'0px', top:'100px'}}>
        <FloatingActionButton />
        {/* <Sample /> */}
        {/* <FloatingButton /> */}
        {/* <FloatingButton /> */}
      </div>

    </QueryClientProvider>
  );
}

export default App;
