const { Client, Message } = require("discord.js");
const types = [ 'GUILD_VOICE', 'GUILD_STAGE_VOICE' ];

module.exports = {
    name: "voiceunlock",
    description: "Dévérouille le salon vocal",
    usage: "[channelId]",
    dir: "voice",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    async run(client, message, args) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;

        if (!channel) return message.edit(`***Aucun salon vocal de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!types.includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/conférence***`);

        channel.permissionOverwrites.edit(message.guild.id, { CONNECT: null })
            .then( () => message.edit(`***Le salon \`${channel.name}\` a été dévérouillé***`))
            .catch(() => message.edit(`***Impossible de dévérouiller le salon \`${channel.name}\`***`));
    }
}