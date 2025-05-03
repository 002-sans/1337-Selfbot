const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "accept",
    description: "Accepte une demande d'ami",
    dir: "friends",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);
        if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        await client.relationships.fetch().catch(() => false);
        if (!client.relationships.incomingCache.has(user.id)) return message.edit(`***\`${user.displayName}\` ne vous pas pas envoyé de demande d'ami***`);

        user.sendFriendRequest()
            .then( () => message.edit(`***Vous avez accepté \`${user.displayName}\`***`))
            .catch(() => message.edit(`***Je n'ai pas pu accepter la demande de \`${user.displayName}\`***`));
    }
};