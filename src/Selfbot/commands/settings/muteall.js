const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "muteall",
    description: "Mute tous vos serveurs évitant les notifications",
    usage: "[off]",
    dir: "settings",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        message.edit(`***${args[0] == 'off' ? 'Unm' : 'M'}ute de \`${client.guilds.cache.size}\` serveurs...***`);

        for (const guild of client.guilds.cache.values()){
            await fetch(`https://discord.com/api/v9/users/@me/guilds/${guild.id}/settings`, {
                method: 'PATCH',
                headers: {
                    'Authorization': client.token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    muted: args[0] !== 'off',
                    suppress_roles: args[0] !== 'off',
                    suppress_everyone: args[0] !== 'off'
                })
            });

            await new Promise(r => setTimeout(r, 2000));
        }
    }
};