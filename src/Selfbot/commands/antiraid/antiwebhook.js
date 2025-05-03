const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antiwebhook",
    description: "Active/désactive la permission de crée des webhooks",
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
                if (client.db.antiraid.antiwebhook.etat) return message.edit("***L'anti webhook est déjà \`activé\`***");

                client.db.antiraid.antiwebhook.etat = true;
                client.save();

                message.edit("***L'anti webhook a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antiwebhook.etat) return message.edit("***L'anti webhook est déjà \`désactivé\`***");

                client.db.antiraid.antiwebhook.etat = false;
                client.save();

                message.edit("***L'anti webhook a été \`désactivé\`***");
                break;
        }
    }
};