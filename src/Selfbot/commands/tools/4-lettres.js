const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "4-lettres",
    description: "Génère un pseudo 4 lettres",
    premium: true,
    dir: "tools",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        let i = 0;
        const tested = [];
        
        message.edit("***Je vais rechercher un pseudo 4 lettres, celà peut prendre un certain temps***");
        
        let username;
        let available = false;
        while (!available) {
            username = generateRandomLetters();
            if (tested.includes(username)) continue;
            available = await checkNickname(client.token, username);
            tested.push(username)
            i++
        }

        if (message.editable) message.edit(`***Après \`${i}\` tentatives de recherche le pseudo \`${username}\` est disponnible***`);
        else if (message.channel.sendable) message.channel.send(message.edit(`***Après \`${i}\` tentatives de recherche le pseudo \`${username}\` est disponnible***`))
    }
};

function generateRandomLetters() {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    
    for (let i = 0; i < 4; i++) {
        result += letters[Math.floor(Math.random() * letters.length)];
    }
    
    return result;
};

async function checkNickname(token, username) {
    const r = await fetch("https://discord.com/api/v9/users/@me/pomelo-attempt", {
        headers: {
            'accept': "*/*",
            'authorization': token,
            'content-type': "application/json"
        },
        body: JSON.stringify({ username }),
        method: "POST"
    }).then(r => r.json()).catch(() => false);
    
    if (r?.taken === true) return false;
    else if (r?.retry_after) { 
        await new Promise(resolve => setTimeout(resolve, r.retry_after * 1000));
        return false;
    }
    else if (r.taken == false) return r.taken === false;
};
