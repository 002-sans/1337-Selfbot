const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antibotdm",
    description: "Empêche un bot de vous envoyer un message",
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
                if (client.db.antibotdm == true) return message.edit("***L'anti bot mp est déjà activé***");

                client.db.antibotdm = true;
                client.save();

                message.edit("***L'anti bot mp a été `activé`***");
                break

            case 'off':
                if (client.db.antibotdm == false) return message.edit("***L'anti bot mp est déjà désactivé***");

                client.db.antibotdm = false;
                client.save();

                message.edit("***L'anti bot mp a été `désactivé`***");
                break;
                
        }
    }
};