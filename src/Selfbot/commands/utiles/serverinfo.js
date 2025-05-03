const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "serverinfo",
    description: "Affiche les informations d'un serveur",
    aliases: [ 'si' ],
    usage: "[guildID]",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const guild = client.guilds.cache.get(args[0]) || message.guild;
        if (!guild) return message.edit(`***Aucun serveur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        message.edit(`> ***Informations du serveur \`${guild.name}\`***\n- \`Nom\`・${guild.name}\n- \`ID\`・${guild.id}\n- \`Propriétaire\`・<@${guild.ownerId}>\n- \`Membres\`・${guild.memberCount - guild.members.cache.filter(c => c.user.bot).size}\n- \`Bots\`・${guild.members.cache.filter(c => c.user.bot).size}\n- \`Membres Total\`・${guild.memberCount}\n- \`Salons\`・${guild.channels.cache.size}\n- \`Salons Vocaux\`・${guild.channels.cache.filter(c => c.type === "GUILD_VOICE").size}\n- \`Rôles\`・${guild.roles.cache.size}\n- \`Emojis\`・${guild.emojis.cache.size}\n- \`Stickers\`・${guild.stickers.cache.size}\n- \`Membres Admins\`・${guild.members.cache.filter(c => !c.user.bot && c.permissions.has('ADMINISTRATOR')).size}\n- \`Bots Admins\`・${guild.members.cache.filter(c => c.user.bot && c.permissions.has('ADMINISTRATOR')).size}\n- \`Nombre de Boosts\`・${guild.premiumSubscriptionCount}\n- \`Niveau\`・${lvl(guild.premiumTier)}\n- \`Date de création\`・<t:${Math.round(guild.createdTimestamp / 1000)}> <t:${Math.round(guild.createdTimestamp / 1000)}:R>\n- \`Jours depuis la création\`・<t:${Math.floor((Date.now() - guild.createdAt.getTime()) / 1000 / 60 / 60 / 24)}> <t:${Math.floor((Date.now() - guild.createdAt.getTime()) / 1000 / 60 / 60 / 24)}:R>\n- \`Rejoint le\`・<t:${Math.round(message.member.joinedTimestamp / 1000)}> <t:${Math.round(message.member.joinedTimestamp / 1000)}:R>\n- \`Jours depuis le join\`・<t:${Math.floor((Date.now() - message.member.joinedAt.getTime()) / 1000 / 60 / 60 / 24)}> <t:${Math.floor((Date.now() - message.member.joinedAt.getTime()) / 1000 / 60 / 60 / 24)}:R>\n- \`Description\`・${guild.description ?? 'Aucune'}\n- \`Icone\`・${guild.icon ? `[Lien Icone](${guild.iconURL({ dynamic: true, size: 4096 })})` : 'Aucune'}\n- \`Bannière\`・${guild.banner ? `[Lien Bannière](${guild.bannerURL({ dynamic: true, size: 4096 })})` : 'Aucune'}\n- \`Splash\`・${guild.splash ? `[Lien Splash](${guild.splashURL({ size: 4096 })})` : 'Aucune'}`)
    }
};

function lvl(lvl){
    switch(lvl){
        case "NONE": return 0;
        case "TIER_1": return 1;
        case "TIER_2": return 2;
        case "TIER_3": return 3;
    }
}