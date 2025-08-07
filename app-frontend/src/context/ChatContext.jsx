// src/context/ChatContext.jsx

import { createContext, useContext, useState } from "react";

// Create context
export const ChatContext = createContext();

// Context provider
export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        roomId,
        currentUser,
        connected,
        setRoomId,
        setCurrentUser,
        setConnected,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook
const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};

export default useChatContext;
