const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "messageDelete",
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        if (!client.db.logger.message || message.channel.type !== "DM" || !message.author || message.author.id == client.user.id) return;

        const embed = {
            color: 0xFF0000,
            description: `> ***Un message privé a été supprime***\n- \`Salon\`・${message.channel}\n- \`Auteur\`・${message.author} (\`${message.author.username}\` | \`${message.author.id}\`)\n- \`Contenu\`・${message.content ?? 'Aucun message'}\n- \`Images\`・${message.attachments.size > 0 ? message.attachments.map((r, i) => `[Image ${i+1}](${r.url})`).join('\n') : 'Aucune Image'}\n- \`Message Envoyé\`・<t:${Math.round(message.createdTimestamp / 1000)}:R>`
        }

        await fetch(client.db.logger.message, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }), method: 'POST' }).catch(() => false);
    }
}