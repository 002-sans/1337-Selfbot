const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "sync",
    description: "Synchronise les permissions des salons",
    dir: "gestion",
    premium: true,
    usage: "<catégorie/salon/all> [salon]",
    permission: 'MANAGE_CHANNELS',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || await message.guild.channels.fetch(args[0]).catch(() => false);

        switch(true){
            case args[0] === 'all':
                message.guild.channels.cache.filter(c => c.type !== "GUILD_CATEGORY" && c.parentId).forEach(channel => channel.lockPermissions().catch(() => false))
                message.edit("***Synchronisation de tous les salons du serveur terminé***")
                break;

            case args[0] && channel?.type === "GUILD_CATEGORY":
                channel.children.forEach((children) => {
                    children.lockPermissions().catch(() => false)
                })

                message.edit(`***Synchronisation des salons de \`${channel.name}\` terminée***`)
                break;

            default:
                if (!channel) channel = message.channel;
                
                channel.lockPermissions()
                  .then( () => message.edit(`***Synchronisation du salon \`${channel.name}\` terminée***`))
                  .catch(() => message.edit(`***Impossible de synchroniser le salon \`${channel.name}\`***`));
                break;
        }
    }
};