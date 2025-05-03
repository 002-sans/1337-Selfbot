const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "github",
    description: "Affiche les informations d'un utilisateur github",
    usage: "<pseudo>",
    dir: "utiles",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const data = await fetch(`https://api.github.com/users/${args[0]}`).catch(() => false);
        if (!data.ok) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        const res = await data.json().catch(() => false);
        if (!res) return message.edit(`***Aucun utilisateur de trouvé pour \`${args[0] ?? 'rien'}\`***`);

        message.edit(`> ***Informations du github de \`${args.join(' ')}\`***\n- \`Pseudo\`・${res.login}\n- \`ID\`・${res.id}\n- \`Bio\`・${res.bio ?? 'Aucune'}\n- \`Repo's Publiques\`・${res.public_repos}\n- \`Abonnés\`・${res.followers}\n- \`Abonnements\`・${res.following}\n- \`Localisation\`・${res.location ?? 'Inconnue'}\n- \`Type de compte\`・${res.user_view_type}\n- \`E-Mail\`・${res.email ?? 'Aucune'}\n- \`Twitter\`・${res.twitter_username ?? 'Aucun'}\n- \`Compte crée\`・<t:${ new Date(res.created_at) / 1000}:R>\n- \`Dernière MAJ\`・<t:${new Date(res.updated_at) / 1000}:R>`)
    }
}