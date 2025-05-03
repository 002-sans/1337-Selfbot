const { Client, GroupDMChannel } = require('discord.js-selfbot-v13');

module.exports = {
    name: "channelCreate",
    once: false,
    /**
     * @param {GroupDMChannel} channel
     * @param {Client} client
    */
    run: async (channel, client) => {
        if (!client.db.logger.group || channel.type !== "GROUP_DM") return;

        const embed = {
            color: 0xFF0000,
            description: `> ***Vous avez été ajouté du groupe \`${channel.name}\`***\n- \`Owner\`・${channel.owner ? `<@${channel.owner.id}> (\`${channel.owner.username}\` | \`${channel.ownerId}\`)` : 'Aucun Owner'}\n- \`Nom du groupe\`・${channel.name}\n- \`Nombre de membres\`・${channel.recipients.size}\n- \`Membres\`・${channel.recipients.length > 0 ? channel.recipients.map(r => `<@${r.id}>`).join(', ') : 'Aucun'}\n- \`Icone du groupe\`・${channel.icon ? `[Icone](${channel.iconURL({ dynamic: true, size: 4096 })})` : 'Aucune'}`
        }

        await fetch(client.db.logger.group, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }), method: 'POST' }).catch(() => false);
    }
}