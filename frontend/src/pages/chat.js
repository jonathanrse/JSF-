import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("ws://localhost:3001");

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState("general");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("error", (error) => {
      alert(error);
    });

    return () => {
      socket.off("message");
      socket.off("error");
    };
  }, []);

  const handleSendMessage = () => {
    socket.emit("message", { channel, message });
    setMessage("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Chat WebSocket</h2>

      {/* Input pour entrer un message */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Votre message ou commande"
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSendMessage}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
        >
          Envoyer
        </button>
      </div>

      {/* Affichage des messages */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">Messages</h3>
        <ul className="space-y-2">
          {messages.map((msg, index) => (
            <li
              key={index}
              className="p-2 border-b border-gray-200 text-gray-700"
            >
              <strong className="text-blue-500">{msg.user} :</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatPage;
