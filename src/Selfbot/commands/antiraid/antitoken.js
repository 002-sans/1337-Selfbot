const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antitoken",
    description: "Active/désactive les joins en masse",
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
                if (client.db.antiraid.antitoken.etat) return message.edit("***L'anti token est déjà \`activé\`***");

                client.db.antiraid.antitoken.etat = true;
                client.save();

                message.edit("***L'anti token a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antitoken.etat) return message.edit("***L'anti token est déjà \`désactivé\`***");

                client.db.antiraid.antitoken.etat = false;
                client.save();

                message.edit("***L'anti token a été \`désactivé\`***");
                break;
        }
    }
};