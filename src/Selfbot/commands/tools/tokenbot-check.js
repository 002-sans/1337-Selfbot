const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "tokenbot-check",
    description: "Vérifie si le token d'un bot est valide",
    usage: "<token>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un token de bot valide***");

        const res  = await fetch('https://discord.com/api/v10/users/@me', { 
            headers: { 
                authorization: 'Bot ' + args[0].replaceAll('"', '') 
            } 
        }).catch(() => false);
        if (res.status === 200) return message.edit("***Le token est valide***");
        else return message.edit("***Le token est invalide***");
    }
};