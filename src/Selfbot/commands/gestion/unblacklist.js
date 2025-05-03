const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "unblacklist",
    description: "Retire un utilisateur de la blacklist",
    dir: "gestion",
    premium: true,
    aliases: [ 'unbl' ],
    usage: "<user>",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);

        switch(args[0]){
            case 'all':
                if (client.db.bl.length == 0) return message.edit("***Il n'y a aucun utilisateur de blacklist***");

                client.db.bl = [];
                client.save();

                message.edit("***Tous les utilisateurs ont été retiré de la blacklist***");
                break;

            default:
                if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);
                if (!client.db.bl.find(c => c.id === user.id)) return message.edit(`***\`${user.displayName}\` n'est pas blacklist***`);

                client.db.bl = client.db.bl.filter(c => c.id !== user.id);
                client.save();
                
                message.edit(`***\`${user.globalName}\` a été retiré de la blacklist***`);
                break;
        }
    }
};


function arrayDiviser(array) {
    let result = [];
    for (let i = 0; i < array.length; i += 20) {
        result.push(array.slice(i, i + 20));
    }
    return result;
}