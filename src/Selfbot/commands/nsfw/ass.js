const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "add",
    description: "Envoie une image de fesses",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'ass').then(r => r.json())
        message.edit(res.message)
    }
}