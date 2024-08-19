const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'lizard',
    category: 'animals',
    description: 'Mostra uma imagem aleatória de lagarto',
    run: async (client, message, args) => {
        fetch('https://nekos.life/api/v2/img/lizard').then(async (response) => {
            let res = await response.json();
            let dat = res.url;
            let embed = new Embed()
                .setTitle(':lizard: Aqui está seu lagarto aleatório')
                .setUrl(dat)
                .setImage(dat);
            message.reply({ embeds: [embed] });
        });
    }
};
