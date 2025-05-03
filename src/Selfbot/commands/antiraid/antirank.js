const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antirank",
    description: "Active/désactive la permission de donner un rôle dangereux",
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
                if (client.db.antiraid.antirank.etat) return message.edit("***L'anti rank est déjà \`activé\`***");

                client.db.antiraid.antirank.etat = true;
                client.save();

                message.edit("***L'anti rank a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antirank.etat) return message.edit("***L'anti rank est déjà \`désactivé\`***");

                client.db.antiraid.antirank.etat = false;
                client.save();

                message.edit("***L'anti rank a été \`désactivé\`***");
                break;
        }
    }
};