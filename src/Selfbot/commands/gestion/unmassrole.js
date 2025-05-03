const { Client, Message } = require("discord.js-selfbot-v13");
const types = ['humain', 'bot', 'all'];

module.exports = {
    name: "unmassrole",
    description: "Retire un rôle à tous les membres",
    dir: "gestion",
    premium: true,
    usage: "<humain/bot/all> <role>",
    permission: 'MANAGE_ROLES',
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!types.includes(args[0])) return message.edit(`> ***Veuillez choisir un des types ci dessous***\n${types.map(r => `- ${r}`).join('\n')}`);
        
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]) || message.guild.roles.cache.find(r => r.name.includes(args[1])) || await message.guild.roles.fetch(args[1]).catch(() => false);
        if (!role || !args[1]) return message.edit(`***Aucun rôle de trouvé pour \`${args[1] ?? 'rien'}\`***`);
        if (!role.editable) return message.edit(`***Je ne peux pas retirer le rôle \`${role.name}\`***`);

        const members = message.guild.members.cache.filter(m => m.roles.cache.has(role.id) && (args[0] === 'all' || (args[0] === 'bot' ? m.user.bot : !m.user.bot)));
        if (members.size === 0) return message.edit(`***Aucun membre à qui retirer le rôle \`${role.name}\`***`);
        
        message.delete().catch(() => false);
        
        let noe = 0;
        let err = 0;

        const m = await message.channel.send(`Je suis en train de retirer le rôle de **${members.size}** membres\nJ'ai retiré le rôle de **${noe}** membres\nJe n'ai pas pu retirer le rôle de **${err}** membres`)
        const int = setInterval(() => m.edit(`Je suis en train de retirer le rôle de **${members.size}** membres\nJ'ai retiré le rôle de **${noe}** membres\nJe n'ai pas pu retirer le rôle de **${err}** membres`), 5000);
        for (const member of members.map(r => r)){
            try{
                await member.roles.remove(role);
                await client.sleep(500);
                noe++
            }
            catch { err++ }
        }
        m.edit(`Je suis en train de retirer le rôle de **${members.size}** membres\nJ'ai retiré le rôle de **${noe}** membres\nJe n'ai pas pu retiré le rôle de **${err}** membres`);
        clearInterval(int)
    }
};