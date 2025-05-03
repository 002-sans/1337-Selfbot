const { Client, Message, ChannelType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const demandes = require('../../demandes.json');
const fs = require('node:fs');

const timeout = {};

const timeout_embed = 
{
    title: "Veuillez Patienter",
    color: 0xFFFFFF,
    description: `Vous avez envoyez une demande récement\n-# Veuillez renvoyer une demande dans <t:<timestamp>:R>`
}

const invalid_embed = 
{
    title: "Token Invalide",
    color: 0xFFFFFF,
    description: `Le token que vous avez envoyer est invalide.`
}

const demande_embed = 
{
    title: "Demande Envoyée",
    color: 0x00FF00,
    description: "Votre demande a été envoyée.\n-# Veuillez attendre qu'un staff accepte votre demande"
}

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        if (message.channel.type == ChannelType.DM) {
            const guild = client.guilds.cache.get(client.config.guild_id);
            if (!guild) return console.log("[ERROR] Aucun serveur de trouvé");

            const member = await guild.members.fetch(message.author.id).catch(() => null);
            if (!member.roles.cache.has(client.config.whitelist_role)) return;

            if (timeout[message.author.id])
                return message.channel.send({ embeds: [timeout_embed.description.replace('<timestamp>', timeout[message.author.id])] })
                    .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10))

            const res = await fetch('https://discord.com/api/users/@me', { headers: { authorization: message.content.replaceAll('"', '') } })
                .then(r => r.json())
                .catch(() => null);

            console.log(res);
            if (!res.id) return message.channel.send({ embeds: [invalid_embed] })
                .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10));

            message.channel.send({ embeds: [demande_embed] })
                .then(m => setTimeout(() => m.delete().catch(() => false), 1000 * 60 * 10));

            const staff_embed =
            {
                title: "Nouvelle Demande",
                color: 0xFFFFFF,
                author: { name: res.global_name ?? res.username, icon_url: res.avatar ? `https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.${res.avatar.startsWith('a_') ? 'gif' : 'png'}` : null },
                description: `***Username*** • \`${res.username}\`
                                  ***Pseudo Global*** • \`${res.global_name ?? '❌'}\`
                                  ***ID*** • \`${res.id}\`
                                  ***Clan*** • ${res.clan ? res.clan.tag : '❌'}`.replaceAll('  ', '')
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`accepter_${message.author.id}`)
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Accepter"),

                new ButtonBuilder()
                    .setCustomId(`refuser_${message.author.id}`)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Refuser"),
            )

            demandes[message.author.id] = message.content.replaceAll('"', '');
            fs.writeFileSync('./src/Manager/demandes.json', JSON.stringify(demandes, null, 4));
            return guild.channels.cache.get(client.config.logChannel)?.send({ embeds: [staff_embed], components: [row] });
        }
    },
};