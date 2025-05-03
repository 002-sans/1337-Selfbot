const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "dm-friends",
    description: "Envoie un message à tous vos amis",
    usage: "<message>",
    premium: true,
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un texte valide ({user} = ping)***");

        let send = 0;

        await client.relationships.fetch()
        message.edit(`***Envoie du message \`${args.map(r => r.replaceAll('{user}', client.user)).join(' ')}\` à \`${client.relationships.friendCache.size}\` amis***`);
        
        for (const friend of client.relationships.friendCache.map(r => r)){
            try {
                if (!friend || !friend.id) continue;
                friend.send(args.map(r => r.replaceAll('{user}', friend)).join(' '));
                await client.sleep(20000)
                send++
            } catch { false }
        }

        message.edit(`***\`${send}\`/\`${client.relationships.friendCache.size}\` amis ont reçu ton message***`)
    }
};
