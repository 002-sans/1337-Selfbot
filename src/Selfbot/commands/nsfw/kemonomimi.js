const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "kemonomimi",
    description: "Envoie une image d'kemonmimi",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'kemonomimi').then(r => r.json())
        message.edit(res.message)
    }
}