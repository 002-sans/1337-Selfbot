const { Client, Message } = require('discord.js-selfbot-v13');

module.exports = {
    name: "quests",
    description: "Effectue les clans",
    dir: "account",
    usage: "[list]",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     */
    run: async (client, message, args) => {
        try {
            const data = await client.api.quests['@me'].get();
            if (!data || !data.quests) return message.edit("**Erreur lors de la récupération des quests.**");
            
            const quests = data.quests.filter(q => {
                const notCompleted = !q.user_status?.completed_at;
                const notExpired = new Date(q.config.expires_at).getTime() > Date.now();

                const taskConfig = q.config.task_config ?? q.config.task_config_v2;
                const hasVideoTask = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE"].some(type => taskConfig?.tasks?.[type]);

                return q.id !== "1248385850622869556" && notCompleted && notExpired && hasVideoTask;
            });

            if (!quests.length) return message.edit("**Vous n'avez pas de quêtes vidéos.**");

            switch (args[0]) {
                case 'list':
                    message.edit(`***___› ${client.config.project} - Quests___*** <a:star:1345073135095123978>\n${quests.map((r, i) => `\`${i + 1}\` - ${r.config.messages.quest_name}`).join('\n')}`)
                    break;

                default:
                    message.edit(`**\`${quests.length}\` quêtes vidéos en cours...**`);

                    quests.map(async quest => {
                        const taskConfig = quest.config.task_config ?? quest.config.task_config_v2;
                        const taskName = ["WATCH_VIDEO", "WATCH_VIDEO_ON_MOBILE"].find(x => taskConfig.tasks?.[x] != null);

                        if (!taskName) return;
                        if (!quest.user_status?.enrolled_at) 
                            await client.api.quests[quest.id].enroll.post({ data: { location: 11, is_targeted: false } })

                        const enrolledAt = new Date(quest.user_status?.enrolled_at ?? Date.now()).getTime();
                        const secondsNeeded = taskConfig.tasks[taskName].target;
                        let secondsDone = quest.user_status?.progress?.[taskName]?.value ?? 0;
                        const maxFuture = 10, speed = 7, interval = 1;

                        while (secondsDone < secondsNeeded) {
                            const maxAllowed = Math.floor((Date.now() - enrolledAt) / 1000) + maxFuture;
                            const diff = maxAllowed - secondsDone;
                            const timestamp = secondsDone + speed;

                            if (diff >= speed) {
                                await client.api.quests[quest.id]['video-progress'].pos({ data: { timestamp: Math.min(secondsNeeded, timestamp + Math.random()) } })
                                secondsDone = Math.min(secondsNeeded, timestamp);
                            }

                            await new Promise(resolve => setTimeout(resolve, interval * 1000));
                        }
                    })
            }
        } catch (err) {
            console.error(err);
            message.edit("**Une erreur est survenue lors du traitement des quests**");
        }
    }
};
