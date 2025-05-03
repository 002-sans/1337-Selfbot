const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "friend-link",
    description: "Crée un lien pour vous ajouter en ami",
    dir: "friends",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        const invite = await client.user.createFriendInvite().catch(() => {});
        if (!invite) return message.edit(`***Je n'ai pas pu crée de code d'invitation***`);

        if (message.deletable) message.delete().catch(() => false);
        message.channel.send(invite.url)
    }
};