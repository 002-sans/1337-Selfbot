const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hneko",
    description: "Envoie une image d'hneko",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hneko').then(r => r.json())
        message.edit(res.message)
    }
}