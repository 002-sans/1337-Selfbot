const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "multiclan",
    description: "Active/Désactive le multi clan",
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
                if (client.db.multiclan == true) return message.edit("***Le multi clan est déjà activé***");

                client.db.multiclan = true;
                client.save();

                message.edit("***Le multi clan a été `activé`***");
                break

            case 'off':
                if (client.db.multiclan == false) return message.edit("***Le multi clan est déjà désactivé***");

                client.db.multiclan = false;
                client.save();

                message.edit("***Le multi clan a été `désactivé`***");
                break;
                
        }
    }
};