const { Message, Client } = require('discord.js-selfbot-v13');
const regex = /(discord\.gg\/|discord\.com\/invite\/)/i;

module.exports = {
    name: "messageCreate",
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
    */
    run: async (message, client) => {
        // Nitro Sniper
        if (client.db.nitrosniper) matchCode(message.content, code => {
            try { client.api.entitlements['gift-codes'](code).redeem.post({ auth: true, data: { channel_id: message.channelId, payment_source_id: null } }) } catch { false }
        })

        // Ephemeral
        if (client.db.ephemeral.enable && !client.db.ephemeral.channels.includes(message.channel.id) && !client.db.ephemeral.guilds.includes(message.guildId))
            setTimeout(() => message.author.id == client.user.id && message.deletable ? message.delete() : false, 1000 * 30);

        // Auto React
        if (message.guild && client.db.autoreact.find(c => c.id === message.channelId)) client.db.autoreact.filter(c => c.id === message.channelId).forEach(c => {
            const channel = message.guild.channels.cache.get(c.id);
            if (channel) message.react(c.reaction).catch(() => false);
        })

        // Piconly
        if (message.guild && client.db.piconly.find(c => c.id === message.channelId) && 
            message.attachments.size == 0 && 
            !message.member.permissions.has("ADMINISTRATOR") &&
            client.user.id !== message.author.id){
                message.delete().catch(() => false);
                const m = await message.channel.send(`***${message.author} Veuillez envoyer une image***`);
                setTimeout(() => m.delete().catch(() => false), 5000);
        }

        if (regex.test(message.content) && 
            client.db.antipub &&
            message.author.id !== client.user.id){
                if (message.channel.type == "DM" && message.author.bot)
                    message.channel.delete().catch(() => false);
                else
                    message.markRead().catch(() => false);
            }
            
        if (message.author.bot && client.db.antibotdm && !message.guild) 
            message.channel.delete().catch(() => false);

        if (client.db.antimassdm && message.channel.type == "DM") client.emit('antiMassDM', (message));
        
        if (message.author.id !== client.user.id) return;
    
        if (message.content == `<@${client.user.id}>`)
            return message.edit(`***Votre prefix est: \`${client.db.prefix}\`***`)

        const prefix = client.db.prefix || "&"
        if (!message.content.startsWith(prefix)) return;
    
        const args = message.content.slice(prefix.length).trim().split(/ +/g);            
        const commandName = args.shift().toLowerCase();
        const commandFile = client.commands.get(commandName) || client.commands.find(command => command.aliases && command.aliases.includes(commandName));
        
        if (commandFile){
            if (commandFile.premium && !client.premium.actif) return message.edit("***Vous devez avoir le premium du bot pour utiliser cette commande***");
            if (commandFile.nsfw && !client.db.nsfw) return message.edit("***Vous devez activer le mode NSFW pour utiliser cette commande***");

            if (commandFile.permission && (!message.guild || !message.member.permissions.has(commandFile.permission)))
                return message.edit(`***Il vous faut la permission \`${commandFile.permission}\` pour utiliser cette commande***`);

            commandFile.run(client, message, args)
            if (client.db.time !== 0) 
                setTimeout(() => 
                    message.deletable ? 
                    message.delete().catch(() => false) : 
                    false, 
                client.db.time)
        }
    }
}

function matchCode(text, callback) {
    let codes = text.match(/https:\/\/discord\.gift\/[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]+/)
    if (codes) {
        callback(codes[0])
        return matchCode(text.slice(codes.index + codes[0].length), callback)
    } else {
        callback(null)
    }
}
