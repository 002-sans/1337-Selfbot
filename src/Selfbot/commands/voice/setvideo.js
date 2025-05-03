const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setvideo",
    description: "Active/Désactive le casque du autovoice",
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

        client.db.autovoice.self_video = args[0] == 'on' ? true : false
        client.save();

        message.edit(`***La vidéo de l'autojoin a été \`${args[0] == "on" ? "activé" : "désactivé"}\`***`)
        if (client.db.autovoice.channel_id) client.join();
    }
};