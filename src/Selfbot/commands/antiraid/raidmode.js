const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "raidmode",
    description: "Active/désactive les invitations du serveur",
    dir: "antiraid",
    premium: true,
    permission: "MANAGE_GUILD",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild.features.includes('COMMUNITY'))
            return message.channel.send("***Veuillez activer la `communauté du serveur` pour profiter de cette commande***");

        if (message.guild.features.includes('INVITES_DISABLED')){
            message.guild.disableInvites(false)
            message.channel.send("***Les invitations du serveur ne sont plus en pause***")
        }
        else {
            message.guild.disableInvites(true)
            message.channel.send("***Les invitations du serveur ont été mise en pause***")
        }
    }
};