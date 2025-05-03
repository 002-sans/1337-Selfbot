const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antitmassmention",
    description: "Active/désactive la permission de mentionner en masse",
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
                if (client.db.antiraid.antimassmention.etat) return message.edit("***L'anti mass mention est déjà \`activé\`***");

                client.db.antiraid.antimassmention.etat = true;
                client.save();

                message.edit("***L'anti mass mention a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antimassmention.etat) return message.edit("***L'anti mass mention est déjà \`désactivé\`***");

                client.db.antiraid.antimassmention.etat = false;
                client.save();

                message.edit("***L'anti mass mention a été \`désactivé\`***");
                break;
        }
    }
};