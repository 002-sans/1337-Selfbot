const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setprefix",
    description: "Modifie le prefix du bot",
    usage: "<prefix>",
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un prefix valide***");
        if (args[0].length > 5) return message.edit("***Le prefix ne peut pas dépasser 5 caractères***");

        client.db.prefix = args[0];
        client.save();

        message.edit(`***Le prefix du bot est maintenant \`${args[0]}\`***`);
    }
};