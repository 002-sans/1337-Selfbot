const path = require('node:path');
const cron = require('node-cron');
const { exec } = require('child_process');
const Discord = require('discord.js-selfbot-v13');

let localStorage = [];

module.exports = {
    name: "ready",
    once: true,
    /**
     * @param {Discord.Client} client
     */
    run: async (client) => {
        setInterval(async () => {
            if (!client.db.sessions.enable) return;

            try {
                const data = await client.api.auth.sessions.get();
                if (!data.user_sessions || data.user_sessions.length === 0) return;
                if (localStorage.length === 0 || data.user_sessions.length < localStorage.length) return localStorage = data.user_sessions.map(s => s.id_hash);

                for (const session of data.user_sessions) {
                    const { id_hash, client_info } = session;

                    if (localStorage.includes(id_hash)) continue;
                    if (client.db.sessions.wl.includes(client_info.location) || client.db.sessions.wl.includes(client_info.platform)) continue;

                    exec(`bun protect.js ${id_hash} ${client.token} ${client.mfaToken}`, 
                        { cwd: path.join(__dirname, '../../../structures')  },
                        (error, stdout, stderr) => {
                        if (error) console.error(`Erreur child process: ${error.message}`);
                        if (stderr) console.error(`stderr: ${stderr}`);
                        if (stdout) console.log(`stdout: ${stdout}`);
                    });

                    localStorage.push(id_hash);
                }
            } catch (err) {
                console.error('Erreur lors de la récupération des sessions :', err);
            }
        }, 1000 * 10);
    }
};
