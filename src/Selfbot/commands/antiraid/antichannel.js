const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antichannel",
    description: "Active/désactive la permission de crée/supp/edit un salon",
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
                if (client.db.antiraid.antichannel.etat) return message.edit("***L'anti channel est déjà \`activé\`***");

                client.db.antiraid.antichannel.etat = true;
                client.save();

                message.edit("***L'anti channel a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antichannel.etat) return message.edit("***L'anti channel est déjà \`désactivé\`***");

                client.db.antiraid.antichannel.etat = false;
                client.save();

                message.edit("***L'anti channel a été \`désactivé\`***");
                break;
        }
    }
};