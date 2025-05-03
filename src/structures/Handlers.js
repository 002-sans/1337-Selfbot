const fs = require('node:fs');
const Selfbot = require('discord.js-selfbot-v13');

function loadCommands(client, dir){
    client.commands = new Selfbot.Collection();
    fs.readdirSync(dir).forEach(dirs => {
        const commands = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
    
        for (const file of commands) {
            const getFileName = require(`../../${dir}/${dirs}/${file}`);
            client.commands.set(getFileName.name, getFileName);
            console.log(`> commande charger ${getFileName.name} [${dirs}]`)
        }
    })
}

function loadEvents(client, dir){
    fs.readdirSync(dir).forEach(dirs => {
        const events = fs.readdirSync(`${dir}/${dirs}`).filter(files => files.endsWith(".js"));
        
        for (const event of events) {
            const evt = require(`../../${dir}/${dirs}/${event}`);
            client[evt.ws ? "ws.on" : evt.once ? "once" : "on"](evt.name, (...args) => evt.run(...args, client))
            console.log(`> event charger ${evt.name}`)
        }
    })
}

module.exports = { loadCommands, loadEvents }