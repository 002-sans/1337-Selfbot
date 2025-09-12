const example = require('../../utils/db/example.json');
const Discord = require('discord.js-selfbot-v13');
const codes = require('../../codes.json');
const handler = require('./Handlers');
const Canvas = require('canvas');
const os = require('node:os');
const fs = require('node:fs');

const devices = {
    "web": { os: "Other", browser: "Discord Web" },
    "mobile": { os: "Android", browser: "Discord Android" },
    "desktop": { os: "Linux", browser: "Discord Client" },
    "console": { os: "Windows", browser: "Discord Embedded" },
}

class Selfbot extends Discord.Client {
    constructor(options) {
        if (!options.token || options.token == "") return false;

        const userId = Buffer.from(options.token.split(".")[0], "base64").toString("utf-8")

        while (!fs.existsSync(`./utils/db/${userId}.json`))
            fs.writeFileSync(`./utils/db/${userId}.json`, JSON.stringify(example, null, 4))

        const db = require(`../../utils/db/${userId}.json`)

        super({
            presence: {
                afk: db?.notif ?? false,
                status: db?.status ?? 'online'
            },
            ws: {
                properties: {
                    os: devices[db ? db["platform"] : "desktop"].os,
                    browser: devices[db ? db["platform"] : "desktop"].browser,
                }
            },
            makeCache: Discord.Options.cacheWithLimits({}),
        });

        this.setMaxListeners(0);
        this.db = db;
        this.data = {};
        this.snipes = new Map();
        this.antiraid = new Map();
        this.config = require('../../config.json');
        this.premium = this.config.premium ? this.db.premium && codes[this.db.premium] ? this.premium = codes[this.db.premium] : { actif: false } : { actif: true, code: "free premium", expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 364, redeemedAt: Date.now() };
        this.load = c => loadSelfbot(c);
        this.saveCode = () => fs.writeFileSync('./codes.json', JSON.stringify(codes, null, 4));

        this.join = async (channel_id = this.db.autovoice.channel_id) => {
            const channel = await this.channels.fetch(channel_id).catch(() => false);
            if (!channel) return false;

            this.ws.broadcast({
                op: 4,
                d: {
                    guild_id: channel.guildId ?? null,
                    channel_id: channel_id,
                    self_mute: this.db.autovoice.self_mute,
                    self_deaf: this.db.autovoice.self_deaf,
                    self_video: this.db.autovoice.self_video,
                    flags: 2,
                },
            });

            if (this.db.autovoice.self_stream) {
                this.ws.broadcast({
                    op: 18,
                    d: {
                        type: channel.guild ? 'guild' : 'dm',
                        guild_id: channel.guildId ?? null,
                        channel_id: channel_id,
                        preferred_region: "japan"
                    }
                })
            }
            else {
                this.ws.broadcast({
                    op: 19,
                    d: { stream_key: `${channel.guildId ? `guild:${channel.guildId}` : 'call'}:${channel.id}:${this.user.id}` }
                });
            }
        }

        this.send = async (message, content) => {
            const chunks = splitMessage(content, 2000);

            for (const chunk of chunks) {
                const msg = await message.channel.send(chunk);

                if (this.db.time !== 0)
                    setTimeout(() =>
                        msg.deletable ?
                            msg.delete().catch(() => false) :
                            false,
                        this.db.time)
            }
        }

        this.card = async (title, img, commands) => {

            const canvas = Canvas.createCanvas(350, 400);
            const ctx = canvas.getContext('2d');


            const colorThemes = {
                green: { primary: '#00FF88', secondary: '#003D2A', accent: '#00CC6A', bg: '#001A11' },
                blue: { primary: '#00BFFF', secondary: '#001F3F', accent: '#0099CC', bg: '#000D1A' },
                purple: { primary: '#BB86FC', secondary: '#2D1B69', accent: '#9C27B0', bg: '#1A0D33' },
                red: { primary: '#FF6B6B', secondary: '#4A0E0E', accent: '#E53E3E', bg: '#1A0606' },
                orange: { primary: '#FF8C42', secondary: '#4A2C0A', accent: '#FF6B35', bg: '#1A1006' },
                pink: { primary: '#FF69B4', secondary: '#4A1B3A', accent: '#E91E63', bg: '#1A0A15' },
                cyan: { primary: '#00E5FF', secondary: '#003D4A', accent: '#00BCD4', bg: '#00151A' },
                yellow: { primary: '#FFD700', secondary: '#4A3D00', accent: '#FFC107', bg: '#1A1500' }
            };


            const theme = colorThemes[this.db.cardColor] || colorThemes.green;


            const bgGradient = ctx.createRadialGradient(175, 200, 50, 175, 200, 300);
            bgGradient.addColorStop(0, theme.secondary);
            bgGradient.addColorStop(0.4, theme.bg);
            bgGradient.addColorStop(1, '#000000');
            ctx.fillStyle = bgGradient;
            ctx.fillRect(0, 0, 350, 400);


            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            for (let i = 0; i < 15; i++) {
                const x = Math.random() * 350;
                const y = Math.random() * 400;
                const size = Math.random() * 2 + 1;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
            }


            ctx.strokeStyle = theme.primary;
            ctx.lineWidth = 2;
            ctx.shadowColor = theme.primary;
            ctx.shadowBlur = 10;
            ctx.strokeRect(5, 5, 340, 390);
            ctx.shadowBlur = 0;


            ctx.globalAlpha = 0.2;
            drawRoundedRect(ctx, 15, 15, 320, 70, 15, theme.secondary);
            ctx.globalAlpha = 1;


            ctx.shadowColor = theme.primary;
            ctx.shadowBlur = 8;
            ctx.font = 'bold 28px Arial';
            ctx.fillStyle = theme.primary;
            ctx.fillText(title, 25, 50);
            ctx.shadowBlur = 0;


            ctx.font = 'bold 11px Arial';
            ctx.fillStyle = theme.accent;
            ctx.fillText('<> = obligatoire, [] = optionnel', 25, 70);


            ctx.globalAlpha = 0.1;
            drawRoundedRect(ctx, 15, 100, 320, 285, 15, theme.secondary);
            ctx.globalAlpha = 1;


            ctx.strokeStyle = theme.accent;
            ctx.lineWidth = 1;
            ctx.shadowColor = theme.accent;
            ctx.shadowBlur = 5;
            drawRoundedRectStroke(ctx, 15, 100, 320, 285, 15);
            ctx.shadowBlur = 0;


            ctx.font = 'bold 14px Arial';
            commands.forEach((command, index) => {
                const y = 125 + index * 19;
                if (y < 370) {

                    if (index % 2 === 0) {
                        ctx.globalAlpha = 0.05;
                        drawRoundedRect(ctx, 20, y - 12, 310, 16, 5, theme.primary);
                        ctx.globalAlpha = 1;
                    }
                    
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillText(command, 25, y);
                }
            });


            const logoSize = 80;
            const logoX = 250;
            const logoY = 20;


            ctx.shadowColor = theme.primary;
            ctx.shadowBlur = 15;
            ctx.globalAlpha = 0.3;
            drawRoundedRect(ctx, logoX - 5, logoY - 5, logoSize + 10, logoSize + 10, 12, theme.secondary);
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;


            try {
                const logoImg = await Canvas.loadImage(img || this.config.logo);
                

                ctx.save();
                drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 10, '#000');
                ctx.clip();
                ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
                ctx.restore();


                ctx.strokeStyle = theme.primary;
                ctx.lineWidth = 2;
                ctx.shadowColor = theme.primary;
                ctx.shadowBlur = 8;
                drawRoundedRectStroke(ctx, logoX, logoY, logoSize, logoSize, 10);
                ctx.shadowBlur = 0;

                
                ctx.strokeStyle = theme.accent;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.6;
                drawRoundedRectStroke(ctx, logoX + 2, logoY + 2, logoSize - 4, logoSize - 4, 8);
                ctx.globalAlpha = 1;

            } catch (error) {

                ctx.fillStyle = theme.secondary;
                drawRoundedRect(ctx, logoX, logoY, logoSize, logoSize, 10, theme.secondary);
                
                ctx.strokeStyle = theme.primary;
                ctx.lineWidth = 2;
                drawRoundedRectStroke(ctx, logoX, logoY, logoSize, logoSize, 10);
                

                ctx.fillStyle = theme.primary;
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('?', logoX + logoSize/2, logoY + logoSize/2 + 8);
                ctx.textAlign = 'left';
            }


            const lineGradient = ctx.createLinearGradient(15, 390, 335, 390);
            lineGradient.addColorStop(0, 'transparent');
            lineGradient.addColorStop(0.5, theme.primary);
            lineGradient.addColorStop(1, 'transparent');
            ctx.strokeStyle = lineGradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(15, 390);
            ctx.lineTo(335, 390);
            ctx.stroke();


            return canvas.toBuffer('image/png', {
                compressionLevel: 9,
                filters: Canvas.PNG_FILTER_NONE
            });
        }

