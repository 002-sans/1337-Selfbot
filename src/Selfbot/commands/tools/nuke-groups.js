const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "nuke-groups",
    description: "Quitte tous vos groupes discrètement",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        message.delete()
        client.channels.cache.filter(c => c.type === "GROUP_DM").forEach(c => c.delete(true));
    }
};
