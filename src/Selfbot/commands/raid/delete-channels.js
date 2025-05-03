const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "delete-channels",
    description: "Supprime tous les salons du serveur",
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
        message.guild.channels.cache.filter(c => c.deletable).forEach(c => c.delete().catch(() => false));
    }
};