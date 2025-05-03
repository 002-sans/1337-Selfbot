const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setname",
    description: "Modifie le nom d'affichage du bot",
    usage: "<nom>",
    premium: true,
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un nom d'affichage valide***");
        
        client.db.name = args.join(' ');
        client.save();

        message.edit(`***Le nom du bot est maintenant \`${args.join(' ')}\`***`);
    }
};