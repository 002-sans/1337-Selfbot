const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "playing",
    description: "Affiche votre musique en cours",
    dir: "spotify",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const connexions = await client.api.users('@me').connections.get()
        if (!connexions || connexions.filter(a => a.type === "spotify").length === 0) return message.edit("***Veuillez connecter un compte spotify à votre compte Discord***");

        const res = await fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            method: "GET", 
            headers: {
                authorization: `Bearer ${connexions.find(a => a.type === "spotify").access_token}`
            }
        })

        if (res.status === 401) return message.edit("***Le token d'accès à spotify a expiré***");
        if (res.status === 429) return message.edit("***Vous avez fait trop de commande spotify, veuillez attendre avant de recommencer***");

        const data = await res.json().catch(() => false);
        if (!data?.item) return message.edit("***Vous n'avez aucune musique actuellement en cours***");

        const totalSeconds = Math.floor(data.item.duration_ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return message.edit(`> ***Joue la musique \`${data.item.name}\`***\n- \`Nom\`・${data.item.name}\n- \`Temps\`・${data.progress_ms / 1000}/${minutes}.${seconds.toString().padStart(2, '0')}\n- \`Artistes\`・${data.item.artists.length > 0 ? data.item.artists.map((r) => r.name).join(', ') : 'Aucun'}\n- \`Album\`・${data.item.album?.name ?? 'Aucun'}\n- \`Artistes de l'album\`・${data.item.album.artists.length > 0 ? data.item.album.artists.map((r) => r.name).join(', ') : 'Aucun'}\n- \`Image de l'Album\`・${data.item.album.images.length == 0 ? 'Aucune' : `[Image](${data.item.album.images[0].url})`}\n- \`Nom de l'album\`・${data.item.album?.name ?? 'Aucun'}\n- \`Date de sortie\`・${data.item.album?.release_date ?? 'Aucune Donnée'}\n- \`Nombre de musiques\`・${data.item.album?.total_tracks ?? 'Aucune Donnée'}\n- \`Explicite\`・${data.item.explicit ? 'Oui' : 'Non'}`);
    }
};