import "./App.css";
import Chat from "./pages/chat/MultiChat/MultiChat";
import SingleChat from "./pages/chat/SingleChat/SingleChat";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Fab from "./components/FloatingActionButton/FloatingActionButton";
// import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
// import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FloatingActionButton from "./components/FloatingActionButton/FloatingActionButton";

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
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SingleChat />} />
          <Route path="/many_chats/:models" element={<Chat />} />
          <Route path="/chat/:model" element={<SingleChat />} />
        </Routes>
      </BrowserRouter>
      <div style={{position:'absolute', left:'0px', top:'100px'}}>
        <FloatingActionButton />
      </div>

    </QueryClientProvider>
  );
}

export default App;
