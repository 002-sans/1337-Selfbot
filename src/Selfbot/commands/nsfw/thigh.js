const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "thigh",
    description: "Envoie une image de thigh",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'thigh').then(r => r.json())
        message.edit(res.message)
    }
}