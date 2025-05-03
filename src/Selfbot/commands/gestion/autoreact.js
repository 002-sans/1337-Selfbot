const { Client, Message } = require("discord.js-selfbot-v13");
const types = ['humain', 'bot', 'all'];

module.exports = {
    name: "autoreact",
    description: "Réagi automatiquement à un message",
    dir: "gestion",
    premium: true,
    usage: "[add/del] [channel] [reaction]",
    permission: 'ADD_REACTIONS',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => false);

        switch(args[0]){
            case 'add':
                if (!channel || !args[1]) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);

                if (client.db.autoreact.find(c => c.id == channel.id)) return message.edit(`***\`${channel.name}\` est déjà dans l'autoreact***`);
                
                const react = await message.react(args[2]).catch(() => false);
                if (!react) return message.edit(`***Veuillez entrer une réaction valide***`)

                react.remove().catch(() => false);

                client.db.autoreact.push({
                    id: channel.id,
                    guildId: channel.guildId,
                    reaction: args[2]
                });
                client.save();

                message.edit(`***Le salon \`${channel.name}\` a été ajouté à l'autoreact***`);
                break;

            case 'del':
                if (!channel || !args[1]) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                if (!client.db.autoreact.find(c => c.id == channel.id)) return message.edit(`***\`${channel.name}\` n'est pas dans l'autoreact***`);

                client.db.autoreact = client.db.autoreact.filter(c => c.id !== channel.id);
                client.save();

                message.edit(`***Le salon \`${channel.name}\` a été retiré de l'autoreact***`);
                break;

            case 'clear':
                if (client.db.autoreact.length == 0) return message.edit("***Vous n'avez aucun salon dans l'autoreact***");
                
                client.db.autoreact = [];
                client.save();

                message.edit("***L'autoreact a été supprimée***");
                break

            default:
                const datas = client.db.autoreact.filter(c => c.guildId == message.guildId);
                if (!datas || datas.length == 0) return message.edit("***Vous n'avez aucun autoreact dans ce serveur***");

                message.edit(`> ***Autoreact du serveur \`${message.guild.name}\`***\n${datas.map(r => `- <#${r.id}> (${r.reaction})`).join('\n')}`);
                break;
        }
    }
};