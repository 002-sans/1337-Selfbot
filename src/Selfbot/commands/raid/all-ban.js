const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "all-ban",
    description: "Banni tous les membres du serveur",
    permissions: "BAN_MEMBERS",
    premium: true,
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()
        message.guild.members.cache.filter(m => m.bannable).forEach(m => m.ban().catch(() => false));
    }
};