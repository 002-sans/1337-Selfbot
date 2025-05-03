const { SlashCommandBuilder, Client, Message, ModalBuilder, TextInputBuilder, TextInputStyle, ChatInputCommandInteraction, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const buyers = require('../../buyers.json');
const fs = require('node:fs');

const images = [
    "https://i.imgur.com/OAIzyst.png",
    "https://i.imgur.com/AggmAAK.png",
    "https://i.imgur.com/muL1icZ.png",
    "https://i.imgur.com/RVXHU80.png"
];

module.exports =
{
    name: "info",
    description: "Afficher les informations de votre machine.",
    aliases: [],
    guildOwnerOnly: false,
    botOwnerOnly: false,
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
    */
    async executeSlash(client, interaction)
    {
        if (!buyers[interaction.user.id])
            return interaction.reply({ content: `Vous n'avez pas de machine. Veuillez crée un ticket pour plus d'informations`, flags: 64 });

        let db;
        const embed = 
        {
            color: 0x000000,
            author: { name: `Abonnement de ${interaction.user.displayName}`, icon_url: interaction.user.avatarURL() },
            description: `- Etat: \`${buyers[interaction.user.id].enable ? '✅' : '❌'}\`\n- Expiration: **<t:${Math.round(buyers[interaction.user.id].expiration / 1000)}:R>**`,
            thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
            image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
        };

        if (fs.existsSync(`./utils/db/${interaction.user.id}.json`))
            db = require(`../../../../utils/db/${interaction.user.id}.json`)

        if (db) embed.description += `\n- Prefix: \`${db.prefix}\`\n- Machine: \`${db.name}\``;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(clients[interaction.user.id] ? 'shutdown' : 'start')
                .setStyle(clients[interaction.user.id] ? ButtonStyle.Danger : ButtonStyle.Success)
                .setLabel(clients[interaction.user.id] ? 'Arrêter' : 'Démarrer')
                .setDisabled(buyers[interaction.user.id].expiration > Date.now() ? false : true),

            new ButtonBuilder()
                .setCustomId('restart')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Redémarrer')
                .setDisabled(clients[interaction.user.id] && buyers[interaction.user.id].expiration > Date.now() ? false : true),

            new ButtonBuilder()
                .setCustomId('edit-token')
                .setLabel('Modifier le token')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(clients[interaction.user.id] && buyers[interaction.user.id].expiration > Date.now() ? false : true)
        )

        const msg = await interaction.reply({ embeds: [embed], components: [row], files: [{ attachment:  images[Math.floor(Math.random()* images.length)], name: 'hex.png' }] });
        const collector = msg.createMessageComponentCollector({ time: 1000 * 60 });

        collector.on('collect', async i => 
        {
            if (i.user.id !== interaction.user.id)
                return i.reply({ content: 'Vous ne pouvez pas utiliser ce bouton', flags: 64 });

            switch(i.customId)
            {
                case 'start':
                    await i.deferReply({ flags: 64 });
                    
                    buyers[interaction.user.id].enable = true;
                    save();
                    
                    editMessage();
                    const userToken = client.config.tokens.find(t => Buffer.from(decrypt(t, 'megalovania').split('.')[0], 'base64').toString() == interaction.user.id);
                    if (userToken) loadSelfbot(decrypt(userToken, 'megalovania'));

                    i.editReply({ content: 'Votre machine a démarré' });
                    break;

                case 'shutdown':
                    i.deferUpdate();

                    buyers[interaction.user.id].enable = false;
                    save();
                    
                    clients[interaction.user.id]?.destroy();
                    delete clients[interaction.user.id];

                    editMessage();
                    break;

                case 'restart':
                    await i.deferReply({flags: 64 });

                    const tokenToRestart = client.config.tokens.find(t => Buffer.from(decrypt(t, 'megalovania').split('.')[0], 'base64').toString() == interaction.user.id);
                    if (tokenToRestart)
                    {
                        clients[interaction.user.id]?.destroy();
                        delete clients[interaction.user.id];
                        loadSelfbot(decrypt(tokenToRestart, 'megalovania'));    
                    }

                    i.editReply({ content: 'Votre machine a redémarré' });
                    break;

                case 'edit-token':
                    const modal = new ModalBuilder()
                        .setTitle("Changement de token")
                        .setCustomId('token')
                        .setComponents(
                            new ActionRowBuilder().addComponents(
                                new TextInputBuilder()
                                    .setCustomId('token')
                                    .setLabel("Veuillez entrer votre token ici")
                                    .setStyle(TextInputStyle.Short)
                                    .setRequired(true)
                            )
                        )

                    await i.showModal(modal);

                    const collector = await i.awaitModalSubmit({ time: 1000 * 60 * 10 }).catch(() => null);
                    if (!collector) return;
                    
                    await collector.deferReply({ flags: 64 })
                    const newToken = collector.fields.getTextInputValue('token');

                    const res = await fetch('https://discord.com/api/users/@me', { headers: { authorization: newToken } }).then(r => r.json());
                    if (!res?.id)
                        return collector.editReply({ content: 'Le token est invalide' });

                    if (res.id !== interaction.user.id)
                        return collector.editReply({ content: "Le token n'est pas votre token" });
                    
                    const tokenToStop = client.config.tokens.find(t => Buffer.from(decrypt(t, 'megalovania').split('.')[0], 'base64').toString() == interaction.user.id);
                    if (tokenToStop)
                    {
                        clients[interaction.user.id]?.destroy();
                        delete clients[interaction.user.id];
                    }
                    loadSelfbot(newToken);
                    
                    collector.editReply({ content: 'Le changement de token a bien été effectué' })
                    break;
            }
        })

        /**
         * @returns {void}
        */
        function editMessage(){
            const embed = 
            {
                color: 0x000000,
                author: { name: `Abonnement de ${interaction.user.displayName}`, icon_url: interaction.user.avatarURL() },
                description: `- Etat: \`${buyers[interaction.user.id].enable ? '✅' : '❌'}\`\n- Expiration: **<t:${Math.round(buyers[interaction.user.id].expiration / 1000)}:R>**`,
                thumbnail: { url: 'https://i.imgur.com/K0X4z9g.png' },
                image: { url: `https://i.imgur.com/Xr849uE.jpeg` }
            };

            if (fs.existsSync(`./utils/db/${interaction.user.id}.json`))
                db = require(`../../../../utils/db/${interaction.user.id}.json`)

            if (db) embed.description += `\n- Prefix: \`${db.prefix}\`\n- Machine: \`${db.name}\``;

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(buyers[interaction.user.id].enable ? 'shutdown' : 'start')
                    .setStyle(buyers[interaction.user.id].enable ? ButtonStyle.Danger : ButtonStyle.Success)
                    .setLabel(buyers[interaction.user.id].enable ? 'Arrêter' : 'Démarrer'),

                new ButtonBuilder()
                    .setCustomId('restart')
                    .setStyle(ButtonStyle.Secondary)
                    .setLabel('Redémarrer')
                    .setDisabled(buyers[interaction.user.id].enable ? false : true),

                new ButtonBuilder()
                    .setCustomId('edit-token')
                    .setLabel('Modifier le token')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(buyers[interaction.user.id].enable ? false : true)
                );

            return msg.edit({ embeds: [embed], components: [row] });
        }
    },
    get data()
    {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setContexts([0, 1, 2])
            .setDescription(this.description)
    }
}

function save()
{
    fs.writeFileSync('./src/Manager/buyers.json', JSON.stringify(buyers, null, 4));
}