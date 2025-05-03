const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antighost",
    description: "Active/Désactive le droit au ghostping",
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
                if (client.db.ghostping == true) return message.edit("***L'anti ghostping est déjà activé***");

                client.db.ghostping = true;
                client.save();

                message.edit("***L'anti ghostping a été `activé`***");
                break

            case 'off':
                if (client.db.ghostping == false) return message.edit("***L'anti ghostping est déjà désactivé***");

                client.db.ghostping = false;
                client.save();

                message.edit("***L'anti ghostping a été `désactivé`***");
                break;
                
        }
    }
};