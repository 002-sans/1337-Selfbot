const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setnsfw",
    description: "Active ou désactive le mode NSFW",
    usage: "<on/off>",
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        switch(args[0]){
            case 'on':
                if (client.db.nsfw) return message.edit("***Le mode NSFW est déjà activé***");
                client.db.nsfw = true;
                client.save();
                message.edit("***Le mode NSFW est activé***");
                break;

            case 'off':
                if (!client.db.nsfw) return message.edit("***Le mode NSFW est déjà désactivé***");
                client.db.nsfw = false;
                client.save();
                message.edit("***Le mode NSFW est désactivé***");
                break;
        }
    }
};