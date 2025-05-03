const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "all-rename",
    description: "Modifie le pseudo des membres du serveur",
    permissions: "MANAGE_NICKNAMES",
    usage: "[pseudo]",
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()
        for (const member of message.guild.members.cache.map(r => r)){
            try {
                member.setNickname(args[0] ? args.join(' ') : null);
                await client.sleep(1000);
            } catch { false }
        }
    }
};