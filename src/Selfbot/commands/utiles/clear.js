const { Client, Message } = require("discord.js-selfbot-v13");
const dataObject = {};

module.exports = {
    name: "clear",
    description: "Supprime un certain nombre de vos messages",
    usage: "[nombre]",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        
        if (args[0] == client.user.id + 'all'){
            if (dataObject[client.user.id + 'all']) return message.edit("***La commande clear all est déjà en cours***");

            const messages = [];
            const channels = client.channels.cache.filter(c => c.type === 'DM' || c.type === 'GROUP_DM');

            if (channels.size === 0) return message.edit("***Vous n'avez aucun DM et Groupes***");
            await message.edit(`***${channels.size} DM et Groupes trouvés***`);

            dataObject[client.user.id + 'all'] = true;

            const data = channels.map(async channel => {
                const channelMessages = await fetchAll(Infinity, channel, client);
                if (channelMessages.length > 0) channelMessages.filter(c => c.deletable).forEach(m => m ? messages.push(m) : false);
            })
            
            await Promise.all(data);

            for (const msg of messages.sort(() => Math.random() - 0.5).values()) {
                try {
                    console.log(msg.content)
                    await msg.delete();
                    await client.sleep(10000);
                } catch (error) { false }
            }

            return delete dataObject[client.user.id + 'all'];
        }

        if (dataObject[client.user.id + 'normal']) return message.edit("***Une commande clear est déjà en cours***");
        dataObject[client.user.id + 'normal'] = true;
        message.delete().catch(() => false);

        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || message.channel;
        const messages = await fetchAll(Number(args[0]) ? parseInt(args[0]) : Infinity, channel, client);
        
        messages.filter(m => m.deletable);

        if (args[0] == 'reverse' || args[1] == 'reverse') messages.reverse();
            
        for (let i = 0; i < messages?.length ?? 0; i += 2) {
            await Promise.all([
                messages[i] ? messages[i].delete().catch(() => false) : false,
                messages[i + 1] ? messages[i + 1].delete().catch(() => false) : false,
            ]);
            await client.sleep(2500);
        }
        delete dataObject[client.user.id + 'normal'];
    }
}

/**
 * @param {string[]} limit
 * @param {Channel} channel
 * @param {Client} client
*/
async function fetchAll(limit, channel, client) {
    let messages = [];
    let lastID;
    while (true) { 
        const fetchedMessages = await channel.messages.fetch({
            limit: 100,
            cache: false,
           ...(lastID && { before: lastID }),
        });
        
        if (fetchedMessages.size === 0 || (limit && messages.length >= limit)) {
            return messages.filter(msg => msg.author?.id === client.user?.id).slice(0, limit);
        }
        
        messages = messages.concat(Array.from(fetchedMessages.values()));
        lastID = fetchedMessages.lastKey();
    }
}