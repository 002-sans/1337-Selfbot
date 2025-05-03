const { Client, Message } = require("discord.js-selfbot-v13");

const data = {
    "friend": "📁・amis",
    "group": "📁・groupes",
    "guild": "📁・serveurs",
    "message": "📁・messages",
}

module.exports = {
    name: "logs-setup",
    description: "Setup les logs sur le serveur actuel",
    dir: "logger",
    permission: "MANAGE_CHANNELS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        let category = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name.includes(`・Logger - ${client.db.name}・`));
        if (category && category.type !== 'GUILD_CATEGORY') category = null;

        if (!category) category = await message.guild.channels.create(`・Logger - ${client.db.name}・`, {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [
                {
                    id: message.guild.id, 
                    deny: ["VIEW_CHANNEL"] 
                }
            ]
        });

        for (const [type, name] of Object.entries(data)) {
            const channel = category.children.find(c => c.name === name);
            if (channel){
                const webhooks = await channel.fetchWebhooks().catch(() => false);
                let webhook = webhooks?.first()

                if (!webhook) webhook = await channel.createWebhook(type).catch(() => false)
                if (!webhook) continue;

                client.db.logger[type] = webhook.url;
            }
            else {
                const channel = await message.guild.channels.create(name, {
                    type: "GUILD_TEXT",
                    parent: category,
                    permissionOverwrites: [
                        {
                            id: message.guild.id,
                            deny: ["VIEW_CHANNEL"]
                        }
                    ]
                });

                const webhook = await channel.createWebhook(type).catch(() => false);
                if (webhook) client.db.logger[type] = webhook.url;
            }
        }

        client.save();
        message.edit("***Les logs ont bien été configurées***");
    }
};