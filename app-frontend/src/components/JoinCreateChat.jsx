import React, { useState } from "react";
import chatIcon from "../assets/chat.png";
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
  const [detail, setDetail] = useState({ roomId: "", userName: "" });
  const { setRoomId, setCurrentUser, setConnected } = useChatContext();
  const navigate = useNavigate();

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!detail.roomId.trim() || !detail.userName.trim()) {
      toast.error("Please fill in both fields.");
      return false;
    }
    return true;
  };

  const joinChat = async () => {
    if (!validateForm()) return;

    try {
      const room = await joinChatApi(detail.roomId);
      toast.success("Joined room!");
      setCurrentUser(detail.userName);
      setRoomId(room.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error?.status === 400) {
        toast.error(error.response.data || "Room not found.");
      } else {
        toast.error("Error joining room.");
      }
    }
  };

  const createRoom = async () => {
    if (!validateForm()) return;

    try {
      const response = await createRoomApi(detail.roomId);
      toast.success("Room created!");
      setCurrentUser(detail.userName);
      setRoomId(response.roomId);
      setConnected(true);
      navigate("/chat");
    } catch (error) {
      if (error?.status === 400) {
        toast.error("Room already exists!");
      } else {
        toast.error("Error creating room.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 md:p-10 border border-gray-800">
        <div className="flex justify-center mb-6">
          <img src={chatIcon} alt="Chat Icon" className="w-20" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 text-gray-200">
          Join or Create a Room
        </h2>

        <div className="mb-5">
          <label htmlFor="userName" className="block text-sm font-medium mb-2 text-gray-300">
            Your Name
          </label>
          <input
            type="text"
            name="userName"
            id="userName"
            value={detail.userName}
            onChange={handleFormInputChange}
            placeholder="e.g. Nano"
            className="w-full px-4 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="roomId" className="block text-sm font-medium mb-2 text-gray-300">
            Room ID
          </label>
          <input
            type="text"
            name="roomId"
            id="roomId"
            value={detail.roomId}
            onChange={handleFormInputChange}
            placeholder="e.g. dev-chat-101"
            className="w-full px-4 py-3 rounded-full bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={joinChat}
            className="w-1/2 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 transition font-semibold text-white"
          >
            Join Room
          </button>

          <button
            onClick={createRoom}
            className="w-1/2 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 transition font-semibold text-white"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinCreateChat;
