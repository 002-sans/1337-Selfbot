const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "delete-roles",
    description: "Supprime tous les rôles du serveur",
    permissions: "MANAGE_ROLES",
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()
        message.guild.roles.cache.filter(r => r.editable).forEach(r => r.delete().catch(() => false));
    }
};