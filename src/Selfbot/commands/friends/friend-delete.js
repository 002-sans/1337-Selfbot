const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "friend-delete",
    description: "Supprime tous vos liens d'amis",
    dir: "friends",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
     */
    run: async (client, message, args) => {
        client.user.revokeAllFriendInvites().catch(() => false);
        message.edit("***Tous vos liens d'amis ont été supprimés***");
    }
};