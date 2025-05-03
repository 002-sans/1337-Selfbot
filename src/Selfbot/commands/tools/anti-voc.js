const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "anti-voc",
    description: "Déconnecte un membre qui rejoint un salon vocal",
    usage: "<user>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);
        if (!user || !args[0]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        if (client.db.antivoc.includes(user.id)){
            client.db.antivoc = client.db.antivoc.filter(i => i !== user.id);
            client.save();
            message.edit(`***\`${user.displayName}\` a été retiré de l'anti voc***`)
        }
        else {
            client.db.antivoc.push(user.id)
            client.save()
            message.edit(`***\`${user.displayName}\` a été ajouté à l'anti voc***`)
        }
    }
};