const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hanal",
    description: "Envoie une image d'hanal",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hanal').then(r => r.json())
        message.edit(res.message)
    }
}