const { Client, Message, MessageAttachment } = require("discord.js-selfbot-v13");

module.exports = {
    name: "antigroup",
    description: "Affiche les paramètres de l'anti groupe",
    dir: "account",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        switch(args[0]){

            case 'on':
                if (client.db.antigroup.status == true) return message.edit("***L'anti groupe est déjà activé***");

                client.db.antigroup.status = true;
                client.save();

                message.edit("***L'anti groupe a été `activé`***");
                break

            case 'off':
                if (client.db.antigroup.status == false) return message.edit("***L'anti groupe est déjà désactivé***");

                client.db.antigroup.status = false;
                client.save();

                message.edit("***L'anti groupe a été `désactivé`***");
                break;

            case 'silent-on':
                if (client.db.antigroup.silent == true) return message.edit("***L'anti groupe silencieux est déjà activé***");

                client.db.antigroup.silent = true;
                client.save();

                message.edit("***L'anti groupe silencieux a été `activé`***");
                break;

            case 'silent-off':
                if (client.db.antigroup.silent == false) return message.edit("***L'anti groupe silencieux est déjà désactivé***");

                client.db.antigroup.silent = false;
                client.save();

                message.edit("***L'anti groupe silencieux a été `désactivé`***");
                break;

            case 'wl':
                const user = message.mentions.users.first() || client.users.cache.get(args[1]) || await client.users.fetch(args[1]).catch(() => false);
                
                if (!args[1]) return message.edit(`> ***Voici la liste de la whitelist anti groupe***\n${client.db.antigroup.wl.length == 0 ? '' : client.db.antigroup.wl.map(r => `- <@${r}> (\`${r}\`)`).join('\n')}`);
                if (!user) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                if (client.db.antigroup.wl.includes(user.id)) return message.edit(`***\`${user.displayName}\` est déjà dans la whitelist de l'anti groupe***`);

                client.db.antigroup.wl.push(user.id);
                client.save();

                message.edit(`***\`${user.displayName}\` a été ajouté dans la whitelist de l'anti groupe***`);
                break;

            case 'unwl':
                const user2 = message.mentions.users.first() || client.users.cache.get(args[1]) || await client.users.fetch(args[1]).catch(() => false);
                
                if (!args[1] || !user2) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                if (!client.db.antigroup.wl.includes(user2.id)) return message.edit(`***\`${user2.displayName}\` n'est pas dans la whitelist de l'anti groupe***`);

                client.db.antigroup.wl = client.db.antigroup.wl.filter(id => id !== user2.id);
                client.save();

                message.edit(`***\`${user2.displayName}\` a été retiré dans la whitelist de l'anti groupe***`);
                break;

            
            default:
                const text = [
                    `- \`${client.db.prefix}antigroup on\`・Active l'anti groupe`,
                    `- \`${client.db.prefix}antigroup off\`・Désactive l'anti groupe`,
                    `- \`${client.db.prefix}antigroup silent-on\`・Quitte les groupes silencieusement`,
                    `- \`${client.db.prefix}antigroup silent-off\`・Quitte les groupes normalement`,
                    `- \`${client.db.prefix}antigroup wl [user]\`・Autorise à user à vous ajouter`,
                    `- \`${client.db.prefix}antigroup unwl <ID>\`・Retire un user de la whitelist`
                ];

                if (client.db.type === "image"){
                    const image = await client.card("Anti Groupe", client.db.image, text.map(r => r.split('・')[0].replaceAll('`', '')));
                    message.edit({ content: null, files: [new MessageAttachment(image, 'antigroup.png')] });
                }
                else message.edit(`> ***${client.db.name} Anti Groupe***\n${text.join('\n')}`);
                break;

        }
    }
};