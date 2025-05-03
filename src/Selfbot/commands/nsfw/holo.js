const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "holo",
    description: "Envoie une image d'holo",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'holo').then(r => r.json())
        message.edit(res.message)
    }
}