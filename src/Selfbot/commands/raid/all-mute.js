const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "all-mute",
    description: "Timeout tous les membres du serveur",
    permissions: "MODERATE_MEMBERS",
    usage: "[off]",
    dir: "raid",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser cette commande dans un serveur***");
        
        if (message.deletable) message.delete()
        for (const member of message.guild.members.cache.filter(m => m.moderatable).map(r => r)){
            try {
                member.setNickname(args[0] == "off" ? 0 : 1000 * 60 * 60 * 24 * 28);
                await client.sleep(1000);
            } catch { false }
        }
    }
};