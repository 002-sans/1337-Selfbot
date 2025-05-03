const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antibot",
    description: "Active/désactive la permission d'ajouter un bot",
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
                if (client.db.antiraid.antibot.etat) return message.edit("***L'anti bot est déjà \`activé\`***");

                client.db.antiraid.antibot.etat = true;
                client.save();

                message.edit("***L'anti bot a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antibot.etat) return message.edit("***L'anti bot est déjà \`désactivé\`***");

                client.db.antiraid.antibot.etat = false;
                client.save();

                message.edit("***L'anti bot a été \`désactivé\`***");
                break;
        }
    }
};