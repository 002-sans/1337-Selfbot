const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "unmute",
    description: "Unmute un membre du serveur",
    dir: "moderation",
    usage: "<membre/all>",
    permission: "MODERATE_MEMBERS",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Cette commande ne peut être utilisée que sur un serveur***");
        
        switch(args[0]){
            case 'all':
                const mutes = message.guild.members.cache.filter(m => m.isCommunicationDisabled());
                if (mutes.size === 0) return message.edit("***Il n'y a aucun membre mute sur le serveur***")
        
                mutes.forEach(m => m.timeout(1).catch(() => false));
                message.edit(`***\`${mutes.size}\` membres ont été unmute***`);
                break;

            default:
                const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(() => false);
                
                if (!member || !args[0]) return message.edit(`***Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\`***`);
                if (!member.moderatable) return message.edit(`***Je n'ai pas la permission d'unmute \`${member.user.displayName}\`***`);
                
                member.timeout(1)
                    .then( () => message.edit(`***\`${member.user.displayName}\` a été unmute***`))
                    .catch(() => message.edit(`***\`${member.user.displayName}\` n'a pas pu être unmute***`));

                break;
        }
    }
};
