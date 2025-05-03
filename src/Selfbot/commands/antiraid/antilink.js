const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antilink",
    description: "Active/désactive la permission d'envoyer des liens",
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
                if (client.db.antiraid.antilink.etat) return message.edit("***L'anti link est déjà \`activé\`***");

                client.db.antiraid.antilink.etat = true;
                client.save();

                message.edit("***L'anti link a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antilink.etat) return message.edit("***L'anti link est déjà \`désactivé\`***");

                client.db.antiraid.antilink.etat = false;
                client.save();

                message.edit("***L'anti link a été \`désactivé\`***");
                break;
        }
    }
};