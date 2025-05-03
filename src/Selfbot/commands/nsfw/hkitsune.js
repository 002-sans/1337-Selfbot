const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hkitsune",
    description: "Envoie une image d'hkitsune",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hkitsune').then(r => r.json())
        message.edit(res.message)
    }
}