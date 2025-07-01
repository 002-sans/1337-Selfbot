const { Client, VoiceState } = require('discord.js-selfbot-v13');
const createdChannels = new Set();

module.exports = {
    name: "voiceStateUpdate",
    once: false,
    /**
     * @param {VoiceState} oldState
     * @param {VoiceState} newState
     * @param {Client} client
    */
    run: async (oldState, newState, client) => {
        if (oldState.channelId && !newState.channelId) client.join();
        if (newState && newState.guild && client.db.antivoc.includes(newState.user.id)) newState.disconnect().catch(() => false);

        if (newState && newState.guild){
            const data = client.db.tempvoc.find(c => c.guildId == newState.guild.id && c.channel == newState.channelId);
            if (!data) return;

            const channel = await newState.guild.channels.create(data.name.replace('<user>', newState.user.displayName), {
                type: "GUILD_VOICE",
                parent: newState.guild.channels.cache.get(data.category) ?? null
            }).catch(() => false);
            
            if (!channel) return;

            newState.setChannel(channel);
            createdChannels.add(channel.id);
        }

        if (oldState && oldState.guild){
            if (oldState.channel && createdChannels.has(oldState.channelId) && 
                (oldState.channel.members.size === 0 || oldState.channel.members.every(member => member.user.bot))) {
                oldState.channel.delete();
                createdChannels.delete(oldState.channelId);
            }
        }
    }
}