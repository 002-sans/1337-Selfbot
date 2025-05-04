const { Client, Message } = require("discord.js-selfbot-v13");

const infos = {
    "web"    : { os: "Other",   browser: "Discord Web" },
    "mobile" : { os: "Android", browser: "Discord Android" },
    "desktop": { os: "Linux",   browser: "Discord Client" },
    "console": { os: "Windows", browser: "Discord Embedded"}
}

module.exports = {
    name: "spoof",
    description: "Modifie la plateforme du bot",
    usage: "<type>",
    premium: true,
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0] || !Object.keys(infos).includes(args[0]))
            return message.edit(`> ***Voici la liste des plateformes disponnibles***\n${Object.keys(infos).map(r => `- ${r}`).join('\n')}`)

        client.options.ws.properties.os      = infos[args[0]].os
        client.options.ws.properties.browser = infos[args[0]].browser

        message.delete();

        client.db.platform = args[0];
        client.save();

        client.load(client.token);
        return client.destroy();
    }
};