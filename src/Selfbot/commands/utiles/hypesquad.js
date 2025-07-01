const { Client, Message } = require("discord.js-selfbot-v13");
const houses = ["bravery", "brilliance", "balance"];

module.exports = {
    name: "hypesquad",
    description: "Modifie la hypesquad de votre compte",
    usage: "<type>",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez spécifier un type de hypesquad***");
        if (!houses.includes(args[0].toLowerCase())) return message.edit(`***Type de hypesquad invalide. Types valides: ${houses.map(c => `\`${c}\``).join(", ")}***`);

        client.user.setHypeSquad(houses.indexOf(args[0].toLowerCase()));
        message.edit(`***Votre hypesquad est maintenant ${args[0].toLowerCase()}***`);
    }
}