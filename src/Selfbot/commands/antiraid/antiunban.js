const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antiunban",
    description: "Active/désactive la permission de débanir dans le serveur",
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
                if (client.db.antiraid.antiunban.etat) return message.edit("***L'anti unban est déjà \`activé\`***");

                client.db.antiraid.antiunban.etat = true;
                client.save();

                message.edit("***L'anti unban a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antiunban.etat) return message.edit("***L'anti unban est déjà \`désactivé\`***");

                client.db.antiraid.antiunban.etat = false;
                client.save();

                message.edit("***L'anti unban a été \`désactivé\`***");
                break;
        }
    }
};