const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "autorole",
    description: "Ajoute automatiquement un rôle aux membres du serveur",
    dir: "gestion",
    premium: true,
    usage: "[add/del] [role] [humain/bot/all]",
    permission: 'MANAGE_ROLES',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || await message.guild.roles.fetch(args[0]).catch(() => false);

        switch(args[0]){
            case 'add':
                if (!role || !args[1]) return message.edit(`***Aucun rôle de trouvé pour \`${args[1] ?? 'rien'}\`***`);

                if (client.db.autorole.find(c => c.id == role.id)) return message.edit(`***\`${role.name}\` est déjà dans l'autorole***`);
                if (!['humain', 'bot', 'all'].includes(args[2])) return message.edit(`> ***Veuillez choisir un type valide***\n${['humain', 'bot', 'all'].map(r => `- ${r}`).join('\n')}`);
                
                client.db.autorole.push({
                    id: role.id,
                    guildId: role.guild.id,
                    type: args[2]
                });
                client.save();

                message.edit(`***Le rôle \`${role.name}\` a été ajouté à l'autorole***`);
                break;

            case 'del':
                if (!role || !args[1]) return message.edit(`***Aucun rôle de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                if (!client.db.autorole.find(c => c.id == role.id)) return message.edit(`***\`${role.name}\` n'est pas dans l'autorole***`);

                client.db.autorole = client.db.autorole.filter(c => c.id !== role.id);
                client.save();

                message.edit(`***Le rôle \`${role.name}\` a été retiré de l'autorole***`);
                break;

            case 'clear':
                if (client.db.autorole.length == 0) return message.edit("***Vous n'avez aucun rôle dans l'autorole***");
                
                client.db.autorole = [];
                client.save();

                message.edit("***L'autorole a été supprimée***");
                break

            default:
                const datas = client.db.autorole.filter(c => c.guildId == message.guildId);
                if (!datas || datas.length == 0) return message.edit("***Vous n'avez aucun autorole dans ce serveur***");

                message.edit(`> ***Autorole du serveur \`${message.guild.name}\`***\n${datas.map(r => `- <@&${r.id}> (\`${r.type}\`)`).join('\n')}`);
                break;
        }
    }
};