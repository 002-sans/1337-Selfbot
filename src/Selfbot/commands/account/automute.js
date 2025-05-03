const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "automute",
    description: "Mute les nouveaux serveurs rejoints",
    dir: "account",
    usage: "<on/off>",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        switch(args[0]){

            case 'on':
                if (client.db.automute == true) return message.edit("***L'auto mute est déjà activé***");

                client.db.automute = true;
                client.save();

                message.edit("***L'auto mute a été `activé`***");
                break

            case 'off':
                if (client.db.automute == false) return message.edit("***L'auto mute est déjà désactivé***");

                client.db.automute = false;
                client.save();

                message.edit("***L'auto mute a été `désactivé`***");
                break;
                
        }
    }
};