const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antipub",
    description: "Active/Désactive l'anti pub mp",
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
                if (client.db.antipub == true) return message.edit("***L'anti pub mp est déjà activé***");

                client.db.antipub = true;
                client.save();

                message.edit("***L'anti pub mp a été `activé`***");
                break

            case 'off':
                if (client.db.antipub == false) return message.edit("***L'anti pub mp est déjà désactivé***");

                client.db.antipub = false;
                client.save();

                message.edit("***L'anti pub mp a été `désactivé`***");
                break;
                
        }
    }
};