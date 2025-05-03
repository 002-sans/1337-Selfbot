const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hboobs",
    description: "Envoie une image d'hboobs",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hboobs').then(r => r.json())
        message.edit(res.message)
    }
}