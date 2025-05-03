const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setstream",
    description: "Active/Désactive le stream du autovoice",
    dir: "voice",
    premium: true,
    usage: "<on/off>",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!['on', 'off'].includes(args[0])) return message.edit(`***Paramètre manquant: \`on\`/\`off\`***`);

        client.db.autovoice.self_stream = args[0] == 'on' ? true : false
        client.save();
        client.join();

        message.edit(`***Le stream de l'autojoin a été \`${args[0] == "on" ? "activé" : "désactivé"}\`***`)
    }
};