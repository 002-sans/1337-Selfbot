const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "secur",
    description: "Affiche la protection du serveur",
    dir: "antiraid",
    usage: "[on/off]",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const datas = [ 'wl', 'punish', 'crealimit' ];

        if (args[0] === "on")
            Object.keys(client.db.antiraid).filter(c => typeof client.db.antiraid[c] === "object").forEach(key => client.db.antiraid[key].etat = true);
        else if (args[0] === "off")
            Object.keys(client.db.antiraid).filter(c => typeof client.db.antiraid[c] === "object").forEach(key => client.db.antiraid[key].etat = false);

        client.save();
        
        const text = Object.keys(client.db.antiraid).filter(c => typeof client.db.antiraid[c] === "object").map(r => `**${r}:** \`${client.db.antiraid[r].etat ? "on" : "off"} - ${client.db.antiraid[r].punish ?? client.db.antiraid.punish}\``)
        if (client.db.type === "image"){
            const image = await client.card("Anti Raid", client.db.image, text.map(r => r.replaceAll('`', '').replaceAll('**', '')));
            message.edit({ content: null, files: [new MessageAttachment(image, 'antiraid.png')] });
        }
        else message.edit(`> ***${client.db.name} Anti Raid***\n${text.join('\n')}`);
    }
};