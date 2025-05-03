const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "encode",
    description: "Encode un texte en base64",
    usage: "<text>",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez envoyer un texte à encoder***");
        message.edit(Buffer.from(args.join(' '), "ascii").toString("base64"))
    }
}