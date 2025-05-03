const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "tempvoc",
    description: "Crée une tempvocs sur le serveur",
    dir: "gestion",
    premium: true,
    permission: 'MANAGE_CHANNELS',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        if (!client.db.tempvoc.find(c => c.guildId === message.guildId)){
            client.db.tempvoc.push({ guildId: message.guildId, enable: true, channel: null, category: null, name: `🔊・<user>` });
            client.save();
        }

        const data = client.db.tempvoc.find(c => c.guildId === message.guildId);

        switch(args[0]){
            default:
                const text = [
                    `- \`${client.db.prefix}tempvoc on\`・Active le tempvoc du serveur`,
                    `- \`${client.db.prefix}tempvoc off\`・Désactive le tempvoc du serveur`,
                    `- \`${client.db.prefix}tempvoc show\`・Affiche le tempvoc du serveur`,
                    `- \`${client.db.prefix}tempvoc name <text>\`・Modifie le nom du salon crée (<user> = pseudo)`,
                    `- \`${client.db.prefix}tempvoc channel <ID>\`・Défini le salon à rejoindre`,
                    `- \`${client.db.prefix}tempvoc category [ID]\`・Défini la catégories où seront les salons`,
                ];

                if (client.db.type === "image"){
                    const image = await client.card("TempVoc", client.db.image, text.map(r => r.split('・')[0].replaceAll('`', '')));
                    message.edit({ content: null, files: [new MessageAttachment(image, 'antigroup.png')] });
                }
                else message.edit(`> ***${client.db.name} TempVoc***\n${text.join('\n')}`);
                break;

                case 'on':
                    if (data.enable) return message.edit("***Le tempvoc de ce serveur est déjà activé***");
                    
                    data.enable = true;
                    client.save();

                    message.edit("***Le tempvoc du erveur a été `activé`***");
                    break;

                case 'off':
                    if (!data.enable) return message.edit("***Le tempvoc de ce serveur est déjà désactivé***");

                    data.enable = false;
                    client.save();

                    message.edit('***Le tempvoc du serveur a été `désactivé`***');
                    break;

                case 'show':
                    return message.edit(`> ***Tempvoc de \`${message.guild.name}\`***\n- \`Activé\`・${data.enable ? 'Oui' : 'Non'}\n- \`Salon\`・${message.guild.channels.cache.get(data.channel) ?? 'Aucun'}\n- \`Catégorie\`・${message.guild.channels.cache.get(data.category) ?? 'Aucun'}\n- \`Nom du salon\`・${data.name.replace('<user>', message.author.displayName)}`);

                case 'channel':
                    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => false);
                    if (!channel || !args[1]) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                    if (!['GUILD_STAGE_VOICE', 'GUILD_VOICE'].includes(channel.type)) return message.edit(`***Le salon \`${channel.name}\` n'est pas un salon vocal***`);

                    data.channel = channel.id;
                    client.save();

                    message.edit(`***Le salon \`${channel.name}\` est le salon à rejoindre pour crée un salon vocal***`);
                    break;

                case 'name':
                    if (!args[1]) return message.edit('***Veuillez entrer un texte valide***');
                    
                    data.message = args.slice(1).join(' ');
                    client.save();

                    message.edit(`***Les noms de salons seront \`${args.slice(1).join(' ').replace('<user>', message.author.displayName)}\`***`);
                    break;

                case 'category':
                    if (!args[1]){
                        data.category = null;
                        client.save();

                        return message.edit(`***La catégorie a été supprimées des tempvocs***`);
                    }
                    else {
                        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || await message.guild.channels.fetch(args[1]).catch(() => false);
                        if (!channel) return message.edit(`***Aucun salon de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                        if (channel.type !== "GUILD_CATEGORY") return message.edit(`***Le salon \`${channel.name}\` n'est pas une catégorie valide***`)

                        data.category = channel.id;
                        client.save();
    
                        message.edit(`***Le salon \`${channel.name}\` est le salon à rejoindre pour crée un salon vocal***`);
                    }
                    break;
        }
    }
};