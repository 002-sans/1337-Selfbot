const { Client, Message } = require("discord.js-selfbot-v13");
const types = [ 'GUILD_VOICE' ];

module.exports = {
    name: "joinvc",
    description: "Rejoint un vocal avec les paramètres de l'autovoc",
    dir: "voice",
    premium: true,
    usage: "<channelId>",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || await client.channels.fetch(args[0]).catch(() => false);
        if (!args[0] || !channel) return message.edit(`***Aucun salon de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!types.includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/DM/Groupe***`);

        client.join(channel.id);
        message.edit(`***Vous avez rejoint le salon \`${channel.name}\`***`)
    }
};