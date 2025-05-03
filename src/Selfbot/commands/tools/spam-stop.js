const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "spam-stop",
    description: "Arrête le spam en cours",
    premium: true,
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!client.data[`spam-${client.user.id}`]) message.edit("***Aucun spam n'a été executé***");

        clearInterval(client.data[`spam-${client.user.id}`]);
        message.edit("***Le spam a été arrêté avec succès***")
    }
};