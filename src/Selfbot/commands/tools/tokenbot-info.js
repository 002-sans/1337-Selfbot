const { Client, Message } = require("discord.js-selfbot-v13");
const nitroType = { 0: "No Nitro", 1: "Nitro Basic", 2: "Nitro Boost" };

module.exports = {
    name: "tokenbot-info",
    description: "Vérifie si le token d'un bot est valide",
    usage: "<token>",
    premium: true,
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        if (!args[0]) return message.edit("***Veuillez entrer un token de bot valide***");

        const res  = await fetch('https://discord.com/api/v10/users/@me', { 
            headers: { 
                authorization: 'Bot ' + args[0].replaceAll('"', '') 
            } 
        }).catch(() => false);
        
        if (res.status !== 200) return message.edit("***Le token est invalide***");
        const data = await res.json().catch(() => false);

        if (!data?.id) return message.edit("***Un problème est survenu lors de la récupération des informations***");

        message.edit(`> ***Token Info de \`${data.global_name ?? data.username}\`***\n- \`Pseudo\`・${data.username}\n- \`ID\`・${data.id}\n- \`Pseudo Affiché\`・${data.global_name ?? data.username}\n- \`E-Mail\`・${data.email ?? 'Aucun Email'}\n- \`E-Mail Verifié\`${data.verified ? 'Oui' : 'Non'}\n- \`Numéro de Téléphone\`・${data.phone ?? 'Aucun'}\n- \`Langue Discord\`・${data.locale}\n- \`A2F\`・${data.mfa_enable ? 'Activé' : 'Désactivé'}\n- \`Nitro\`・${nitroType[data.nitro_type]}\n- \`NSFW\`・${data.nsfw_allowed ? 'Autorisé' : 'Non Autorisé'}\n- \`Avatar\`・${data.avatar ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.webp` : 'Aucune'}\n- \`Bannière\`・${data.banner ? `https://cdn.discordapp.com/banners/${data.id}/${data.banner}.webp` : 'Aucune'}\n- \`Bio\`・${data.bio ?? 'Aucune bio'}`)            
    }
};