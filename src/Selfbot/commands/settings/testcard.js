const { Client, Message, MessageAttachment } = require("discord.js-selfbot-v13");

module.exports = {
    name: "testcard",
    usage: "[couleur]",
    description: "Teste le rendu d'une carte avec la couleur spécifiée",
    dir: 'settings',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const availableColors = ['green', 'blue', 'purple', 'red', 'orange', 'pink', 'cyan', 'yellow'];

        const originalColor = client.db.cardColor;

        if (args[0] && availableColors.includes(args[0].toLowerCase()))
            client.db.cardColor = args[0].toLowerCase();

        const testCommands = [
            `${client.db.prefix}help`,
            `${client.db.prefix}setcolor [couleur]`,
            `${client.db.prefix}setname <nom>`,
            `${client.db.prefix}setprefix <prefix>`,
            `${client.db.prefix}setimage <url>`,
            `${client.db.prefix}premium <code>`
        ];

        try {
            const image = await client.card("Test Card", client.db.image, testCommands);
            await message.edit({
                content: `**Aperçu de la carte** • Couleur: \`${client.db.cardColor}\``,
                files: [new MessageAttachment(image, 'test-card.png')]
            });
        } catch (error) {
            message.edit(`**Erreur lors de la génération:** ${error.message}`);
        }

        client.db.cardColor = originalColor;
    }
};