const { Client, Message } = require("discord.js");

module.exports = {
    name: "wakeup",
    description: "Déplace un membre dans plusieurs salons vocaux puis le ramène",
    usage: "[memberId]",
    dir: "voice",
    permission: "MOVE_MEMBERS",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    async run(client, message, args) {
        const member = message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            await message.guild.members.fetch(args[0]).catch(() => null);

        if (!member) return message.edit(`***Aucun membre de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (!member.voice.channel) return message.edit(`***\`${member.user.displayName}\` n'est connecté dans aucun salon vocal***`);

        const originalChannel = member.voice.channel;
        const availableChannels = message.guild.channels.cache
            .filter(c => c.type === "GUILD_VOICE" &&
                   c.id !== member.voice.channelId);

        if (availableChannels.size < 2)
            return message.edit("***Il n'y a pas assez de salons vocaux disponibles pour déplacer le membre***");

        try {
            message.edit(`***Début du réveil pour \`${member.user.displayName}\`...***`);
            const channelsArray = [...availableChannels.values()];
            
            for (let i = 0; i < 5; i++) {
                let randomChannel = channelsArray[Math.floor(Math.random() * channelsArray.length)];
                
                await member.voice.setChannel(randomChannel);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            await member.voice.setChannel(originalChannel);
            message.edit(`***\`${member.user.displayName}\` a été réveillé avec succès !***`);
        } catch (error) {
            console.error(error);
            message.edit(`***Une erreur est survenue: ${error.message}***`);
        }
    }
};