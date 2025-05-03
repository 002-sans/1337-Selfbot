const { Client, Message, BitField } = require("discord.js-selfbot-v13");


module.exports = {
    name: "userinfo",
    description: "Affiche les informations d'un utilisateur",
    aliases: [ 'ui' ],
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
        message.edit(`> ***Informations sur \`${user.displayName}\`***\n- \`Utilisateur\`・${user} (\`${user.username}\` | \`${user.id}\`)\n- \`Date de création\`・<t:${Math.round(user.createdTimestamp / 1000)}:f> (<t:${Math.round(user.createdTimestamp / 1000)}:R>)\n- \`Jours depuis la création\`・${Math.floor((Date.now() - user.createdAt) / 1000 / 60 / 60 / 24)}\n- \`Bot\`・${user.bot ? "Oui" : "Non"}\n- \`Serveurs en communs\`・${client.guilds.cache.filter(g => g.members.cache.has(user.id)).size}\n- \`Groupes en communs\`・${client.channels.cache.filter(c => c.type === "GROUP_DM" && c.recipients.has(user.id)).size}\n- \`Clan\`・${user.clan ? user.clan.tag : "Non"}\n- \`Avatar\`・${user.avatar ? `[Lien avatar](${user.avatarURL({ dynamic: true, size: 4096 })})` : 'Aucune'}\n- \`Bannière\`・${user.banner ? `[Lien bannière](${user.bannerURL({ dynamic: true, size: 4096 })})` : 'Aucune'}\n- \`Décoration\`・${user.avatarDecorationData ? `[Lien avatar](${user.avatarDecorationURL({ size: 4096 })})` : 'Aucune'}`)
    }
}