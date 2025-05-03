const { Client, Message, MessageAttachment } = require("discord.js-selfbot-v13");

const games = {
    "clash-royale": "com.supercell.clashroyale",
    "clash-of-clans": "com.supercell.clashofclans",
    "brawl-stars": "com.supercell.brawlstars",
    "league": "com.riotgames.league.wildrift",
    "warzone": "com.activision.callofduty.warzone",
    "roblox": "com.roblox.client",
    "uno": "com.matteljv.uno",
    "geometry-dash": "com.robtopx.geometryjumplite",
    "subway": "com.kiloo.subwaysurf",
    "candy-crush": "com.king.candycrushsaga",
    "piano-tiles": "com.youmusic.magictiles",
    "minecraft": "com.mojang.minecraftpe",
    "fnaf": "com.scottgames.fivenightsatfreddys",
    "dokkan": "com.bandainamcogames.dbzdokkanww",
    "pokemon-go": "com.nianticlabs.pokemongo",
    "jcc-pokemon": "jp.pokemon.pokemontcgp",
    "genshin": "com.miHoYo.GenshinImpact",
    "stumble-guys": "com.kitkagames.fallbuddies",
    "blue-archive": "com.nexon.bluearchive",
    "honkai-impact": "com.miHoYo.bh3global",
    "honkai-star-rail": "com.HoYoverse.hkrpgoversea",
    "treasure-cruise": "com.namcobandaigames.spmoja010E",
    "sds": "com.netmarble.nanagb"
}

module.exports = {
    name: "samsungrpc",
    description: "Affiche la liste des rpc samsung",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const commandes = [];
        const perPage = 13; 

        for (const name of Object.keys(games).values()) {
            if (client.db.type == "image") {
                commandes.push(`${client.db.prefix}samsung ${name}`);
            } else {
                commandes.push(`${client.separator}${client.db.prefix}samsung ${name}${client.separator}・Joue à un RPC \`${name.replaceAll('-', ' ')}\``);
            }
        }

        if (client.db.type == 'image') {
            const pageImage = Math.max(1, parseInt(args[0], 10) || 1);
            const startIndex = (page - 1) * perPage;
            const paginatedCommandes = commandes.slice(startIndex, startIndex + perPage);

            if (paginatedCommandes.length === 0) return message.edit(`***Page \`${pageImage}\` invalide***`);

            const image = await client.card(client.db.name, client.db.image, paginatedCommandes);
            message.edit({ content: null, files: [new MessageAttachment(image, 'help.png')] });
        } else {
            message.edit(`> ***${client.db.name} Samsung RPC***\n${commandes.join('\n')}`);
        }
    }
};