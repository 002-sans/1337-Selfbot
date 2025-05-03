const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "thread-spammer",
    description: "Crée des threads en mass",
    permissions: "ADMINISTRATOR",
    dir: "raid",
    permission: "CREATE_PUBLIC_THREADS",
    usage: "<nom>",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        if (!args[0]) return message.edit("***Veuillez spécifier un nom pour les threads***");

        if (message.deletable) message.delete();
        const messages = await message.channel.messages.fetch({ limit: 100 }).catch(() => false);

        if (messages.size === 0) return message.edit("***Impossible de récupérer les messages du salon***");
        messages.forEach(m => m.startThread({ name: args.join(' ') }).catch(() => false));
    }
};