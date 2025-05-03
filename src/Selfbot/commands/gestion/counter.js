const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "counter",
    description: "Gère le counter du serveur",
    dir: "gestion",
    premium: true,
    usage: "[add/del/clear] [channelId]",
    permission: 'MANAGE_CHANNELS',
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

                if (client.db.counter.find(c => c.id == channel.id)) return message.edit(`***\`${channel.name}\` est déjà un counter***`);

                message.edit(`> ***Veuillez entrer un nom de salon. Voici les variables:***\n- \`{MemberCount}\`・Affiche le nombre de membres\n- \`{roleCount}\`・Affiche le nombre de rôles\n- \`{boostCount}\`・Affiche le nombre de boosts\n- \`{guildLevel}\`・Affiche le niveau du serveur`)
                const collector = await message.channel.awaitMessages({ filter: m => m.author.id == message.author.id, max: 1, time : 1000 * 60 * 10 }).catch(() => false);
                if (!collector || collector.size == 0 || !collector.first().content) return message.delete().catch(() => false);

                const newMessage = collector.first();
                if (message.deletable) message.delete().catch(() => false);

                channel.setName(newMessage.content
                    .replaceAll('{memberCount}', message.guild.memberCount)
                    .replaceAll('{roleCount}', message.guild.roles.cache.size)
                    .replaceAll('{boostCount}', message.guild.premiumSubscriptionCount)
                    .replaceAll('{guildLeveel}', getGuild(message.guild.premiumTier))
                ).catch(() => false);

                client.db.counter.push({
                    channelId: channel.id,
                    channelName: newMessage.content
                })
                client.save()

                newMessage.edit(`***Le salon \`${channel.name}\` est maintenant un counter. Il sera mis à jour chaques 10m***`);
                break;

            case 'del':
                if (!channel || !args[1]) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                if (!client.db.counter.find(c => c.id == channel.id)) return message.edit(`***\`${channel.name}\` n'est pas dans l'autoreact***`);

                client.db.counter = client.db.counter.filter(c => c.id !== channel.id);
                client.save();

                message.edit(`***Le salon \`${channel.name}\` a été retiré des counters***`);
                break;

            case 'clear':
                if (client.db.counter.length == 0) return message.edit("***Vous n'avez aucun salon counter***");
                
                client.db.counter = [];
                client.save();

                message.edit("***Les counters ont été supprimés***");
                break
        }
    }
};

function getGuild(type){
    switch(type){
        case "NONE": return 0;
        case "TIER_1": return 1;
        case "TIER_2": return 2;
        case "TIER_3": return 3;
    }
}