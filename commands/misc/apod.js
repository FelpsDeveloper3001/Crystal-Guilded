const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');
const { nasa } = require('../../config.json').api;

module.exports = {
    name: 'apod',
    category: 'misc',
    description: 'Mostra o video Astronômico do Dia pela NASA',
    run: async (client, message, args) => {
        fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasa}`).then(async (response) => {
            let res = await response.json();
            let embed = new Embed()
                .setTitle(res.title)
                .setDescription(`${res.explanation}\n\n[\`Video\`](${res.url})`)
                .setFooter(`©️ - ${res.date} | Direitos Autorais: NASA`);
            message.reply({ embeds: [embed] });
        });
    }
};
