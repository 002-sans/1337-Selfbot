const { Client, Message } = require("discord.js-selfbot-v13");
const themes = [ "default", "nighty", "speed", "codeblock", "image" ];

module.exports = {
    name: "settheme",
    description: "Modifie le thème des menus du bot",
    usage: "<theme>",
    premium: true,
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0] || !themes.includes(args[0]))
            return message.edit(`> ***Voici la liste des themes disponnibles***\n${themes.map(r => `- ${r}`).join('\n')}`)

        client.db.type = args[0];
        client.save();

        message.edit(`***Votre nouveau thème est le type par \`${args[0]}\`***`)
    }
};