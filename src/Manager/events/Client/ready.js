const { REST } = require('@discordjs/rest');
const Discord = require('discord.js');
const fs = require('node:fs');
const commands = [];

module.exports = {
    name: Discord.Events.ClientReady,
    once: true,
    /**
     * @param {Discord.Client} client
    */
    run: async client => {
        console.log(`[MANAGER] ${client.user.displayName} est connecté`);

        for (const folder of fs.readdirSync(`./src/Manager/commands`).map(r => r)) {
            const files = fs.readdirSync(`./src/Manager/commands/${folder}`).filter(f => f.endsWith(".js"))
            for (const file of files) {
                const f = require(`../../commands/${folder}/${file}`)
                if (f.data) commands.push(f.data.toJSON())
            }
        }

        const rest = new REST({ version: '10' }).setToken(client.token);
        rest.put(Discord.Routes.applicationCommands(client.user.id), { body: commands })
    }
}