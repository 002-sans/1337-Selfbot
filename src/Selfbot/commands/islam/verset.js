const { Client, Message } = require("discord.js-selfbot-v13");

module.exports = {
    name: "verset",
    description: "Affiche un verset du Coran",
    dir: "islam",
    usage: "[sourate] [verset]",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {string[]} args
    */
    run: async (client, message, args) => {
        const sourate = Number(args[0]) ? args[0] :  Math.floor(Math.random() * 114) + 1;
        
        if (sourate < 1 || sourate > 114) 
            return message.edit("***Veuillez entrer un nombre d'une sourate entre 1 et 114***");

        const res = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/fra-islamicfoundati-la/${sourate}.json`);
        if (!res) 
            return message.edit("***Contact avec l'API impossible***");

        const { chapter } = await res.json();
        if (!chapter) 
            return message.edit("***Probleme rencontre lors de la recuperation des versets***");

        const versets = Number(args[1]) ? args[1] :  Math.floor(Math.random() * chapter.length) + 1;
        if (versets < 1 || versets > chapter.length) 
            return message.edit(`***Veuillez entrer un nombre d'un verset entre 1 et ${chapter.length}***`);

        const verset = chapter.find(c => c.chapter == sourate && c.verse == versets);
        message.edit(`***Chapitre:*** \`n°${verset.chapter}\`\n***Verset:*** \`n°${verset.verse}\`\n***Texte:*** \`${verset.text}\``);
    }
};