const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setmfa",
    description: "Modifie votre mot de passe lié à l'A2F",
    usage: "<clé>",
    dir: "settings",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer une clé d'A2F valide***");

        client.db.mfa = args.join('');
        client.save();

        message.edit("***Votre clé d'A2F a été modifié***");
    }
};