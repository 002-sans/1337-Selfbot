const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "playsong",
    description: "Joue une musique sur spotify",
    dir: "spotify",
    usage: '<musique>',
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const connexions = await client.api.users('@me').connections.get()

        if (connexions.filter(a => a.type === "spotify").length === 0) return message.edit("***Veuillez connecter un compte spotify à votre compte Discord***");
        if (!args[0]) return message.edit('***Veuillez entrer une musique valide***')

        const search = await fetch(`https://api.spotify.com/v1/search?type=track&limit=1&q=${encodeURIComponent(args.join(' '))}`, {
            method: "GET", 
            headers: {
                authorization: `Bearer ${connexions.find(a => a.type === "spotify").access_token}`
            }
        }).then(r => r.json().catch(() => false)).catch(() => false);
                    
        if (search.error?.status === 401) return message.edit("***Le token d'accès à spotify a expiré***");
        if (search.tracks.total === 0) return message.edit(`***Aucune musique de trouvé pour \`${args.join(' ')}\`***`)

        const res = await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: "PUT", 
            body: JSON.stringify({ uris: [search.tracks.items[0].uri] }), 
            headers: {
                authorization: `Bearer ${connexions.find(a => a.type === "spotify").access_token}`
            }
        })


        if (res.status === 401) return message.edit("***Le token d'accès à spotify a expiré***");
        if (res.status === 429) return message.edit("***Vous avez fait trop de commande spotify, veuillez attendre avant de recommencer***");
        if (res.status === 200) return message.edit(`***La musique \`${args.join(' ')}\` a bien été ajouté à la queue***`);
        else return message.edit("***Une erreur est survenue lors de el'ajout de la musique***");
    }
};