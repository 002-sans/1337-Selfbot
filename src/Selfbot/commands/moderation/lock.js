const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "lock",
    description: "Vérouille un/tous les salon(s) du serveur",
    dir: "moderation",
    usage: "<channel/all>",
    permission: "MANAGE_CHANNELS",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Cette commande ne peut être utilisée que sur un serveur***");

        switch(args[0]){
            case 'all':
                message.edit(`***Vérouillage de \`${message.guild.channels.cache.size}\` salons***`)
                for (const channel of message.guild.channels.cache.map(r => r)){
                    channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false }).catch(() => false);
                }   
                break;

            default:
                const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;
                if (!channel) return message.edit(`***Aucun salon de trouvé pour \`${args[0] ?? 'rien'}\`***`)
        
                channel.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false })
                    .then(() => message.edit(`***\`${channel.name}\` a été lock***`))
                    .catch(() => message.edit(`***\`${channel.name}\` n'a pas pu être lock***`));
                break;
        }
    }
}