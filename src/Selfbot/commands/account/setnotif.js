const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setnotif",
    description: "Active/désactive les notifications sur téléphone",
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
                if (client.db.notif == false) return message.edit("***Les notifs sont déjà activé***");

                client.user.setAFK(false);
                client.db.notif = false;
                client.save();

                message.edit("***Les notifs ont été `activés`***");
                break

            case 'off':
                if (client.db.notif == true) return message.edit("***Les notifs sont déjà désactivé***");

                client.user.setAFK(true);
                client.db.notif = true;
                client.save();

                message.edit("***Les notifs ont été `désactivés`***");
                break;
                
        }
    }
};