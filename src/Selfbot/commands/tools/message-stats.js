const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "message-stats",
    description: "Affiche les statistiques de messages d'un salon ou utilisateur",
    usage: "[channel/user] [limit]",
    dir: "tools",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const limit = parseInt(args[1]) || 1000;
        let target = message.mentions.channels.first() || message.mentions.users.first() || 
                    client.channels.cache.get(args[0]) || client.users.cache.get(args[0]) ||
                    await client.channels.fetch(args[0]).catch(() => false) ||
                    await client.users.fetch(args[0]).catch(() => false);

        if (!target) target = message.channel;

        await message.edit("***Analyse des statistiques en cours...***");

        if (target.type === "GUILD_TEXT" || target.type === "DM" || target.type === "GROUP_DM") {
            const messages = await fetchMessages(target, limit);
            const stats = analyzeChannelMessages(messages);
            
            message.edit(`> ***Statistiques du salon ${target.name || 'DM'}***\n` +
                `- \`Messages analysés\`・${messages.length}\n` +
                `- \`Utilisateur le plus actif\`・${stats.topUser.name} (${stats.topUser.count} messages)\n` +
                `- \`Messages par jour (moyenne)\`・${stats.avgPerDay}\n` +
                `- \`Heure la plus active\`・${stats.peakHour}h\n` +
                `- \`Jour le plus actif\`・${stats.peakDay}\n` +
                `- \`Emojis les plus utilisés\`・${stats.topEmojis.slice(0, 3).join(' ')}\n` +
                `- \`Mots les plus fréquents\`・${stats.topWords.slice(0, 5).join(', ')}`);
        } else {
            const userStats = await analyzeUserActivity(target, message.guild);
            
            message.edit(`> ***Statistiques de ${target.displayName || target.username}***\n` +
                `- \`Messages dans ce serveur\`・${userStats.messageCount}\n` +
                `- \`Salons favoris\`・${userStats.favoriteChannels.slice(0, 3).join(', ')}\n` +
                `- \`Première activité\`・${userStats.firstMessage}\n` +
                `- \`Dernière activité\`・${userStats.lastMessage}\n` +
                `- \`Moyenne par jour\`・${userStats.avgPerDay}\n` +
                `- \`Réactions reçues\`・${userStats.reactionsReceived}`);
        }
    }
};

async function fetchMessages(channel, limit) {
    let messages = [];
    let lastID;
    
    while (messages.length < limit) {
        const fetched = await channel.messages.fetch({
            limit: Math.min(100, limit - messages.length),
            cache: false,
            ...(lastID && { before: lastID }),
        });
        
        if (fetched.size === 0) break;
        messages = messages.concat(Array.from(fetched.values()));
        lastID = fetched.lastKey();
    }
    
    return messages;
}

function analyzeChannelMessages(messages) {
    const userCounts = {};
    const hourCounts = Array(24).fill(0);
    const dayCounts = Array(7).fill(0);
    const emojiCounts = {};
    const wordCounts = {};
    
    messages.forEach(msg => {
        const userId = msg.author.id;
        userCounts[userId] = (userCounts[userId] || 0) + 1;

        const hour = new Date(msg.createdTimestamp).getHours();
        hourCounts[hour]++;

        const day = new Date(msg.createdTimestamp).getDay();
        dayCounts[day]++;
        
        const emojiRegex = /<:\w+:\d+>|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
        const emojis = msg.content.match(emojiRegex) || [];
        emojis.forEach(emoji => {
            emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
        });
        
        const words = msg.content.toLowerCase().split(/\s+/).filter(word => 
            word.length > 3 && !word.startsWith('http') && !word.includes('@')
        );
        words.forEach(word => {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
        });
    });
    
    const topUser = Object.entries(userCounts)
        .sort(([,a], [,b]) => b - a)[0];
    
    const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
    const peakDay = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'][dayCounts.indexOf(Math.max(...dayCounts))];
    
    const topEmojis = Object.entries(emojiCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([emoji]) => emoji);
    
    const topWords = Object.entries(wordCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([word]) => word);
    
    const avgPerDay = Math.round(messages.length / 7);
    
    return {
        topUser: { name: messages.find(m => m.author.id === topUser[0])?.author.displayName || 'Inconnu', count: topUser[1] },
        avgPerDay,
        peakHour,
        peakDay,
        topEmojis,
        topWords
    };
}

async function analyzeUserActivity(user, guild) {
    let messageCount = 0;
    const channelCounts = {};
    let firstMessage = null;
    let lastMessage = null;
    
    for (const channel of guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').values()) {
        try {
            const messages = await fetchMessages(channel, 500);
            const userMessages = messages.filter(m => m.author.id === user.id);
            
            if (userMessages.length > 0) {
                messageCount += userMessages.length;
                channelCounts[channel.name] = userMessages.length;
                
                const oldest = userMessages[userMessages.length - 1];
                const newest = userMessages[0];
                
                if (!firstMessage || oldest.createdTimestamp < firstMessage.createdTimestamp) {
                    firstMessage = oldest;
                }
                if (!lastMessage || newest.createdTimestamp > lastMessage.createdTimestamp) {
                    lastMessage = newest;
                }
            }
        } catch (error) { }
    }
    
    const favoriteChannels = Object.entries(channelCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([name]) => name);
    
    const daysSinceFirst = firstMessage ? 
        Math.max(1, Math.floor((Date.now() - firstMessage.createdTimestamp) / (1000 * 60 * 60 * 24))) : 1;
    
    return {
        messageCount,
        favoriteChannels,
        firstMessage: firstMessage ? new Date(firstMessage.createdTimestamp).toLocaleDateString('fr-FR') : 'Inconnue',
        lastMessage: lastMessage ? new Date(lastMessage.createdTimestamp).toLocaleDateString('fr-FR') : 'Inconnue',
        avgPerDay: Math.round(messageCount / daysSinceFirst),
        reactionsReceived: 'Non calculé'
    };
}