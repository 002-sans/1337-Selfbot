const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hmidriff",
    description: "Envoie une image d'hmidriff",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hmidriff').then(r => r.json())
        message.edit(res.message)
    }
}