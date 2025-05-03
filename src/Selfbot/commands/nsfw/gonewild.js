const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "gonewild",
    description: "Envoie une image de gonewild",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'gonewild').then(r => r.json())
        message.edit(res.message)
    }
}