        this.replace = text => {
            if (!text || typeof text !== "string") return text;

            const citation = require('./citations.json'), b = []
            Object.keys(citation).forEach(a => citation[a].forEach(c => b.push(c)))

            const data = {
                '{ram}': `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(2)}`,
                '{knowledgequotes}': citation.knowledge[Math.floor(Math.random() * citation.knowledge.length)],
                '{businessquotes}': citation.buinsess[Math.floor(Math.random() * citation.buinsess.length)],
                '{treasonquotes}': citation.trahison[Math.floor(Math.random() * citation.trahison.length)],
                '{enemyquotes}': citation.enemy[Math.floor(Math.random() * citation.enemy.length)],
                '{moneyquotes}': citation.money[Math.floor(Math.random() * citation.money.length)],
                '{deathquotes}': citation.death[Math.floor(Math.random() * citation.death.length)],
                '{lifequotes}': citation.life[Math.floor(Math.random() * citation.life.length)],
                '{fearquotes}': citation.fear[Math.floor(Math.random() * citation.fear.length)],
                '{artquotes}': citation.art[Math.floor(Math.random() * citation.art.length)],
                '{warquotes}': citation.war[Math.floor(Math.random() * citation.war.length)],
                '{sexquotes}': citation.sexe[Math.floor(Math.random() * citation.sexe.length)],
                '{islamquotes}': citation.islam[Math.floor(Math.random() * citation.islam.length)],
                '{christquotes}': citation.christ[Math.floor(Math.random() * citation.christ.length)],
                '{manipulationquotes}': citation.manipulation[Math.floor(Math.random() * citation.manipulation.length)],
                '{psyquotes}': citation.psy[Math.floor(Math.random() * citation.psy.length)],
                '{treasonquotes}': citation.trahison[Math.floor(Math.random() * citation.trahison.length)],
                '{randomquotes}': b[Math.floor(Math.random() * b.length)],
                '{blocked}': this.relationships.blockedCache.size,
                '{friends}': this.relationships.friendCache.size,
                '{messagesdeleted}': this.db.messages_delete,
                '{totalsniped}': this.db.snipe_count || 0,
                '{servers}': this.guilds.cache.size,
                '{messages}': this.db.message_count,
                '{users}': this.users.cache.size,
                '{ping}': `${Math.round(this.ws.ping)}ms`,
                "{date}": new Date().toLocaleDateString("fr"),
                "{time}": new Date().toLocaleTimeString("fr", { hour12: false }),
                "{fulldate}": new Date().toLocaleString("fr")
            }

            Object.keys(data).forEach(value => text = text.replaceAll(value, data[value]))
            return text
        };


