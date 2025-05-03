const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "soutiens",
    description: "Gère les rôles donnés grâce au status",
    dir: "gestion",
    premium: true,
    permission: 'MANAGE_ROLES',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        if (!client.db.soutien.find(c => c.guildId === message.guildId)){
            client.db.soutien.push({ guildId: message.guildId, enable: true, role: null, message: null, only: true });
            client.save();
        }

        const data = client.db.soutien.find(c => c.guildId === message.guildId);

        switch(args[0]){
            default:
                const text = [
                    `- \`${client.db.prefix}soutiens on\`・Active le soutiens du serveur`,
                    `- \`${client.db.prefix}soutiens off\`・Désactive le soutiens du serveur`,
                    `- \`${client.db.prefix}soutiens show\`・Affiche le soutiens du serveur`,
                    `- \`${client.db.prefix}soutiens role <role>\`・Défini le rôle du soutiens`,
                    `- \`${client.db.prefix}soutiens text <text>\`・Défini le status à avoir`,
                    `- \`${client.db.prefix}soutiens only <on/off>\`・Le statut ne doit rien contenir d'autre`
                ];

                if (client.db.type === "image"){
                    const image = await client.card("Soutiens", client.db.image, text.map(r => r.split('・')[0].replaceAll('`', '')));
                    message.edit({ content: null, files: [new MessageAttachment(image, 'antigroup.png')] });
                }
                else message.edit(`> ***${client.db.name} Soutiens***\n${text.join('\n')}`);
                break;

                case 'on':
                    if (data.enable) return message.edit("***Le soutiens de ce serveur est déjà activé***");
                    
                    data.enable = true;
                    client.save();

                    message.edit("***Le soutiens du erveur a été `activé`***");
                    break;

                case 'off':
                    if (!data.enable) return message.edit("***Le soutiens de ce serveur est déjà désactivé***");

                    data.enable = false;
                    client.save();

                    message.edit('***Le soutiens du serveur a été `désactivé`***');
                    break;

                case 'show':
                    return message.edit(`> ***Soutiens de \`${message.guild.name}\`***\n- \`Activé\`・${data.enable ? 'Oui' : 'Non'}\n- \`Rôle\`・${message.guild.roles.cache.get(data.role) ?? 'Aucun'}\n- \`Texte\`・${data.message ?? 'Aucun'}\n- \`Contient uniquement ce texte\`・${data.only ? 'Oui' : 'Non'}`);

                case 'role':
                    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || await message.guild.roles.fetch(args[1]).catch(() => false);
                    if (!role || !args[1]) return message.edit(`***Aucun rôle de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                    if (!role.editable) return message.edit("***Vous n'avez pas la permission de gérer ce rôle***");

                    data.role = role.id;
                    client.save();

                    message.edit(`***Le rôle \`${role.name}\` est le nouveau rôle du soutiens***`);
                    break;

                case 'text':
                    if (!args[1]) return message.edit('***Veuillez entrer un texte valide***');
                    
                    data.message = args.slice(1).join(' ');
                    client.save();

                    message.edit(`***Le nouveau texte du soutiens \`${args.slice(1).join(' ')}\`***`);
                    break;

                case 'only':
                    if (!['on', 'off'].includes(args[1])) return message.edit(`***Paramètre manquant: \`on\`/\`off\`***`);

                    data.only = args[1] == 'on' ? true : false;
                    client.save();

                    message.edit(`***Le soutiens only a été \`${args[1] == 'on' ? 'activé' : 'désactivé'}\`***`);
                    break;
        }
    }
};