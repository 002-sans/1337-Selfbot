const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "kick",
    description: "Expulse un membre du serveur",
    dir: "moderation",
    usage: "<membre> [raison]",
    permission: "KICK_MEMBERS",
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

        if (!member.kickable) return message.edit(`***Je n'ai pas la permission d'expulser \`${member.user.displayName}\`***`);
        
        member.kick(args[1] ? args.slice(1).join(' ') : null )
            .then( () => message.edit(`***\`${member.user.displayName}\` a été expulsé***`))
            .catch(() => message.edit(`***\`${member.user.displayName}\` n'a pas pu être expulser***`));
    }
};