const { Client, Message } = require("discord.js-selfbot-v13");
const status = [ 'online', 'idle', 'dnd', 'invisible' ];

module.exports = {
    name: "setstatus",
    description: "Modifie votre status",
    usage: '<online/idle/dnd/invisible>',
    dir: "status",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!status.includes(args[0])) return message.edit(`> ***Veuillez choisir un status valide***\n${status.map(r => `- ${r}`).join('\n')}`);
        
        client.user.setStatus(args[0]);
        client.db.status = args[0];
        client.save()

        message.edit(`***Votre nouveau status est \`${args[0]}\`***`);
    }
};