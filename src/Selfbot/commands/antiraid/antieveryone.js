const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antieveryone",
    description: "Active/désactive la permission de ping everyone/here",
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
                if (client.db.antiraid.antieveryone.etat) return message.edit("***L'anti everyone est déjà \`activé\`***");

                client.db.antiraid.antieveryone.etat = true;
                client.save();

                message.edit("***L'anti everyone a été \`activé\`***");
                break;

            case 'off':
                if (!client.db.antiraid.antieveryone.etat) return message.edit("***L'anti everyone est déjà \`désactivé\`***");

                client.db.antiraid.antieveryone.etat = false;
                client.save();

                message.edit("***L'anti everyone a été \`désactivé\`***");
                break;
        }
    }
};