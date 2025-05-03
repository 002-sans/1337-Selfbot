const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hthigh",
    description: "Envoie une image de tentacule",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'tenntacle').then(r => r.json())
        message.edit(res.message)
    }
}