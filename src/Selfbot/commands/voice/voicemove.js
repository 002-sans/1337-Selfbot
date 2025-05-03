const { Client, Message } = require("discord.js-selfbot-v13");
const types = [ 'GUILD_VOICE', 'GUILD_STAGE_VOICE' ];

module.exports = {
    name: "voicemove",
    description: "Déplace tous les membres d'un salon vocal vers un autre salon",
    dir: "voice",
    premium: true,
    usage: "<channel> <channel2>",
    permission: 'MOVE_MEMBERS',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channels = [...message.mentions.channels.values()];
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || await message.guild.channels.fetch(args[0]).catch(() => false);
        if (!channel || !args[0]) return message.edit(`***Aucun salon vocal de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        
        const channel2 = channels.length > 1 ? channels[1] : message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => false);
        if (!channel2 || !args[1]) return message.edit(`***Aucun salon vocal de trouvé pour \`${args[1] ?? 'rien'}\`***`);
        
        if (!types.includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/conférence***`);
        if (!types.includes(channel2.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/conférence***`);
        if (channel.id === channel2.id) return message.edit('***Veuillez mentionner deux salons différents***');

        const members = channel.members;
        message.edit(`***Je suis en train de déplacer \`${members.size}\` membres dans le salon \`${channel2.name}\`***`);

        members.forEach(m => m.voice.setChannel(channel2).catch(() =>  {}));
    }
};