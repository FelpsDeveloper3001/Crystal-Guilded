const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'animequote',
    category: 'anime',
    description: 'Mostra uma citação aleatória de anime',
    run: async (client, message, args) => {
        fetch('https://animechan.vercel.app/api/random').then(async (response) => {
            let res = await response.json();
            let embed = new Embed()
                .setDescription(`"${res.quote}"`)
                .setFooter(`-${res.character} (${res.anime})`);
            message.reply({ embeds: [embed] });
        });
    }
};
