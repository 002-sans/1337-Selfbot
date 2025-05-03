const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "delrole",
    description: "Retire un rôle à d'un membre du serveur",
    dir: "moderation",
    usage: "<membre> <rôle>",
    permission: "MANAGE_ROLES",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Cette commande ne peut être utilisée que sur un serveur***");
        
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await message.guild.members.fetch(args[0]).catch(() => false);
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.slice(1).join(" ").toLowerCase())) || await message.guild.roles.fetch(args[1]).catch(() => false);

        if (!member || !args[0]) return message.edit(`***Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!role || !args[1]) return message.edit(`***Aucun rôle de trouvé pour \`${args[1] ?? 'rien'}\`***`);

        if (!member.manageable) return message.edit(`***Je n'ai pas la permission de retirer un rôle de \`${member.user.displayName}\`***`);
        if (message.member.roles.highest.position <= role.position) return message.edit(`***Je n'ai pas la permission de retirer ce rôle***`);
        
        member.roles.remove(role)
            .then( () => message.edit(`***Le rôle \`${role.name}\` a été retiré de \`${member.user.displayName}\`***`))
            .catch(() => message.edit(`***Je n'ai pas pu retirer le rôle \`${role.name}\` de \`${member.user.displayName}\`***`));
    }
};