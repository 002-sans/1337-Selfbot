const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "unblock",
    description: "Débloque un utilisateur",
    dir: "friends",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);
        if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        if (!client.relationships.blockedCache.has(user.id)) return message.edit(`***\`${user.displayName}\` n'est pas bloqué***`);

        await client.api.users('@me').relationships(user.id).delete()
        message.edit(`***\`${user.displayName}\` a été débloqué***`)
    }
};