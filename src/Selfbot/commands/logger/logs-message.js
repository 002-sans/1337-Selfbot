const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "logs-messages",
    description: "Envoie les logs des messages DM dans le salon actuel",
    dir: "logger",
    permission: "MANAGE_WEBHOOKS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const webhook = await message.channel.createWebhook('Message Logger').catch(() => false);
        if (!webhook) return message.edit("***Impossible de crée un webhook***");

        webhook.send({ content: "***Ce webhook enverra maintenant les logs des messages DM***" });

        client.db.logger.message = webhook.url;
        client.save()

        message.edit("***Le webhook a bien été crée***");
    }
};