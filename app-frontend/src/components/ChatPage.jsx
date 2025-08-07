import React, { useEffect, useRef, useState } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import toast from "react-hot-toast";
import { baseURL } from "../config/AxiosHelper";
import { getMessagess } from "../services/RoomService";
import { timeAgo } from "../config/helper";

const ChatPage = () => {
  const {
    roomId,
    currentUser,
    connected,
    setConnected,
    setRoomId,
    setCurrentUser,
  } = useChatContext();

  const navigate = useNavigate();
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    if (!connected || !roomId || !currentUser) {
      navigate("/");
    }
  }, [connected, roomId, currentUser]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessagess(roomId);
        setMessages(data);
      } catch (error) {
        toast.error("Failed to load messages.");
      }
    };

    if (connected) loadMessages();
  }, [connected, roomId]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scroll({
        top: chatBoxRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!connected || stompClient) return;

    const sock = new SockJS(`${baseURL}/chat`);
    const client = Stomp.over(sock);

    client.connect({}, () => {
      setStompClient(client);
      toast.success("Connected to room");

      client.subscribe(`/topic/room/${roomId}`, (message) => {
        const newMessage = JSON.parse(message.body);

        setMessages((prev) => {
          const exists = prev.some(
            (m) =>
              m.timeStamp === newMessage.timeStamp &&
              m.sender === newMessage.sender &&
              m.content === newMessage.content
          );
          return exists ? prev : [...prev, newMessage];
        });
      });
    });

    return () => {
      if (client.connected) {
        client.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      }
    };
  }, [connected, roomId, stompClient]);

  const sendMessage = () => {
    if (!input.trim() || !stompClient || !connected) return;

    const message = {
      sender: currentUser,
      content: input,
      roomId,
    };

    stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
    setInput("");
  };

  const handleLogout = () => {
    if (stompClient?.connected) {
      stompClient.disconnect(() => console.log("Disconnected manually."));
    }
    setConnected(false);
    setRoomId("");
    setCurrentUser("");
    navigate("/");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      {/* 🔷 HEADER */}
      <header className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700 px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-md gap-2">
        <div>
          <h1 className="text-lg font-semibold">
            Room: <span className="text-green-400 break-words">{roomId}</span>
          </h1>
          <p className="text-sm text-gray-400 break-words">
            User: {currentUser}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm font-medium"
        >
          Leave Room
        </button>
      </header>

      {/* 🔷 CHAT BOX */}
      <main
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-5xl mx-auto"
      >
        {messages.map((message, index) => {
          const isOwn = message.sender === currentUser;
          return (
            <div
              key={`${message.sender}-${message.timeStamp}-${index}`}
              className={`flex mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex items-start max-w-[90%] sm:max-w-xl md:max-w-2xl ${
                  isOwn ? "flex-row-reverse text-right" : ""
                }`}
              >
                <img
                  src={`https://avatar.iran.liara.run/public/${
                    message.sender.length * 7
                  }`}
                  alt="avatar"
                  className="h-10 w-10 rounded-full mx-2"
                />
                <div
                  className={`rounded-lg px-4 py-2 shadow-md break-words ${
                    isOwn ? "bg-green-600" : "bg-gray-700"
                  }`}
                >
                  <p className="font-semibold text-sm">{message.sender}</p>
                  <p className="text-base">{message.content}</p>
                  <p className="text-xs text-gray-300 mt-1">
                    {timeAgo(message.timeStamp)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* 🔷 INPUT AREA */}
      <footer className="sticky bottom-0 w-full bg-gray-800 py-4 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-2 items-center">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            type="text"
            placeholder="Type your message..."
            className="flex-1 w-full bg-gray-700 text-white px-5 py-3 rounded-full focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              className="bg-purple-600 hover:bg-purple-700 p-3 rounded-full"
              title="Attach File"
            >
              <MdAttachFile size={20} />
            </button>
            <button
              onClick={sendMessage}
              className="bg-green-600 hover:bg-green-700 p-3 rounded-full"
              title="Send Message"
            >
              <MdSend size={20} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
