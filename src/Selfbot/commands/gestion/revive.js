const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "revive",
    description: "Retire un utilisateur de la blacklist + déban de tous les serveurs",
    dir: "gestion",
    premium: true,
    usage: "<user>",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);

        if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!client.db.bl.find(c => c.id === user.id)) return message.edit(`***\`${user.displayName}\` n'est pas blacklist***`);

        client.db.bl = client.db.bl.filter(c => c.id !== user.id);
        client.save();

        
        message.edit(`***Débannissement de \`${user.globalName}\` en cours...***`)

        let unban = 0;
        const guilds = client.guilds.cache.filter(guild => guild.members.me.permissions.has('BAN_MEMBERS'));
        const banPromises = guilds.map(async guild => {
            try {
                await guild.bans.remove(user);
                unban++;
            } catch { false }
        });

        await Promise.all(banPromises);

                
        message.edit(`***\`${user.globalName}\` a été retiré de la blacklist\nIl a été débanni de \`${unban}\` serveurs***`);
    }
};


function arrayDiviser(array) {
    let result = [];
    for (let i = 0; i < array.length; i += 20) {
        result.push(array.slice(i, i + 20));
    }
    return result;
}