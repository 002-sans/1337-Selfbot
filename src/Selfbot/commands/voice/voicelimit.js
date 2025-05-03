const { Client, Message } = require("discord.js");
const types = [ 'GUILD_VOICE', 'GUILD_STAGE_VOICE' ];

module.exports = {
    name: "voicelimit",
    description: "Vérouille le salon vocal",
    usage: "[channelId] [nombre]",
    dir: "voice",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    async run(client, message, args) {
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.member.voice.channel;

        if (!channel || !args[0]) return message.edit(`***Aucun salon vocal de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!types.includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal/conférence***`);

        const number = isNaN(args[1]) || args[1] < 0 || args[1] > 100 ? 0 : args[1]
        channel.setUserLimit(number)
            .then( () => message.edit(`***La limite du salon \`${channel.name}\` est maintenant de \`${number == 0 ? "aucune limite" : number}\`***`))
            .catch(() => message.edit(`***Impossible de modifier la limite du salon \`${channel.name}\`***`));
    }
}