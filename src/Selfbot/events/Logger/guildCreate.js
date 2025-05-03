const { Client, Guild } = require('discord.js-selfbot-v13');

module.exports = {
    name: "guildCreate",
    once: false,
    /**
     * @param {Guild} guild
     * @param {Client} client
    */
    run: async (guild, client) => {
        if (client.db.automute) 
            await fetch(`https://discord.com/api/v9/users/@me/guilds/${guild.id}/settings`, {
                method: 'PATCH',
                headers: { 'Authorization': client.token, 'Content-Type': 'application/json' },
                body: JSON.stringify({ muted: true, suppress_roles: true, suppress_everyone: true }) 
            });

        if (!client.db.logger.guild) return;

        const embed = {
            color: 0xFF0000,
            description: `> ***Vous avez été rejoint le serveur \`${guild.name}\`***\n- \`Owner\`・<@${guild.ownerId}>\n- \`Nombre de membres\`・${guild.memberCount}\n- \`Nombre de salons\`・${guild.channels.cache.size}`,
            thumbnail: { url: guild.icon ? guild.iconURL({ dynamic: true }) : null },
            image: { url: guild.banner ? guild.bannerURL({ size: 4096 }) : guild.splash ? guild.splashURL({ size: 4096 }) : null }
        }

        await fetch(client.db.logger.guild, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }), method: 'POST' }).catch(() => false);
    }
}