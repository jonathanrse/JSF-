require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const ioHandler = require('./socket'); // Import du gestionnaire WebSocket

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: "*" }  // Autoriser les connexions du frontend
});

// Initialiser Socket.IO
console.log("🔌 Initialisation de Socket.IO...");
ioHandler(io);
console.log("✅ Socket.IO chargé avec succès !");


const PORT = 3001;

server.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
