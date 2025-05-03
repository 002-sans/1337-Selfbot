const { Client, Guild } = require('discord.js-selfbot-v13');

module.exports = {
    name: "guildDelete",
    once: false,
    /**
     * @param {Guild} guild
     * @param {Client} client
    */
    run: async (guild, client) => {
        if (!client.db.logger.guild) return;

        const embed = {
            color: 0xFF0000,
            description: `> ***Vous avez été quitté le serveur \`${guild.name}\`***\n- \`Owner\`・<@${guild.ownerId}>\n- \`Nombre de membres\`・${guild.memberCount}\n- \`Nombre de salons\`・${guild.channels.cache.size}`,
            thumbnail: { url: guild.icon ? guild.iconURL({ dynamic: true }) : null },
            image: { url: guild.banner ? guild.bannerURL({ size: 4096 }) : guild.splash ? guild.splashURL({ size: 4096 }) : null }
        }

        await fetch(client.db.logger.guild, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }), method: 'POST' }).catch(() => false);
    }
}