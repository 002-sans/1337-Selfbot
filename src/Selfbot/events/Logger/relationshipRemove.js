const { Client, SnowflakeUtil } = require('discord.js-selfbot-v13');

module.exports = {
    name: "relationshipRemove",
    once: false,
    /**
     * @param {SnowflakeUtil} user
     * @param {string[]} type
     * @param {string | null} nickname
     * @param {Client} client
    */
    run: async (userId, type, nickname, client) => {
        if (!client.db.logger.friend || type !== "FRIEND") return;

        const user = client.users.cache.get(userId) || await client.users.fetch(userId).catch(() => false);
        if (!user?.id) return;

        const embed = {
            color: 0xFF0000,
            description: `> ***Un ami vous a supprimé***\n- \`Utilisateur\`・${user} (\`${user.username}\` | \`${user.id}\`)\n- \`Date de création\`・<t:${Math.round(user.createdTimestamp / 1000)}:R>\n- \`Jours depuis la création\`・${Math.floor((Date.now() - user.createdAt) / 1000 / 60 / 60 / 24)}\n- \`Serveurs en commun\`・${client.guilds.cache.filter(g => g.members.cache.has(user.id)).size}\n- \`Groupes en commun\`・${client.channels.cache.filter(c => c.type == 'GROUP_DM' && c.recipients.has(user.id)).size}\n- \`CLAN\`・${user.clan ? user.clan.tag : 'Aucun'}\n- \`Avatar\`・${user.avatar ? `[Avatar](${user.avatarURL({ dynamic: true, size: 4096 })})` : 'Aucune'}\n- \`Bannière\`・${user.banner ? `[Bannière](${user.bannerURL({ dynamic: true, size: 4096 })})` : 'Aucune'}\n- \`Décoration\`・${user.avatarDecorationData ? `[Décoration](${user.avatarDecorationURL({ dynamic: true, size: 4096 })})` : 'Aucune'}`
        }

        await fetch(client.db.logger.friend, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }), method: 'POST' }).catch(() => false);
    }
}