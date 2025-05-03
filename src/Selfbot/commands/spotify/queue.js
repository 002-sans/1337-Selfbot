const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "queue",
    description: "Affiche vos musiques spotify",
    dir: "spotify",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const connexions = await client.api.users('@me').connections.get()
        if (connexions.filter(a => a.type === "spotify").length === 0) return message.edit("***Veuillez connecter un compte spotify à votre compte Discord***");

        const res = await fetch(`https://api.spotify.com/v1/me/player/queue`, {
            method: "GET", 
            headers: {
                authorization: `Bearer ${connexions.find(a => a.type === "spotify").access_token}`
            }
        })

        if (res.status === 401) return message.edit("***Le token d'accès à spotify a expiré***");
        if (res.status === 429) return message.edit("***Vous avez fait trop de commande spotify, veuillez attendre avant de recommencer***");

        const data = await res.json().catch(() => false);
        if (!data || data.queue.length === 0) return message.edit("***Vous n'avez aucune musique dans votre queue***");

        return message.edit(`> ***Queue Spotify***\n${data.queue.map((r, i) => `- \`${i+1}\` - ${r.name}`).join('\n')}`);
    }
};