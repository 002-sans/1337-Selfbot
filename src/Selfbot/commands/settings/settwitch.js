const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "settwitch",
    description: "Modifie votre lien twitch",
    usage: "<pseudo>",
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un pseudo valide***");
        if (args[0].startsWith('http')) return message.edit("***Veuillez entrer uniquement un pseudo et non un lien***");

        client.db.twitch = `https://twitch.tv/${args[0]}`;
        client.save();

        message.edit(`***Votre lien twitch a été modifié en [\`${args[0]}\`](<https://twitch.tv/${args[0]}>)***`);
    }
};