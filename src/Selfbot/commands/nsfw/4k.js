const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "4k",
    description: "Envoie une image en 4K",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + '4k').then(r => r.json())
        message.edit(res.message)
    }
}