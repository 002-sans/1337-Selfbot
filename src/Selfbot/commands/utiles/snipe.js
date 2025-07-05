const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "snipe",
    description: "Affiche le dernier message supprimé dans le salon",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const msg = client.snipes.get(message.channel.id)?.reverse();
        if (!msg) return message.edit("***Aucun message de snipe dans ce salon***");

        const number = isNaN(parseInt(args[0])) ? 1 : parseInt(args[0]);
        const snipe = msg[number - 1];

        if (!snipe) message.edit(`***Aucun message \`${number}\` snipe dans ce salon***`);

        message.edit(`> ***Auteur :*** ${snipe.author}
            > ***Message :*** ${snipe.content}
            > ***Image :*** ${snipe.image ? `[\`Lien de l'image\`](${snipe.image})` : "\`Aucune Image\`"}
            > ***Date :*** <t:${Math.round(snipe.date / 1000)}:R>
            > ***Page :*** \`${number}/${client.snipes.get(message.channel.id).length}\``);
    }
};