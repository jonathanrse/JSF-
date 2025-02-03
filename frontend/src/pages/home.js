import React, { useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("ws://localhost:3001");

const LoginPage = () => {
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSetNickname = () => {
    if (!nickname.trim()) {
      setError("Veuillez entrer un pseudo.");
      return;
    }

    socket.emit("checkNickname", nickname, (response) => {
      if (response.success) {
        localStorage.setItem("nickname", nickname); // Sauvegarde dans localStorage
        socket.emit("setNickname", nickname);
        navigate("/chat"); // Redirection vers le chat
      } else {
        setError(response.message);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Choisissez un pseudo</h2>

      <input
        type="text"
        placeholder="Entrez un pseudo"
        className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <button
        onClick={handleSetNickname}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
      >
        Valider
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default LoginPage;
