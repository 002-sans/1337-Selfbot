const Discord = require('discord.js-selfbot-v13');
const fs = require('node:fs');

module.exports = {
    name: "shardDisconnect",
    /**
     * @param {string} event
     * @param {number} id
     * @param {Discord.Client} client
    */
    run: async (event, id, client) => {
        if (!client.user?.id || !clients[client.user.id]) return;

        client.config.tokens = client.config.tokens.filter(token => token !== encrypt(clients[client.user.id].token, 'megalovania'))
        clients[client.user.id].destroy();
        delete clients[client.user.id];

        fs.writeFileSync('./config.json', JSON.stringify(client.config, null, 4));
    }
}