const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "volume",
    description: "Modifie le volume du client spotify",
    dir: "spotify",
    usage: "<nombre>",
    premium: true,
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const connexions = await client.api.users('@me').connections.get()
        if (!connexions || connexions.filter(a => a.type === "spotify").length === 0) return message.edit("***Veuillez connecter un compte spotify à votre compte Discord***");

        if (!args[0] || isNaN(parseInt(args[0])) || parseInt(args[0]) < 0 || parseInt(args[0]) > 100) 
            return message.edit("***Veuillez entrer un volume entre \`0\` et \`100\`***");

        const res = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${parseInt(args[0])}`, {
            method: "PUT", headers: {
                authorization: `Bearer ${connexions.find(a => a.type === "spotify").access_token}`
            }
        });


        if (res.status === 401) return message.edit("***Le token d'accès à spotify a expiré***");
        if (res.status === 429) return message.edit("***Vous avez fait trop de commande spotify, veuillez attendre avant de recommencer***");
        if (res.status === 200) return message.edit(`***Le volume a bien été modifié***`);

        return message.edit("***Une erreur s'est produite lors de la modification du volume***");
    }
};