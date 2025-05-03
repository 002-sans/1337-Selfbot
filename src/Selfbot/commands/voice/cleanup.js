const { Client, Message } = require("discord.js-selfbot-v13");
const types = [ 'GUILD_VOICE', 'GUILD_STAGE_VOICE' ];

module.exports = {
    name: "cleanup",
    description: "Déconnecte tous les membres en vocal",
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

        const members = channel.members;
        message.edit(`***Je suis en train de déconnecter \`${members.size}\` membres du salon \`${channel.name}\`***`);

        members.forEach(m => m.voice.disconnect().catch(() =>  {}));
    }
};