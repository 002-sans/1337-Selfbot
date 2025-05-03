const { Client, Message } = require("discord.js-selfbot-v13");
const types = [ 'GUILD_VOICE' ];

module.exports = {
    name: "autovoc",
    description: "Modifie/supprime le salon de l'autojoin",
    dir: "voice",
    premium: true,
    usage: "[channelId]",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || await client.channels.fetch(args[0]).catch(() => false);
        if (args[0] && !channel) return message.edit(`***Aucun salon de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (args[0] && !types.includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/DM/Groupe***`);

        client.db.autovoice.channel_id = args[0] && channel.id ? channel.id : null;
        client.save();
        client.join();
        
        message.edit(`***Le salon de l'autojoin sera maintenant \`${args[0] && channel.id ? channel.name : "désactivé"}\`***`)
    }
};