const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "anal",
    description: "Envoie une image d'anal",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'anal').then(r => r.json())
        message.edit(res.message)
    }
}