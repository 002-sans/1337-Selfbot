const { Client, Message } = require("discord.js-selfbot-v13");
const api = `http://167.114.48.55:1337/prevnames/`

module.exports = {
    name: "prevnames",
    description: "Affiche les anciens pseudos d'un utilisateur",
    aliases: [ 'prevname' ],
    usage: "[user]",
    premium: true,
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        let user = message.mentions.users.first() ||client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false);
        if (!user || !args[0]) user = message.author;

        const res = await fetch(api + user.id).then(r => r.json()).catch(() => false);
        const sorted = Object.entries(res)
            .sort((a, b) => b[1] - a[1])
            .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

        if (Object.keys(sorted).length == 0) return message.edit(`***\`${user.displayName}\` n'a pas d'ancien pseudo***`);
        message.edit(`> ***Voici les anciens pseudos de \`${user.displayName}\`***\n${Object.keys(sorted).map((r) => `- <t:${res[r]}:R> ・ **${r}**`).join('\n')}`);
    }
}