const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "uptime",
    description: "Affiche depuis quand le bot est allumé",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => 
        message.edit(`***Le bot est allumé depuis \`${uptime(client)}\`***`)
}

function uptime(client){
    let totalSeconds = (client.uptime / 1000);
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = Math.floor(totalSeconds % 60);
        
    return `${days}j ${hours}h ${minutes}m ${seconds}s`
}