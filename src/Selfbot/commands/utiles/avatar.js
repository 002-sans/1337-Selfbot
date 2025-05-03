const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "avatar",
    description: "Affiche l'avatar d'un utilisateur",
    aliases: [ 'pic' ],
    usage: "[user]",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        let user = message.mentions.users.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);
        if (!args[0] || !user) user = client.user;

        if (!user.avatar) return message.edit(`***\`${user.displayName}\` n'a pas d'avatar***`)
        message.edit(`> ***Voici l'avatar de \`${user.displayName}\`***\n- [Lien PNG](<${user.avatarURL({ format: "png", size: 4096 })}>)\n- [Lien JPG](<${user.avatarURL({ format: "jpg", size: 4096 })}>)\n- [Lien WEBP/GIF](${user.avatarURL({ dynamic: true, size: 4096 })})`);
    }
};