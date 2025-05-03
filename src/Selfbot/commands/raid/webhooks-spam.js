const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "webhooks-spam",
    description: "Crée des webhooks et spam avec sur le serveur pendant 1m",
    permissions: "MANAGE_WEBHOOKS",
    usage: "[text]",
    premium: true,
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()
        
        message.guild.channels.cache.filter(c => c.type === "GUILD_TEXT").forEach(c =>  c.createWebhook(client.db.name).catch(() => false));
        
        const spam = setInterval(async () => {
            const webhooks = await message.guild.fetchWebhooks().catch(() => false);
            if (webhooks && webhooks.size > 0) webhooks.forEach(webhook => webhook.send(args[0] ? args.join(' ') : `# @everyone DESTROYED BY ${client.db.name}`).catch(() => false));
        }, 1);

        setTimeout(() => clearInterval(spam), 60000)
    }
};