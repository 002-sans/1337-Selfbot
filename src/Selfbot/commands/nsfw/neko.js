const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "neko",
    description: "Envoie une image de neko",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'neko').then(r => r.json())
        message.edit(res.message)
    }
}