const { Client, Message } = require("discord.js-selfbot-v13");
const types = [ 'GUILD_VOICE', 'GUILD_STAGE_VOICE' ];

module.exports = {
    name: "bringall",
    description: "Déplace tous les membres en vocal dans un salon",
    dir: "voice",
    premium: true,
    usage: "<channel>",
    permission: 'MOVE_MEMBERS',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || await message.guild.channels.fetch(args[0]).catch(() => false);
        if (!channel  || !args[0]) return message.edit(`***Aucun salon vocal de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!types.includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/conférence***`);

        const members = message.guild.members.cache.filter(m => !m.user.bot && m.voice.channel);
        message.edit(`***Je suis en train de déplacer \`${members.size}\` membres dans le salon \`${channel.name}\`***`);

        members.forEach(m => m.voice.setChannel(channel).catch(() =>  {}));
    }
};