const { Client, Message } = require("discord.js-selfbot-v13");
const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com\/|vm\.tiktok\.com\/)/;

module.exports = {
    name: "tiktok",
    description: "Permet de regarder un tiktok sur Discord",
    usage: "<lien>",
    premium: true,
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!tiktokRegex.test(args[0])) return message.edit(`***Veuillez envoyer un lien de vidéo tiktok valide***`);
        
        const response = await fetch("https://api.quickvids.win/v1/shorturl/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input_text: args[0] }),
        }).catch(() => false);
            
        if (!response.ok) return message.edit("***Une erreur est survenue lors de la récupération du lien***");

        const data = await response.json().catch(() => false);
        if (!data || !data.quickvids_url) return message.edit("***Une erreur est survenue lors de la récupération du lien***");
        message.edit(`> ***Voici votre vidéo tiktok***\n${data.quickvids_url}`);
    }
}