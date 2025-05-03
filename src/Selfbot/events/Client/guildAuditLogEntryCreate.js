const { Client, GuildMember, GuildAuditLogsEntry, Guild } = require('discord.js-selfbot-v13');

module.exports = {
    name: "guildAuditLogEntryCreate",
    once: false,
    /**
     * @param {GuildAuditLogsEntry} auditLogEntry
     * @param {Guild} guild
     * @param {Client} client
    */
    run: async (auditLogEntry, guild, client) => {
        const member = guild.members.cache.get(auditLogEntry.executorId) || 
                       await guild.members.fetch(auditLogEntry.executorId).catch(() => false);

        if (auditLogEntry.executorId === guild.ownerId  ||
            auditLogEntry.executorId === client.user.id ||
            client.db.wl.includes(auditLogEntry.executorId) ||
            !client.db.antiraid.protected.includes(guild.id)) return;

        switch(auditLogEntry.action){
            case 'CHANNEL_CREATE':
                if (!client.db.antiraid.antichannel.etat) return;

                sltcv(member, client.db.antiraid.antichannel.punish);
                auditLogEntry.target.delete("Anti Channel").catch(() => false);

                if (!auditLogEntry.target.parentId) return;
                    
                if (!client.antiraid.get(auditLogEntry.target.parentId)) client.antiraid.set(auditLogEntry.target.parentId, [])
                const category = client.antiraid.get(auditLogEntry.target.parentId)
                if (category) category.push(auditLogEntry.target.id);
                break;

            case 'CHANNEL_UPDATE':
                if (!client.db.antiraid.antichannel.etat) return;
                sltcv(member, client.db.antiraid.antichannel.punish);

                const newChannel = await auditLogEntry.target.edit({
                    name: auditLogEntry.changes.find(c => c.key === "name")?.old ?? auditLogEntry.target.name,
                    type: auditLogEntry.changes.find(c => c.key === "type")?.old ?? auditLogEntry.target.type,
                    topic: auditLogEntry.changes.find(c => c.key === "topic")?.old ?? auditLogEntry.target.topic,
                    nsfw: auditLogEntry.changes.find(c => c.key === "nsfw")?.old ?? auditLogEntry.target.nsfw,
                    bitrate: auditLogEntry.changes.find(c => c.key === "bitrate")?.old ?? auditLogEntry.target.bitrate,
                    userLimit: auditLogEntry.changes.find(c => c.key === "user_limit")?.old ?? auditLogEntry.target.userLimit,
                    rateLimitPerUser: auditLogEntry.changes.find(c => c.key === "rate_limit_per_user")?.old ?? auditLogEntry.target.rateLimitPerUser,
                    position: auditLogEntry.changes.find(c => c.key === "position")?.old ?? auditLogEntry.target.position
                }).catch(() => false);
                

                if (auditLogEntry.target.parentId === newChannel.parentId) return;
                    
                if (!client.antiraid.get(auditLogEntry.target.parentId)) client.antiraid.set(auditLogEntry.target.parentId, []);

                const newCategory = client.antiraid.get(newChannel.parentId);
                const oldCategory = client.antiraid.get(auditLogEntry.target.parentId);

                if (oldCategory) oldCategory.splice(auditLogEntry.target.id, 1);
                if (newChannel) newCategory.push(auditLogEntry.target.id);
                break;

            
            case 'CHANNEL_DELETE':
                if (!client.db.antiraid.antichannel.etat) return;
                sltcv(member, client.db.antiraid.antichannel.punish);

                const newchannel = await guild.channels.create({
                    name: auditLogEntry.target.name,
                    type: auditLogEntry.target.type,
                    topic: auditLogEntry.target.topic || null,
                    nsfw: auditLogEntry.target.nsfw,
                    bitrate: auditLogEntry.target.bitrate || null,
                    userLimit: auditLogEntry.target.userLimit || null,
                    rateLimitPerUser: auditLogEntry.target.rateLimitPerUser || null,
                    parent: auditLogEntry.target.parent || null,
                    position: auditLogEntry.target.rawPosition || null,
                    permissionOverwrites: auditLogEntry.target.permissionOverwrites?.cache.map(overwrite => ({
                        id: overwrite.id,
                        allow: overwrite.allow.bitfield.toString(),
                        deny: overwrite.deny.bitfield.toString(),
                        type: overwrite.type
                    }))
                }).catch(() => false);
                

                if (auditLogEntry.target.type === "GUILD_CATEGORY"){
                    client.antiraid.set(newchannel.id, client.antiraid.get(auditLogEntry.target.id))
                    client.antiraid.delete(auditLogEntry.target.id)
                    const a = client.antiraid.get(newchannel.id)
                    if (a) a.forEach((id) => {
                        const child = guild.channels.cache.get(id);
                        if (child) child.setParent(newchannel).catch(() => false);
                    })
                }
                else{
                    const categoryids = Array.from(client.antiraid.keys())
                    categoryids.forEach(c => {
                        if (!client.antiraid.get(c).includes(auditLogEntry.targetId)) return;
                        newchannel.setParent(c).catch(() => false);
                        client.antiraid.get(c).push(newchannel.id);
                        client.positions.set(newchannel.id, newchannel.position);
                    })
                }
                break;

            case 'ROLE_CREATE':
                if (!client.db.antiraid.antirole.etat) return;
                
                sltcv(member, client.db.antiraid.antirole.punish);
                auditLogEntry.target.delete().catch(() => false)
                break;


            case 'ROLE_DELETE':
                if (!client.db.antiraid.antirole.etat) return;

                sltcv(member, client.db.antiraid.antirole.punish);

                guild.roles.create({
                    name: auditLogEntry.changes.find(k => k.key == 'name').old,
                    color: auditLogEntry.changes.find(k => k.key == 'color').old,
                    hoist: auditLogEntry.changes.find(k => k.key == 'hoist').old,
                    mentionable: auditLogEntry.changes.find(k => k.key == 'mentionable').old,
                    permissions: PermissionsBitField.resolve(auditLogEntry.changes.find(k => k.key == 'permissions').old),
                });
                break;

            case 'ROLE_DELETE':
                if (!client.db.antiraid.antirole.etat) return;
                sltcv(member, client.db.antiraid.antirole.punish);

                guild.roles.create({
                    name: auditLogEntry.changes.find(k => k.key == 'name').old,
                    color: auditLogEntry.changes.find(k => k.key == 'color').old,
                    hoist: auditLogEntry.changes.find(k => k.key == 'hoist').old,
                    mentionable: auditLogEntry.changes.find(k => k.key == 'mentionable').old,
                    permissions: PermissionsBitField.resolve(auditLogEntry.changes.find(k => k.key == 'permissions').old),
                });
                break;

            case 'ROLE_UPDATE':
                if (!client.db.antiraid.antirole.etat) return;
                sltcv(member, client.db.antiraid.antirole.punish);

                auditLogEntry.target.edit({
                    name: auditLogEntry.changes.find(k => k.key == 'name')?.old ?? auditLogEntry.target.name,
                    color: auditLogEntry.changes.find(k => k.key == 'color')?.old ?? auditLogEntry.target.color,
                    hoist: auditLogEntry.changes.find(k => k.key == 'hoist')?.old ?? auditLogEntry.target.hoist,
                    mentionable: auditLogEntry.changes.find(k => k.key == 'mentionable')?.old ?? auditLogEntry.target.mentionable,
                    permissions: auditLogEntry.changes.find(k => k.key == 'permissions')?.old ?? auditLogEntry.target.permissionOverwrites,
                })
                break;

            case 'BOT_ADD':
                if (!client.db.antiraid.antibot.etat) return;
                sltcv(member, client.db.antiraid.antibot.punish);
                
                guild.members.cache.get(auditLogEntry.targetId)?.kick().catch(() => false);
                break;

            case 'MEMEBR_BAN_ADD':
                if (!client.db.antiraid.antiban.etat) return;
                sltcv(member, client.db.antiraid.antiban.punish);
                
                guild.bans.remove(auditLogEntry.target).catch(() => false);
                break;

            case 'MEMEBR_BAN_REMOVE':
                if (!client.db.antiraid.antiunban.etat) return;
                sltcv(member, client.db.antiraid.antiunban.punish);
                    
                guild.bans.create(auditLogEntry.target).catch(() => false);
                break;

            case 'MEMBER_KICK':
                if (!client.db.antiraid.antikick.etat) return;
                sltcv(member, client.db.antiraid.antikick.punish);
                break;

            case 'WEBHOOK_CREATE':
                if (!client.db.antiraid.antiwebhook.etat) return;
                sltcv(member, client.db.antiraid.antiwebhook.punish);

                const channel = guild.channels.cache.get(auditLogEntry.changes.find(c => c.key === 'channel_id').new)
                const webhook = await channel.fetchWebhooks()
                    .then(w => w.find(c => c.id == auditLogEntry.targetId))
                    .catch(() => false)
                
                if (webhook) webhook.delete.catch(() => false);
                break;

            case 'GUILD_UPDATE':
                if (!client.db.antiraid.antiupdate.etat) return;
                sltcv(member, client.db.antiraid.antiupdate.punish);

                guild.edit({
                    name: auditLogEntry.changes.find(k => k.key == 'name')?.old ?? guild.name,
                    icon: auditLogEntry.changes.find(k => k.key == "icon_hash")?.old ?? guild.iconURL(),
                    splash: auditLogEntry.changes.find(k => k.key == "splash_hash")?.old ?? guild.splashURL(),
                    banner: auditLogEntry.changes.find(k => k.key == "banner_hash")?.old ?? guild.bannerURL(),
                    description: auditLogEntry.changes.find(k => k.key == "description")?.old ?? guild.description,
                    verificationLevel: auditLogEntry.changes.find(k => k.key == "verification_level")?.old ?? guild.verificationLevel,
                    defaultMessageNotifications: auditLogEntry.changes.find(k => k.key == "default_message_notifications")?.old ?? guild.defaultMessageNotifications,
                    explicitContentFilter: auditLogEntry.changes.find(k => k.key == "explicit_content_filter")?.old ?? guild.explicitContentFilter,
                    afkChannelId: auditLogEntry.changes.find(k => k.key == "afk_channel_id")?.old ?? guild.afkChannelId,
                    afkTimeout: auditLogEntry.changes.find(k => k.key == "afk_timeout")?.old ?? guild.afkTimeout,
                    systemChannelId: auditLogEntry.changes.find(k => k.key == "system_channel_id")?.old ?? guild.systemChannelId,
                    rulesChannel: auditLogEntry.changes.find(k => k.key == "rules_channel_id")?.old ?? guild.rulesChannelId,
                    publicUpdatesChannel: auditLogEntry.changes.find(k => k.key == "public_updates_channel_id")?.old ?? guild.publicUpdatesChannelId,
                    systemChannelFlags: auditLogEntry.changes.find(k => k.key == "system_channel_flags")?.old ?? guild.systemChannelFlags,
                    preferredLocale: auditLogEntry.changes.find(k => k.key == "preferred_locale")?.old ?? guild.preferredLocale,
                });
                break;

            case 'MEMBER_UPDATE':
                if (!client.db.antiraid.antirank.etat) return;
                sltcv(member, client.db.antiraid.antirank.punish);

                const newRole = auditLogEntry.changes.find(c => c.key == "$add") ? auditLogEntry.changes.find(c => c.key == "$add").new : [];
                const oldRole = auditLogEntry.changes.find(c => c.key == "$remove") ? auditLogEntry.changes.find(c => c.key == "$remove").new : [];
                const getter  = guild.members.cache.get(auditLogEntry.targetId) || await guild.members.fetch(auditLogEntry.targetId).catch(() => false);

                if (newRole) getter.roles.remove(newRole.map(r => r.id));
                if (oldRole) getter.roles.add(oldRole.map(r => r.id));
                break;
        }
    }
}

/**
 * @param {GuildMember} member
 * @param {string[]} punish
*/
function sltcv(member, punish = "derank"){
    switch(punish){
        case 'mute':
            if (member.moderatable) member.timeout(1000 * 60 * 5).catch(() => false)
            break;

        case 'derank':
            if (member.manageable) member.roles.set([]).catch(() => false);
            break;

        case 'kick':
            if (member.kickable) member.kick().catch(() => false);
            break;

        case 'ban':
            if (member.bannable) member.ban().catch(() => false)
            break;

    }
}