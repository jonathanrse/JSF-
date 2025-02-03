const { addChannel, deleteChannel, listChannels, getMessages, addMessage, saveUser, listUsers, getUsers } = require('./storage');

const ioHandler = (io) => {
    io.on('connection', (socket) => {
        console.log(`🟢 Utilisateur connecté : ${socket.id}`);

        // Vérifier si un pseudo est déjà pris
        socket.on('checkNickname', (nickname, callback) => {
            const users = getUsers();
            if (users[nickname]) {
                callback({ success: false, message: "Pseudo déjà pris" });
            } else {
                callback({ success: true });
            }
        });

        // Définir un pseudo
        socket.on('setNickname', (nickname) => {
            console.log(`📩 setNickname reçu: ${nickname}`);
            
            socket.nickname = nickname;
            saveUser(nickname, socket.id);
            
            console.log(`✅ ${nickname} a défini son pseudo`);
            socket.emit('success', `Votre pseudo est maintenant : ${nickname}`);
        });
        


        // Créer un channel
        socket.on("createChannel", (channel) => {
            if (addChannel(channel)) {
                console.log(`📢 Channel créé: #${channel}`);
                io.emit("message", { user: "Server", message: `📢 Le channel #${channel} a été créé.` });
            } else {
                socket.emit("message", { user: "Server", message: `⚠️ Le channel #${channel} existe déjà.` });
            }
        });
        

        // Supprimer un channel
        socket.on('deleteChannel', (channel) => {
            if (deleteChannel(channel)) {
                console.log(`❌ Channel supprimé: #${channel}`);
                io.emit('channelDeleted', channel);
            } else {
                socket.emit('error', `⚠️ Le channel #${channel} n'existe pas.`);
            }
        });

        // Lister les channels
        socket.on("listChannels", (callback) => {
            const channels = listChannels();
            callback(channels);
        });
        

        // Lister les utilisateurs d'un channel
        socket.on('listUsers', (channel) => {
            const users = listUsers(channel);
            socket.emit('userList', users);
        });

        // Rejoindre un channel
        socket.on('joinChannel', (channel) => {
            socket.join(channel);
            console.log(`📢 ${socket.nickname} a rejoint #${channel}`);
            io.to(channel).emit('message', { user: 'Server', message: `${socket.nickname} a rejoint #${channel}` });
        });
        

        // Quitter un channel
        socket.on('quitChannel', (channel) => {
            socket.leave(channel);
            console.log(`🚪 ${socket.nickname} a quitté #${channel}`);
            io.to(channel).emit('message', { user: 'Server', message: `${socket.nickname} a quitté #${channel}` });
        });

        // Envoyer un message ou exécuter une commande
        socket.on('message', ({ channel, message }) => {
            if (!socket.nickname) {
                socket.emit('error', "⚠️ Vous devez définir un pseudo avec /nick.");
                return;
            }

            console.log(`💬 ${socket.nickname} dans #${channel}: ${message}`);
            const newMessage = addMessage(channel, socket.nickname, message);
            io.to(channel).emit('message', newMessage);
        });


        // Gérer la déconnexion
        socket.on('disconnect', () => {
            console.log(`🔴 ${socket.nickname || 'Un utilisateur'} s'est déconnecté`);
        });
    });
};

module.exports = ioHandler;
