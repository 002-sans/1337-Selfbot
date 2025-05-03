const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "punish",
    description: "Modifie la sanction lors d'un raid",
    dir: "antiraid",
    usage: "<all/module> <derank/kick/ban>",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        switch(true){
            case args[0] === 'all':
                if (!['derank', 'kick', 'ban'].includes(args[1])) return message.channel.send('***Veuillez choisir une sanction valide: `derank`, `kick`, `ban`***');
                
                Object.keys(client.db.antiraid).forEach(r => client.db.antiraid[r].punish = null);
                client.db.antiraid.punish = args[1];
                client.save();

                message.edit(`***La sanction est maintenant un \`${args[1]}\`***`);
                break;

            case Object.keys(client.db.antiraid).includes(args[0]):
                client.db.antiraid[args[0]].punish = args[1]
                client.save();
    
                message.edit(`***La sanction du module \`${args[0]}\` est maintenant un \`${args[1]}\`***`);
                break;
        }
    }
};