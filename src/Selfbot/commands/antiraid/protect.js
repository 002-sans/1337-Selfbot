const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "protect",
    description: "Active/désactive la protection d'un serveur",
    dir: "antiraid",
    usage: "<server_id>",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const guild = client.guilds.cache.get(args[0]) || message.guild;
        if (!guild) return message.edit(`****Aucun serveur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        if (client.db.antiraid.protected.includes(guild.id)){
            client.db.antiraid.protected = client.db.antiraid.protected.filter(c => c !== guild.id);
            message.edit(`***Le serveur \`${guild.name}\` n'est plus protégé***`);
        }
        else {
            client.db.antiraid.protected.push(guild.id);
            message.edit(`***Vous protégez maintenant le serveur \`${guild.name}\`***`);
        }

        client.save();
    }
};