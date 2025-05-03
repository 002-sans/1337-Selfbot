const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "slowmode",
    description: "Modifie/Réinitialise le mode lent d'un salon",
    dir: "moderation",
    usage: "<channel> [temps]",
    permission: "MANAGE_CHANNELS",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Cette commande ne peut être utilisée que sur un serveur***");
        
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        if (!channel) return message.edit(`***Aucun salon de trouvé pour \`${args[0] ?? 'rien'}\`***`)
        if (args[1] && isNaN(ms(args[1]))) return message.edit(`***\`${args[1]}\` n'est pas un temps valide***`);

        channel.setRateLimitPerUser(args[1] ? Math.floor(ms(args[1]) / 1000) : 0)
            .then(() => message.edit(`***Le mode lent de \`${channel.name}\` a été modifié***`))
            .catch(() => message.edit(`***Le mode lent de \`${channel.name}\` n'a pas pu être modifié***`));
    }
};

function ms(timeString) {
    const match = timeString.match(/(\d+)([smhdwy])/);
    if (!match) return null;
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
        case 's': return value * 1000;
        case 'm': return value * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'w': return value * 7 * 24 * 60 * 60 * 1000;
        case 'y': return value * 365 * 24 * 60 * 60 * 1000;
        default: return null;
    }
}