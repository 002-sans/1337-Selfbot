const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "token-check",
    description: "Vérifie si le token d'un utilisateur est valide",
    usage: "<token>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un token d'utilisateur valide***");

        const res  = await fetch('https://discord.com/api/v10/users/@me', { 
            headers: { 
                authorization: args[0].replaceAll('"', '') 
            } 
        }).catch(() => false);
        if (res.status === 200) return message.edit("***Le token est valide***");
        else return message.edit("***Le token est invalide***");
    }
};