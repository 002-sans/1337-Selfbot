const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "antiMassDM",
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        if (message.author.id === client.user.id) return;
        if (!client.data['massdm'])  client.data['massdm']  = 0;
        if (!client.data['massmsg']) client.data['massmsg'] = [];
        if (!client.data['masscom']) client.data['masscom'] = [];

        client.data['massdm']++
        client.data['massmsg'].push(message);
        client.data['masscom'].push(message.author.id);

        setTimeout(() => {
            if ([...new Set(client.data['masscom'])].length >= 3) client.data['massmsg'].forEach(m => m.markRead().catch(() => false));
            delete client.data['massmsg'];
            delete client.data['masscom'];
            delete client.data['massdm'];
        }, 1000 * 5)
    }
}