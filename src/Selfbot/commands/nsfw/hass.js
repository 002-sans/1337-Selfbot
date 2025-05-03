const api = "https://nekobot.xyz/api/image?type=";

module.exports = {
    name: "hass",
    description: "Envoie une image d'hass",
    premium: true,
    nsfw: true,
    dir: "nsfw",
    run: async (client, message, args) => {
        const res = await fetch(api + 'hass').then(r => r.json())
        message.edit(res.message)
    }
}