const { Client, Message, MessageAttachment } = require("discord.js-selfbot-v13");
const { pipeline } = require('node:stream');
const { promisify } = require('node:util');
const pipelineAsync = promisify(pipeline);
const archiver = require('archiver');
const path = require('node:path');
const fs = require('node:fs');


module.exports = {
    name: "emoji-bumper",
    description: "Envoie un fichier .zip des emojis du serveur",
    usage: "<guildID>",
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const guild = client.guilds.cache.get(args[0]) || message.guild;

        if (!guild) return message.edit(`***Aucun serveur de trouvé pour \`${args[0] ?? 'rien'}\`***`);
        if (guild.emojis.cache.size == 0) return message.edit(`***\`${message.guild.name}\` ne contient aucun emoji***`);

        message.edit(`***Téléchargement de \`${guild.emojis.cache.size}\` emojis en cours...***`)

        if (!fs.existsSync(`${guild.id}-${message.id}`)) await fs.promises.mkdir(`${guild.id}-${message.id}`);

        for (const emoji of guild.emojis.cache.values()) {
            const filePath = path.join(__dirname, '..', '..', '..', `${guild.id}-${message.id}`, `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`);

            const response = await fetch(`https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`).catch(() => false);
            if (!response.ok) return;
        
            await pipelineAsync(response.body, fs.createWriteStream(filePath));        
        }

        await zipFolder(`${guild.id}-${message.id}`, `${message.id}-emojis.zip`);
        if (message.deletable) message.delete().catch(() => false);
        await message.channel.send({ files: [new MessageAttachment(`./${message.id}-emojis.zip`, `Emojis de ${guild.name}.zip`)] })

        fs.rmSync(`./${guild.id}-${message.id}`, { recursive: true });
        fs.unlinkSync(`./${message.id}-emojis.zip`);
    }
};

function zipFolder(folderPath, outputPath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => resolve());

        archive.on('error', (err) => reject(err));
        archive.pipe(output);
        archive.directory(folderPath, false);
        archive.finalize();
    });
};
