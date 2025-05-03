const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "blacklist",
    description: "Blacklist un utilisateur de vos serveurs",
    dir: "gestion",
    premium: true,
    aliases: [ 'bl' ],
    usage: "[user/info/list] [userId/raison]",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        switch(args[0]){
            case 'list':
                if (client.db.bl.length == 0) return message.edit("***Il n'y a aucun utilisateur de blacklist***");

                const arrays = arrayDiviser(client.db.bl);
                if (arrays.length == 1) return message.edit(`> ***Liste des utilisateurs blacklist***\n${arrays[0].map(r => `- <@${r.id}> (\`${r.id}\`)・\`${r.reason}\``).join('\n')}`);

                message.edit(`> ***Liste des utilisateurs blacklist***\n${arrays[0].map(r => `- ${r.id} (\`${r.id}\`)・\`${r.reason}\``).join('\n')}`);
                arrays.forEach(array => message.channel.send(`${array.map(r => `- ${r.id} (\`${r.id}\`)・\`${r.reason}\``).join('\n')}`));
                break;

            case 'info':
                const user2 = message.mentions.users.first() || client.users.cache.get(args[1]) || await client.users.fetch(args[1]).catch(() => false);
                if (!user2 || !args[1]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                
                const blData = client.db.bl.find(c => c.id == user2.id);
                if (!blData) return message.edit(`***\`${user2.displayName}\` n'est pas blacklist***`);

                message.edit(`> ***Information sur la blacklist de \`${user2.displayName}\`***\n- \`ID\`・${blData.id}\n- \`Date\`・<t:${Math.round(blData.date / 1000)}:R>\n- \`Raison\`・${blData.reason}`);
                break;

            default:
                const user = message.mentions.users.first() || client.users.cache.get(args[0] ?? args[1]) || await client.users.fetch(args[0] ?? args[1]).catch(() => false);
                if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);
                if (client.db.bl.find(c => c.id === user.id)) return message.edit(`***\`${user.displayName}\` est déjà blacklist***`);

                let banned = 0;
                const reason = args[1] ? args.slice(1).join(' ') : 'Blacklist sans raison fournie';
                client.db.bl.push({ id: user.id, date: Date.now(), reason });
                client.save();
                
                const guilds = client.guilds.cache.filter(guild => guild.members.me.permissions.has('BAN_MEMBERS'));
               
                message.edit(`***Bannissement de \`${user.globalName}\` en cours...***`)
               
                const banPromises = guilds.map(async guild => {
                    try {
                        await guild.bans.create(user, { reason });
                        banned++;
                    } catch { false }
                });

                await Promise.all(banPromises);

                message.edit(`***\`${user.globalName}\` a été ajouté à la blacklist pour \`${reason}\`\nIl a été banni de \`${banned}\` serveurs***`)
                break;
        }
    }
};


function arrayDiviser(array) {
    let result = [];
    for (let i = 0; i < array.length; i += 20) {
        result.push(array.slice(i, i + 20));
    }
    return result;
}