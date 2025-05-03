const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "pussy",
    description: "Envoie une image de pussy",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'pussy').then(r => r.json())
        message.edit(res.message)
    }
}