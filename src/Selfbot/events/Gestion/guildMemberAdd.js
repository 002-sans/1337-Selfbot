const { Client, GuildMember } = require('discord.js-selfbot-v13');

module.exports = {
    name: "guildMemberAdd",
    once: false,
    /**
     * @param {GuildMember} member
     * @param {Client} client
    */
    run: async (member, client) => {
        if (client.db.bl.find(c => c.id == member.id) && member.bannable) member.ban({ reason: client.db.bl.find(c => c.id == member.id).reason }).catch(() => false);
        
        let rolesData = client.db.autorole.filter(c => c.guildId == member.guild.id);
        if (rolesData.length === 0) return;

        if (member.user.bot){
            const roles = rolesData
                .filter(c => c.type == 'bot' || c.type == 'all')
                .filter(r => member.guild.roles.cache.get(r.id));

            roles.forEach(role => member.roles.add(role.id, "AutoRole").catch(() => false));
        }
        else {
            const roles = rolesData
                .filter(c => c.type == 'humain' || c.type == 'all')
                .filter(r => member.guild.roles.cache.get(r.id));

            roles.forEach(role => member.roles.add(role.id, "AutoRole").catch(() => false));
        }
    }
}