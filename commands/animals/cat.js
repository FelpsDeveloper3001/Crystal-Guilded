const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');
const { thecatapi } = require('../../config.json').api;

module.exports = {
    name: 'cat',
    category: 'animals',
    description: 'Mostra uma imagem aleatória de gato',
    run: async (client, message, args) => {
        fetch(`https://api.thecatapi.com/v1/images/search?api_key=${thecatapi}`).then(async (response) => {
            let res = await response.json();
            let dat = res[0];
            let embed = new Embed()
                .setTitle(':cat: Aqui está seu gatinho aleatório')
                .setUrl(dat.url)
                .setImage(dat.url);
            message.reply({ embeds: [embed] });
        });
    }
};
