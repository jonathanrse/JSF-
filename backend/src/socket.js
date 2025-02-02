const { addChannel, deleteChannel, listChannels, getMessages, addMessage, saveUser, listUsers } = require('./storage');



const ioHandler = (io) => {

    io.on('connection', (socket) => {
        console.log(`🟢 Utilisateur connecté : ${socket.id}`);

        socket.onAny((event, ...args) => {
            console.log(`📩 Événement reçu: ${event}`, args);
        });

        // Définir un pseudo
        socket.on('setNickname', (...args) => {
            console.log(`📩 setNickname reçu avec valeur:`, args);
        
            // Vérifie si Postman envoie un tableau
            const nickname = Array.isArray(args[0]) ? args[0][1] : args[0];
        
            if (!nickname || typeof nickname !== "string" || nickname.trim() === "") {
                console.log("❌ Erreur: Pseudo invalide");
                socket.emit('error', "⚠️ Vous devez fournir un pseudo valide.");
                return;
            }
        
            // Sauvegarde du pseudo
            socket.nickname = nickname;
            saveUser(nickname, socket.id);
        
            console.log(`✅ ${nickname} a été enregistré avec l'ID: ${socket.id}`);
        
            // Envoyer la confirmation
            socket.emit('success', `Votre pseudo est maintenant : ${nickname}`);
        });
        
        
        
        

        // Créer un channel
        socket.on('createChannel', (channel) => {
            if (addChannel(channel)) {
                console.log(`📢 Channel créé: #${channel}`);
                io.emit('channelCreated', channel);
            } else {
                socket.emit('error', `⚠️ Le channel #${channel} existe déjà.`);
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
        socket.on('listChannels', () => {
            const channels = listChannels();
            socket.emit('channelList', channels);
        });

        // Lister les utilisateurs d'un channel
        socket.on('listUsers', (channel) => {
            const users = listUsers(channel);
            socket.emit('userList', users);
        });

        // Rejoindre un channel
        socket.on('joinChannel', (channel) => {
            if (!socket.nickname) {
                socket.emit('error', "⚠️ Vous devez définir un pseudo avec /nick avant de rejoindre un channel.");
                return;
            }

            socket.join(channel);
            console.log(`📢 ${socket.nickname} a rejoint #${channel}`);
            io.to(channel).emit('message', { user: 'Server', message: `${socket.nickname} a rejoint #${channel}` });

            // Charger l'historique des messages du channel
            const messages = getMessages(channel);
            socket.emit('loadMessages', messages);
        });

        // Quitter un channel
        socket.on('quitChannel', (channel) => {
            socket.leave(channel);
            console.log(`🚪 ${socket.nickname} a quitté #${channel}`);
            io.to(channel).emit('message', { user: 'Server', message: `${socket.nickname} a quitté #${channel}` });
        });

        // Envoyer un message
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
