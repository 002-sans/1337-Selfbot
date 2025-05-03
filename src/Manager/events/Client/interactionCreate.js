const { ChatInputCommandInteraction, Client } = require("discord.js");
const demandes = require('../../demandes.json');
const fs = require('node:fs');

module.exports = {
    name: "interactionCreate",
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
    */
    run: async (interaction, client) => {

        if (interaction.isCommand()) 
        {
            const guild = client.guilds.cache.get(client.config.guild_id);
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            if (command.botOwnerOnly && !client.config.owners.includes(interaction.user.id))
                return interaction.reply({
                    content: `❌ **Vous devez être le propriétaire du bot pour exécuter cette commande.**`,
                    flags: 64
                });
            

            if (command.guildOwnerOnly && guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id))
                return interaction.reply({
                    content: `❌ **Vous devez être le propriétaire du serveur pour exécuter cette commande.**`,
                    flags: 64
                });
            

            if (command.staffOnly) 
            {
                if (guild.ownerId != interaction.user.id && !client.config.owners.includes(interaction.user.id) && 
                   !guild.members.cache.get(interaction.user.id)?.roles?.cache?.has(client.config.staff_role))
                    return interaction.reply({
                        content: `❌ **Vous devez être le propriétaire du serveur pour exécuter cette commande.**`,
                        flags: 64
                    });
            }

            command.executeSlash(client, interaction);
            console.log("[CMD-S]", interaction.guild ? `${interaction.guild.name} | ${interaction.channel.name}` : `DM`, `| ${interaction.user.displayName} | ${command.name}`);
        }

        else if (interaction.isButton()) {
            switch (true) {
                case interaction.customId.startsWith('accepter_'):
                    if (!demandes[interaction.customId.split('_')[1]]) return interaction.reply({ content: `Le token n'est pas enregistré dans notre base de donnée.`, flags: 64 });

                    interaction.deferUpdate().catch(() => false);

                    interaction.message.delete();
                    client.load(demandes[interaction.customId.split('_')[1]]);

                    interaction.channel.send({ content: `${interaction.user} a accepté <@${interaction.customId.split('_')[1]}>` });

                    delete demandes[interaction.customId.split('_')[1]];
                    fs.writeFileSync('./src/Manager/demandes.json', JSON.stringify(demandes, null, 4));
                    break;

                case interaction.customId.startsWith('refuser_'):
                    interaction.deferUpdate().catch(() => false);
                    interaction.message.delete();

                    interaction.channel.send({ content: `${interaction.user} a refusé <@${interaction.customId.split('_')[1]}>` });

                    delete demandes[interaction.customId.split('_')[1]];
                    fs.writeFileSync('./src/Manager/demandes.json', JSON.stringify(demandes, null, 4));
                    break;
            }
        }
    },
};