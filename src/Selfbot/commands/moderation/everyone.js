const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "everyone",
    description: "Retire la permission everyone aux non admins",
    dir: "moderation",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Cette commande ne peut être utilisée que sur un serveur***");
        
        const roles = message.guild.roles.cache
            .filter(r => !r.permissions.has('ADMINISTRATOR') && r.permissions.has('MENTION_EVERYONE'))
            
        if (roles.size === 0) return message.edit("***Aucun rôle hors \`Administrateur\` n'a la permission everyone***");
        roles.forEach(r => r.setPermissions(r.permissions.remove('MENTION_EVERYONE')));

        message.edit(`***La permission everyone a été retiré de \`${roles.size}\` rôles***`);
    }
};