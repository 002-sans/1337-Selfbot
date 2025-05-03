const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "renew",
    description: "Recrée un salon",
    dir: "moderation",
    usage: "<channel>",
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

        const newChannel = await channel.clone({
            name: channel.name,
            permissions: channel.permissionsOverwrites,
            type: channel.type,
            topic: channel.withTopic,
            nsfw: channel.nsfw,
            birate: channel.bitrate,
            userLimit: channel.userLimit,
            rateLimitPerUser: channel.rateLimitPerUser,
            permissions: channel.withPermissions,
            position: channel.rawPosition,
            reason: `Salon recréé par ${message.author.username} (${message.author.id})`
        }).catch(() => false);
        
        if (!newChannel) return message.edit(`***Impossible de recrée le salon \`${channel.name}\`***`);
        channel.delete()
            .catch(() => {
                newChannel.delete().catch(() => false);
                message.edit(`***Impossible de supprimer le salon \`${channel.name}\`***`);
            })
    }
}