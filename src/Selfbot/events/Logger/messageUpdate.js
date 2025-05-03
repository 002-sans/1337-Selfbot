const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "messageUpdate",
    once: false,
    /**
     * @param {Message} oldMessage
     * @param {Message} newMessage
     * @param {Client} client
    */
    run: async (oldMessage, newMessage, client) => {
        if (!client.db.logger.message || oldMessage.channel.type !== "DM" || !oldMessage.author || !newMessage.author || oldMessage.author.id == client.user.id) return;

        const embed = {
            color: 0xFF0000,
            description: `> ***Un message privé a été modifié***\n- \`Salon\`・${oldMessage.channel}\n- \`Auteur\`・${oldMessage.author} (\`${oldMessage.author.username}\` | \`${oldMessage.author.id}\`)\n- \`Ancien Message\`・${oldMessage.content ?? 'Aucun message'}\n- \`Nouveau Message\`・${newMessage.content ?? 'Aucun Mmessage'}\n- \`Anciennes Images\`・${oldMessage.attachments.size > 0 ? oldMessage.attachments.map((r, i) => `[Image ${i+1}](${r.url})`).join('\n') : 'Aucune Image'}\n- \`Nouvelles Images\`・${newMessage.attachments.size > 0 ? newMessage.attachments.map((r, i) => `[Image ${i+1}](${r.url})`).join('\n') : 'Aucune Image'}\n- \`Message Envoyé\`・<t:${Math.round(oldMessage.createdTimestamp / 1000)}:R>\n- \`Message Modifié\`・<t:${Math.round(newMessage.createdTimestamp / 1000)}:R>`
        }

        await fetch(client.db.logger.message, { headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ embeds: [embed] }), method: 'POST' }).catch(() => false);
    }
}