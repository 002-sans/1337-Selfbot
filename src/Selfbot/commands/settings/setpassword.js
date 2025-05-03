const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setpassword",
    description: "Modifie votre mot de passe lié à l'A2F",
    usage: "<mdp>",
    dir: "settings",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un mot de passe valide***");

        client.db.password = args.join(' ');
        client.save();

        message.edit('***Votre mot de passe a été modifié***');
    }
};