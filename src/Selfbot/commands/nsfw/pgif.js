const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "pgif",
    description: "Envoie une image de gif",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'pgif').then(r => r.json())
        message.edit(res.message)
    }
}