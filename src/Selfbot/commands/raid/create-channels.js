const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "create-channels",
    description: "Crée 25 salons dans le serveur",
    usage: "[nom]",
    permissions: "MANAGE_CHANNELS",
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()
        for (let i = 0; i < 25; i++){
            message.guild.channels.create(args[0] ? args.join(' ') : client.db.name).catch(() => false);
        }
    }
};