const { Client, Presence } = require('discord.js-selfbot-v13');

module.exports = {
    name: "presenceUpdate",
    once: false,
    /**
     * @param {Presence} oldPresence
     * @param {Presence} newPresence
     * @param {Client} client
    */
    run: async (oldPresence, newPresence, client) => {
        if (!oldPresence?.guild || newPresence?.guild) return;

        const db = client.db.soutien.find(c => c.guildId === newPresence.guild.id);
        if (!db.enable) return;

        const activity = newPresence.activities.find(c => c.type == "CUSTOM");
        const role = newPresence.guild.roles.cache.get(db.role);
        const text = db.message;

        if (!role || !text || !activity) return;

        if (db.only && activity.state === text) return newPresence.member.roles.add(role, "Soutiens ajouté").catch(() => false);
        else if (activity.state.includes(text)) return newPresence.member.roles.add(role, "Soutiens ajouté").catch(() => false);
        else if (newPresence.member.roles.cache.has(role.id)) return newPresence.member.roles.remove(role, "Soutiens retiré").catch(() => false);
    }
}