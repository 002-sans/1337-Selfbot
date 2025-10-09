const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "user-tracker",
    description: "Suit l'activité d'un utilisateur (connexions, statuts, etc.)",
    usage: "[add/del/list/info] [user]",
    dir: "tools",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!client.db.userTracker) client.db.userTracker = [];
        
        const user = message.mentions.users.first() || 
                    client.users.cache.get(args[1]) || 
                    await client.users.fetch(args[1]).catch(() => false);

        switch(args[0]) {
            case 'add':
                if (!user || !args[1]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                
                if (client.db.userTracker.find(u => u.userId === user.id)) {
                    return message.edit(`***\`${user.displayName}\` est déjà suivi***`);
                }
                
                client.db.userTracker.push({
                    userId: user.id,
                    username: user.username,
                    addedAt: Date.now(),
                    activities: [],
                    statusChanges: [],
                    connections: []
                });
                client.save();
                
                message.edit(`***Suivi activé pour \`${user.displayName}\`***`);
                break;

            case 'del':
                if (!user || !args[1]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                
                const index = client.db.userTracker.findIndex(u => u.userId === user.id);
                if (index === -1) return message.edit(`***\`${user.displayName}\` n'est pas suivi***`);
                
                client.db.userTracker.splice(index, 1);
                client.save();
                
                message.edit(`***Suivi désactivé pour \`${user.displayName}\`***`);
                break;

            case 'list':
                if (client.db.userTracker.length === 0) {
                    return message.edit("***Aucun utilisateur suivi***");
                }
                
                const list = client.db.userTracker.map(u => {
                    const trackedUser = client.users.cache.get(u.userId);
                    const status = trackedUser?.presence?.status || 'offline';
                    const activity = trackedUser?.presence?.activities[0]?.name || 'Aucune';
                    return `- \`${u.username}\`・${status} (${activity})`;
                }).join('\n');
                
                message.edit(`> ***Utilisateurs suivis (${client.db.userTracker.length}):***\n${list}`);
                break;

            case 'info':
                if (!user || !args[1]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                
                const tracked = client.db.userTracker.find(u => u.userId === user.id);
                if (!tracked) return message.edit(`***\`${user.displayName}\` n'est pas suivi***`);
                
                const currentStatus = user.presence?.status || 'offline';
                const currentActivity = user.presence?.activities[0]?.name || 'Aucune';
                const lastSeen = tracked.connections.length > 0 ? 
                    new Date(tracked.connections[tracked.connections.length - 1].timestamp).toLocaleString('fr-FR') : 
                    'Jamais vu';
                
                const totalConnections = tracked.connections.length;
                const statusChanges = tracked.statusChanges.length;
                const activitiesCount = [...new Set(tracked.activities.map(a => a.name))].length;
                
                message.edit(`> ***Informations de suivi - ${user.displayName}***\n` +
                    `- \`Statut actuel\`・${currentStatus}\n` +
                    `- \`Activité actuelle\`・${currentActivity}\n` +
                    `- \`Dernière connexion\`・${lastSeen}\n` +
                    `- \`Total connexions\`・${totalConnections}\n` +
                    `- \`Changements de statut\`・${statusChanges}\n` +
                    `- \`Activités différentes\`・${activitiesCount}\n` +
                    `- \`Suivi depuis\`・${new Date(tracked.addedAt).toLocaleDateString('fr-FR')}`);
                break;

            case 'activities':
                if (!user || !args[1]) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[1] ?? 'rien'}\`***`);
                
                const trackedActivities = client.db.userTracker.find(u => u.userId === user.id);
                if (!trackedActivities) return message.edit(`***\`${user.displayName}\` n'est pas suivi***`);
                
                const recentActivities = trackedActivities.activities
                    .slice(-10)
                    .reverse()
                    .map(a => `- \`${a.name}\`・${new Date(a.timestamp).toLocaleString('fr-FR')}`)
                    .join('\n');
                
                message.edit(`> ***Activités récentes - ${user.displayName}***\n${recentActivities || 'Aucune activité enregistrée'}`);
                break;

            default:
                message.edit(`> ***User Tracker - Commandes disponibles:***\n` +
                    `- \`${client.db.prefix}user-tracker add <utilisateur>\`・Suivre un utilisateur\n` +
                    `- \`${client.db.prefix}user-tracker del <utilisateur>\`・Arrêter le suivi\n` +
                    `- \`${client.db.prefix}user-tracker list\`・Liste des utilisateurs suivis\n` +
                    `- \`${client.db.prefix}user-tracker info <utilisateur>\`・Informations détaillées\n` +
                    `- \`${client.db.prefix}user-tracker activities <utilisateur>\`・Activités récentes`);
        }
    }
};

function trackUserActivity(client, user, type, data) {
    if (!client.db.userTracker) return;
    
    const tracked = client.db.userTracker.find(u => u.userId === user.id);
    if (!tracked) return;
    
    const timestamp = Date.now();
    
    switch(type) {
        case 'status':
            tracked.statusChanges.push({
                from: data.oldStatus,
                to: data.newStatus,
                timestamp
            });
            break;
            
        case 'activity':
            if (data.activity && data.activity.name) {
                tracked.activities.push({
                    name: data.activity.name,
                    type: data.activity.type,
                    timestamp
                });
            }
            break;
            
        case 'connection':
            tracked.connections.push({
                type: data.type,
                timestamp
            });
            break;
    }
    
    if (tracked.statusChanges.length > 100) tracked.statusChanges = tracked.statusChanges.slice(-100);
    if (tracked.activities.length > 100) tracked.activities = tracked.activities.slice(-100);
    if (tracked.connections.length > 100) tracked.connections = tracked.connections.slice(-100);
    
    client.save();
}