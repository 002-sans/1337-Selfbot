const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antiban",
    description: "Active/désactive la permission de bannir un membre",
    dir: "antiraid",
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
                if (client.db.antiraid.antiban.etat) return message.edit("***L'anti ban est déjà \`activé\`***");

                client.db.antiraid.antiban.etat = true;
                client.save();

                message.edit("***L'anti ban a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antiban.etat) return message.edit("***L'anti ban est déjà \`désactivé\`***");

                client.db.antiraid.antiban.etat = false;
                client.save();

                message.edit("***L'anti ban a été \`désactivé\`***");
                break;
        }
    }
};