        this.separator = '\`'
        this.save = () => fs.writeFileSync(`./utils/db/${userId}.json`, JSON.stringify(this.db, null, 4))

        if (!this.config.tokens.includes(encrypt(options.token, 'megalovania'))) {
            this.config.tokens.push(encrypt(options.token, 'megalovania'))
            fs.writeFileSync("./config.json", JSON.stringify(this.config, null, 2));
        }

        Object.keys(example)
            .filter(key => !this.db[key] && key !== "first_connection")
            .forEach(key => this.db[key] = example[key]);
        this.save()

        this.connect = () => {
            if (!this.config.tokens.includes(encrypt(options.token, 'megalovania'))) this.config.tokens.push(encrypt(options.token, 'megalovania'));
            fs.writeFileSync("./config.json", JSON.stringify(this.config, null, 2));

            this.login(options.token).catch((e) => {
                if (e.message !== "An invalid token was provided.")
                    return console.log(e);

                this.config.tokens = this.config.tokens.filter(t => t !== encrypt(options.token, 'megalovania'));
                return fs.writeFileSync("./config.json", JSON.stringify(this.config, null, 2));
            })
        }


        const loadSelfbot = (token) => {
            const client = new Selfbot({ token })
            client.connect()

            handler.loadCommands(client, "./src/Selfbot/commands")
            handler.loadEvents(client, "./src/Selfbot/events")
        }
    }
}

function drawRoundedRect(ctx, x, y, width, height, radius, color) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

function drawRoundedRectStroke(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.stroke();
};

function splitMessage(content, maxLength) {
    const lines = content.split('\n');
    const chunks = [];
    let currentChunk = '';

    for (const line of lines) {
        if ((currentChunk + line).length > maxLength) {
            chunks.push(currentChunk);
            currentChunk = line;
        } else currentChunk += (currentChunk ? '\n' : '') + line;
    }

    if (currentChunk) chunks.push(currentChunk);
    return chunks;
}


module.exports = { Selfbot };
