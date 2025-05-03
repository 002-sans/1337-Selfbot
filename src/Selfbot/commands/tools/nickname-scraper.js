const { Client, Message } = require("discord.js-selfbot-v13");


module.exports = {
    name: "nickname-scraper",
    description: "Affiche les membres ayant un pseudo à 2/3 lettres",
    usage: "[guildId]",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const nicknames = [];
        const guild = client.guilds.cache.get(args[0]) || message.guild;
        if (!guild) return message.edit(`***Aucun serveur de ttrouvé pour \`${args[0] ?? 'rien'}\`***`);

        await guild.members.fetch().catch(() => false);                
        await message.edit(`***Recherche de pseudo rare sur \`${guild.members.cache.size}\` membres***`);
                
        const promise = guild.members.cache.map(async (member) => {
            if (member.user.username.length <= 3) nicknames.push(`${member} - ${member.user.username}`);       
        });

        await Promise.all(promise);
        if (message.deletable) message.delete();
        client.send(message, nicknames.length > 0 ? `> ***\`${nicknames.length}\` pseudos trouvés***\n${nicknames.join('\n')}` : "***Aucun pseudo rare trouvé***");
    }
};