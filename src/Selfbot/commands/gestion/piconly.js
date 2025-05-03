const { Client, Message } = require("discord.js-selfbot-v13");
const types = ['humain', 'bot', 'all'];

module.exports = {
    name: "piconly",
    description: "Empêche l'envoie de messages sans image",
    dir: "gestion",
    premium: true,
    usage: "[add/del] [channel]",
    permission: 'MANAGE_MESSAGES',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[0]).catch(() => false);

        switch(args[0]){
            case 'add':
                if (!channel || !args[1]) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);

                if (client.db.piconly.find(c => c.id == channel.id)) return message.edit(`***\`${channel.name}\` est déjà un piconly***`);
                
                client.db.piconly.push({
                    id: channel.id,
                    guildId: channel.guildId,
                });
                client.save();

                message.edit(`***Le salon \`${channel.name}\` a est maintenant un piconly***`);
                break;

            case 'del':
                if (!channel || !args[1]) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                if (!client.db.piconly.find(c => c.id == channel.id)) return message.edit(`***\`${channel.name}\` n'est pas un piconly***`);

                client.db.piconly = client.db.piconly.filter(c => c.id !== channel.id);
                client.save();

                message.edit(`***Le salon \`${channel.name}\` a été retiré des piconly***`);
                break;

            case 'clear':
                if (client.db.piconly.length == 0) return message.edit("***Vous n'avez aucun salon piconly***");
                
                client.db.piconly = [];
                client.save();

                message.edit("***Les piconly ont été supprimée***");
                break

            default:
                const datas = client.db.piconly.filter(c => c.guildId == message.guildId);
                if (!datas || datas.length == 0) return message.edit("***Vous n'avez aucun piconly dans ce serveur***");

                message.edit(`> ***Piconly du serveur \`${message.guild.name}\`***\n${datas.map(r => `- <#${r.id}>`).join('\n')}`);
                break;
        }
    }
};