const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setimage",
    description: "Modifie votre image des menus",
    usage: "<lien>",
    dir: "settings",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0] || !args[0].startsWith('http')) return message.edit("***Veuillez entrer un lien valide***");
        
        client.db.image = args[0];
        client.save();

        message.edit('***Votre image a été modifié***');
    }
};