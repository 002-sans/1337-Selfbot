const { Client, Message, Util } = require('discord.js-selfbot-v13');

module.exports = {
    name: "steal-emojis",
    description: "Vole un emoji/tous les emojis d'un serveur",
    permission: "MANAGE_EMOJIS_AND_STICKERS",
    usage: "<serverID>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.inGuild()) return message.edit("***Veuillez utiliser cette commande dans un serveur***");

        switch(args[0]){
            default: 
                const parsedEmoji = Util.parseEmoji(args[0])
                if (!parsedEmoji.id) return message.edit(`***Aucun emoji n'a été trouvé pour \`${args[0] ?? 'rien'}\`***`);

                message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${parsedEmoji.id + parsedEmoji.animated ? ".gif" : ".png"}`, parsedEmoji.name)
                    .then( () => message.edit(`***L'emoji \`${parsedEmoji.name}\` a été ajouté au serveur***`))
                    .catch(() => message.edit(`***L'emoji \`${parsedEmoji.name}\` n'a pas pu être ajouter au serveur***`))
                break;

            case 'all':
                const guild = client.guilds.cache.get(args[1]);
                if (!guild) return message.edit(`***Aucun serveur de trouvé pour \`${args[1] ?? 'rien'}\`***`);

                message.edit(`***Je suis en train d'ajouter \`${guild.emojis.cache.size}\` emojis***`);;
                for (const emoji of guild.emojis.cache.map(r => r))
                    message.guild.emojis.create(emoji.url, emoji.name).catch(() => false);

                if (message.editable) message.edit(`***${guild.emojis.cache.size} emojis ont été ajoutés au serveur***`);
                break;                    
        }
    }
}