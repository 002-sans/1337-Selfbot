const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antiupdate",
    description: "Active/désactive la permission de modifier le serveur",
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
                if (client.db.antiraid.antiupdate.etat) return message.edit("***L'anti update est déjà \`activé\`***");

                client.db.antiraid.antiupdate.etat = true;
                client.save();

                message.edit("***L'anti update a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antiupdate.etat) return message.edit("***L'anti update est déjà \`désactivé\`***");

                client.db.antiraid.antiupdate.etat = false;
                client.save();

                message.edit("***L'anti update a été \`désactivé\`***");
                break;
        }
    }
};