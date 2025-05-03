const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "ipinfo",
    description: "Affiche l'information d'une IP",
    usage: "<ip>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {

        if (!args[0]) return message.edit('***Veuillez entrer une IP valide***');

        const res = await fetch(`http://ip-api.com/json/${args[0]}`).catch(() => false);
        const json = await res.json().catch(() => false);
  
        if (json.status !== "success")
            return message.edit(`***L'IP \`${args[0]}\` est invalide***`);
  
        message.edit(`> ***Informations sur l'IP \`${args[0]}\`***\n- \`Ville\`・${json.city ?? '?'}\n- \`Région\`・${json.regionName ?? '?'}\n- \`Pays\`・${json.country ?? '?'} ${json.countryCode ? `(\`${json.countryCode}\`)` : ''}\n- \`Code Postal\`・${json.zip ?? '?'}\n- \`Coordonnées\`・${json.lat && json.lon ? `[\`Google Maps\`](<https://www.google.com/maps/place/${json.lat},${json.lon}>)` : '?'}\n- \`Organisation\`・${json.org ?? ''}\n- \`Fuseau Horaire\`・${json.timezone ?? '?'}`)
    }
};