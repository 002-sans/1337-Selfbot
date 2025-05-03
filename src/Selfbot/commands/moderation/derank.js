const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "derank",
    description: "Retire tous les rôles d'un membre",
    dir: "moderation",
    usage: "<membre>",
    permission: "MANAGE_ROLES",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Cette commande ne peut être utilisée que sur un serveur***");
        
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(() => false);
        if (!member || !args[0]) return message.edit(`***Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        if (!member.manageable) return message.edit(`***Je n'ai pas la permission de derank \`${member.user.displayName}\`***`);
        
        member.roles.set([])
            .then( () => message.edit(`***\`${member.user.displayName}\` a été derank***`))
            .catch(() => message.edit(`***\`${member.user.displayName}\` n'a pas pu être derank***`));
    }
};