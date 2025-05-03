const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "find",
    description: "Cherche un utilisateur en vocal sur tous vos serveurs",
    usage: "<user>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);
        if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        const guilds = client.guilds.cache.filter(g => g.members.cache.get(user.id)?.voice?.channelId)
        message.edit(`***\`${user.displayName}\` est connecté en vocal dans \`${guilds.size}\` serveur${guilds.size > 1 ? 's' : ''}***\n${guilds.map(r => `- ${r.members.cache.get(user.id)?.voice.channel}`).join('\n')}`)
    }
};