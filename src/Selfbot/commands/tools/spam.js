const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "spam",
    description: "Spam un texte dans un salon",
    usage: "<text>",
    premium: true,
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit('***Veuillez entrer un texte valide***');

        if (message.editable) message.edit(args.join(' '))
        if (client.data[`spam-${client.user.id}`]) clearInterval(client.data[`spam-${client.user.id}`]);
        
        client.data[`spam-${client.user.id}`] = setInterval(() => message.channel.send(args.join(' ')).catch(() => false), 500)
    }
};