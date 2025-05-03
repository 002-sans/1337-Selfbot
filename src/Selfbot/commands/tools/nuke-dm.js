const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "nuke-dm",
    description: "Ferme tous vos messages privés (sauf les groupes)",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        message.delete()
        client.channels.cache.filter(c => c.type === "DM").forEach(c => c.delete());
    }
};
