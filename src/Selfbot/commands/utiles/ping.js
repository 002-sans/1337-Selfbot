const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "ping",
    description: "Affiche la latance du bot",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const time = Date.now();
        const m = await message.edit(`***WS:*** \`${client.ws.ping}ms\` | ***REST:*** \`000ms\``);
        m.edit(`***WS:*** \`${client.ws.ping}ms\` | ***REST:*** \`${Math.ceil(Date.now() - time)}ms\``);
    }
};