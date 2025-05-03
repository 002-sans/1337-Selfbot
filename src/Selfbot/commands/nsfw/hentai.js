const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hentai",
    description: "Envoie une image d'hentai",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hentai').then(r => r.json())
        message.edit(res.message)
    }
}