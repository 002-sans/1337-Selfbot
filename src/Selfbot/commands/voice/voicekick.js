const { Client, Message } = require("discord.js");

module.exports = {
    name: "voicekick",
    description: "Déconnecte un membre du salon vocal",
    usage: "<membre>",
    dir: "voice",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    async run(client, message, args) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(() => false);
        if (!member || !args[0]) return message.channel.send(`***Aucun membre de trouvé pour \`${args[0] || "rien"}\`***`)

        if (!member.voice.channel) return message.channel.send(`***\`${member.user.displayName}\` n'est connecté dans aucun salon vocal***`)

        member.voice.disconnect()
            .then(() => message.channel.send(`***\`${member.user.displayName}\` a été déconnecté***`))
            .catch(() => message.channel.send(`Je ne peux pas déconnecter \`${member.user.displayName}\``))
    }
}