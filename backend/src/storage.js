const fs = require('fs');
const path = require('path');

const channelsFile = path.join(__dirname, '../data/channels.json');
const messagesDir = path.join(__dirname, '../data/messages');
const usersFile = path.join(__dirname, '../data/users.json');



// Lire un fichier JSON
const readJsonFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) return {};
        const data = fs.readFileSync(filePath, 'utf8');
        return data ? JSON.parse(data) : {}; // Vérifie si le fichier est vide
    } catch (error) {
        console.error(`❌ Erreur de lecture du fichier ${filePath}:`, error.message);
        return {}; // Retourne un objet vide en cas d'erreur
    }
};


// Écrire dans un fichier JSON
const writeJsonFile = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Obtenir tous les utilisateurs
const getUsers = () => {
    return readJsonFile(usersFile);
};

// Sauvegarde d'un utilisateur
const saveUser = (nickname, socketId) => {
    console.log(`💾 Tentative de sauvegarde de l'utilisateur: ${nickname} (ID: ${socketId})`);

    let users = readJsonFile(usersFile);
    console.log("📂 Contenu actuel de users.json:", users);

    if (typeof users !== "object" || users === null) {
        console.error("❌ Erreur : users.json est corrompu ou non valide.");
        users = {}; // On réinitialise users.json
    }

    // Vérifier si l'utilisateur existe déjà
    if (users[nickname]) {
        console.log(`⚠️ L'utilisateur ${nickname} existe déjà.`);
    } else {
        users[nickname] = { id: socketId };
    }

    console.log("📝 Nouvel état de users.json avant écriture:", users);

    try {
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
        console.log(`✅ Utilisateur ${nickname} sauvegardé avec succès !`);
    } catch (error) {
        console.error("❌ Erreur lors de l'écriture dans users.json :", error.message);
    }

    // Vérification immédiate après l'écriture
    let verifyData = readJsonFile(usersFile);
    console.log("🔍 Vérification après écriture:", verifyData);
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

module.exports = { addChannel, deleteChannel, listChannels, getMessages, addMessage, saveUser, getUsers };
