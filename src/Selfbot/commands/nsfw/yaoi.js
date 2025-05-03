const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "yaoi",
    description: "Envoie une image de yaoi",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'yaoi').then(r => r.json())
        message.edit(res.message)
    }
}