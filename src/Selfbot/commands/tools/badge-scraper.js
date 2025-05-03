const { Client, Message } = require("discord.js-selfbot-v13");

const badges = {
    "ACTIVE_DEVELOPER": "Actif Dev",
    "BUGHUNTER_LEVEL_1": "Bug Hunter I",
    "BUGHUNTER_LEVEL_2": "Bug Hunter II",
    "DISCORD_CERTIFIED_MODERATOR": "Modérateur", 
    "DISCORD_EMPLOYEE": "Discord Staff", 
    "EARLY_SUPPORTER": "Early", 
    "EARLY_VERIFIED_BOT_DEVELOPER": "Early Dev",
    "HOUSE_BALANCE": "Balance",
    "HOUSE_BRAVERY": "Bravery",
    "HOUSE_BRILLIANCE": "Brilliance",
    "HYPESQUAD_EVENTS": "Hypesquad",
    "PARTNERED_SERVER_OWNER": "Partner"
}

module.exports = {
    name: "badge-scraper",
    description: "Affiche les membres ayant un badge spécial",
    usage: "[add/del]",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        switch(args[0]){

            case 'add':
                if (!Object.keys(badges).includes(args[0])) return message.edit(`> ***Liste des badges***\n${Object.keys(badges).map(r => `- \`${r}\` - ${badges[r]}`).join('\n')}`);
                if (client.db.badges.includes(args[0])) return message.edit(`***Le badge \`${badges[args[0]]}\` est déjà dans le scraper***`);

                client.db.badges.push(args[0]);
                client.save();

                message.edit(`***Le badge \`${args[0]}\` a été ajouté aux scrapings***`);
                break;

            case 'del':
                if (!Object.keys(badges).includes(args[0])) return message.edit(`> ***Liste des badges***\n${Object.keys(badges).map(r => `- \`${r}\` - ${badges[r]}`).join('\n')}`);
                if (!client.db.badges.includes(args[0])) return message.edit(`***Le badge \`${badges[args[0]]}\` n'est pas dans le scraper***`);

                client.db.badges = client.db.badges.filter(c => c !== args[0]);
                client.save();

                message.edit(`***Le badge \`${args[0]}\` a été retiré du scraping***`);
                break;

            case 'list':
                message.edit(`> ***Liste des badges à trouver***\n${client.db.badges.map(r => `- \`${badges[r]}\` (${r})`).join('\n')}`);
                break;

            default:
                const badgesArray = [];
                const guild = client.guilds.cache.get(args[0]) || message.guild;
                if (!guild) return message.edit(`***Aucun serveur de ttrouvé pour \`${args[0] ?? 'rien'}\`***`);

                await guild.members.fetch().catch(() => false);                
                await message.edit(`***Recherche de badges rare sur \`${guild.members.cache.size}\` membres***`);

                const badgePromises = guild.members.cache.map(async (member) => {
                    const userBadges = member.user.flags.toArray().filter((c) => client.db.badges.includes(c));
                    const badgesFr = userBadges.map((r) => badges[r]);
                
                    if (userBadges.length > 0) badgesArray.push(`${member} - ${badgesFr.join(', ')}`);
                    
                });
                
                await Promise.all(badgePromises);
                
                if (message.deletable) message.delete();
                client.send(message, badgesArray.length > 0 ? `> ***\`${badgesArray.length}\` badges trouvés***\n${badgesArray.join('\n')}` : "***Aucun badge rare trouvé***");
                break;
        }
    }
};
