const { Client, Message, Util } = require("discord.js-selfbot-v13");

module.exports = {
    name: "emojis",
    description: "Crée des emojis dans le serveur actuel",
    usage: "<emojis>",
    permission: "MANAGE_EMOJIS_AND_STICKERS",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!message.guild) return message.edit("***Veuillez utiliser la commande dans un serveur***");
        let created = 0;

        message.edit(`***Création de \`${args.length}\` emojis***`)

        for (const emote of args.map(r => r)){
            try {
                const emoji = Util.parseEmoji(emote)
                if (!emoji || !emoji?.id) continue;
            
                await message.guild.emojis.create(`https://cdn.discordapp.com/emojis/${emoji?.id}.${emoji.animated ? 'gif' : 'png'}`, emoji.name);
                await client.sleep(500);
                created++
            } catch { false }
        }
        
        if (message.editable) message.edit(`***\`${created}\`/\`${args.length}\` emojis ont été crées***`)
    }
};
