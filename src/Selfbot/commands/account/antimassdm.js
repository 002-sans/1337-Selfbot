const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antimassdm",
    description: "Empêche un spam de plusieurs personnes en DM",
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
                if (client.db.antimassdm == true) return message.edit("***L'anti mass dm est déjà activé***");

                client.db.antimassdm = true;
                client.save();

                message.edit("***L'anti mass dm a été `activé`***");
                break

            case 'off':
                if (client.db.antimassdm == false) return message.edit("***L'anti mass dm est déjà désactivé***");

                client.db.antimassdm = false;
                client.save();

                message.edit("***L'anti mass dm a été `désactivé`***");
                break;
                
        }
    }
};