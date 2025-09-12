const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "setcolor",
    usage: "[couleur]",
    description: "Change la couleur des cardes d'aide (green, blue, purple, red, orange, pink, cyan, yellow)",
    dir: 'settings',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const availableColors = ['green', 'blue', 'purple', 'red', 'orange', 'pink', 'cyan', 'yellow'];
        
        if (!args[0]) {
            return message.edit(`**Couleur actuelle:** \`${client.db.cardColor || 'green'}\`\n**Couleurs disponibles:** \`${availableColors.join(', ')}\``);
        }

        const color = args[0].toLowerCase();
        
        if (!availableColors.includes(color)) {
            return message.edit(`**Couleur invalide !**\n**Couleurs disponibles:** \`${availableColors.join(', ')}\``);
        }

        client.db.cardColor = color;
        client.save();
        
        message.edit(`**Couleur des cartes changée en:** \`${color}\` ✅`);
    }
};