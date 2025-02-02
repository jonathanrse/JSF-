const fs = require('fs');
const path = require('path');

const channelsFile = path.join(__dirname, '../data/channels.json');
const messagesDir = path.join(__dirname, '../data/messages');
const usersFile = path.join(__dirname, '../data/users.json');



// Lire un fichier JSON
const readJsonFile = (filePath) => {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Écrire dans un fichier JSON
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Sauvegarde d'un utilisateur
const saveUser = (nickname, socketId) => {
    console.log(`💾 Sauvegarde de l'utilisateur: ${nickname} (ID: ${socketId})`);

    let users = readJsonFile(usersFile);
    users[nickname] = { id: socketId };
    writeJsonFile(usersFile, users);

    console.log(`✅ Utilisateur sauvegardé: ${nickname}`);
};

// Ajouter un channel
const addChannel = (channelName) => {
    let channels = readJsonFile(channelsFile);
    if (!channels[channelName]) {
        channels[channelName] = { users: [] };
        writeJsonFile(channelsFile, channels);
        return true;
    }
    return false;
};

// Supprimer un channel
const deleteChannel = (channelName) => {
    let channels = readJsonFile(channelsFile);
    if (channels[channelName]) {
        delete channels[channelName];
        writeJsonFile(channelsFile, channels);
        return true;
    }
    return false;
};

// Lister les channels
const listChannels = () => {
    return Object.keys(readJsonFile(channelsFile));
};

// Vérifier que le dossier messages existe
if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
}

// Lire les messages d'un channel
const getMessages = (channel) => {
    const filePath = path.join(messagesDir, `${channel}.json`);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Ajouter un message à un channel
const addMessage = (channel, user, message) => {
    const filePath = path.join(messagesDir, `${channel}.json`);
    let messages = getMessages(channel);
    
    const newMessage = {
        timestamp: new Date().toISOString(),
        user,
        message
    };

    messages.push(newMessage);
    fs.writeFileSync(filePath, JSON.stringify(messages, null, 2), 'utf8');
    return newMessage;
};

module.exports = { addChannel, deleteChannel, listChannels, getMessages, addMessage, saveUser };
