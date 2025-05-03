const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antirole",
    description: "Active/désactive la permission de crée/supp/edit un rôle",
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
                if (client.db.antiraid.antirole.etat) return message.edit("***L'anti role est déjà \`activé\`***");

                client.db.antiraid.antirole.etat = true;
                client.save();

                message.edit("***L'anti role a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antirole.etat) return message.edit("***L'anti role est déjà \`désactivé\`***");

                client.db.antiraid.antirole.etat = false;
                client.save();

                message.edit("***L'anti role a été \`désactivé\`***");
                break;
        }
    }
};