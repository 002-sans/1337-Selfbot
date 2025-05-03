const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antikick",
    description: "Active/désactive la permission de kick dans le serveur",
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
                if (client.db.antiraid.antikick.etat) return message.edit("***L'anti kick est déjà \`activé\`***");

                client.db.antiraid.antikick.etat = true;
                client.save();

                message.edit("***L'anti kick a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antikick.etat) return message.edit("***L'anti kick est déjà \`désactivé\`***");

                client.db.antiraid.antikick.etat = false;
                client.save();

                message.edit("***L'anti kick a été \`désactivé\`***");
                break;
        }
    }
};