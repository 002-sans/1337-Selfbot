const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "crealimit",
    description: "Permet de paramétrer la limite de création de compte",
    dir: "antiraid",
    usage: "<durée>",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const time = parseTime(args[0])
        if (isNaN(time)) return message.channel.send('***Veuillez me donner un temps valide (`0s = aucune secur`)***');

        client.db.antiraid.crealimit = time;
        client.save();

        message.edit('***La limite de création de compte a été modifié***')
    }
};

function parseTime(timeString) {
    const match = timeString.match(/(\d+)([smhdwy])/);
    if (!match) return null;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'w': return value * 7 * 24 * 60 * 60 * 1000;
        case 'y': return value * 365 * 24 * 60 * 60 * 1000;
        default: return null;
    }
}