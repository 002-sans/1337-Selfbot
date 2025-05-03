const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "decode",
    description: "Decode un texte en base64",
    usage: "<text>",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez envoyer un texte à décoder***");
        message.edit(Buffer.from(args.join(' '), "base64").toString("ascii"))
    }
}