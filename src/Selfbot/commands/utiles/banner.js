const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "banner",
    description: "Affiche la bannière d'un utilisateur",
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

        await user.fetch().catch(() => false);
        if (!user.banner) return message.edit(`***\`${user.displayName}\` n'a pas de bannière***`)
        
        message.edit(`> ***Voici la bannière de \`${user.displayName}\`***\n- [Lien PNG](<${user.bannerURL({ format: "png", size: 4096 })}>)\n- [Lien JPG](<${user.bannerURL({ format: "jpg", size: 4096 })}>)\n- [Lien WEBP/GIF](${user.bannerURL({ dynamic: true, size: 4096 })})`);
    }
};