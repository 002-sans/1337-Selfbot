const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "boobs",
    description: "Envoie une image de seins",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'boobs').then(r => r.json())
        message.edit(res.message)
    }
}