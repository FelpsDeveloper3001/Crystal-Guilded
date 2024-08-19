const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'tod',
    category: 'games',
    description: 'Pergunta uma verdade ou desafio aleatório',
    noArgs: true,
    args: ['todChoice'],
    run: async (client, message, args) => {
        let choices = ['truth', 'dare'];
        let choice = !args[0] || !choices.includes(args[0]) ? choices[Math.floor(Math.random() * 2)] : args[0];

        fetch(`https://api.truthordarebot.xyz/api/${choice}`).then(async (response) => {
            let res = await response.json();
            let embed = new Embed()
                .setTitle(`:interrobang: ${res.question}`)
                .setFooter(res.type);
                
            message.reply({ embeds: [embed] });
        });
    }
};
