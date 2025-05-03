const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "all-kick",
    description: "Expulse tous les membres du serveur",
    permissions: "KICK_MEMBERS",
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
        message.guild.members.cache.filter(m => m.kickable).forEach(m => m.kick().catch(() => false));
    }
};