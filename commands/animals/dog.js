const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'dog',
    category: 'animals',
    description: 'Mostra uma imagem aleatória de cachorro',
    run: async (client, message, args) => {
        fetch('https://dog.ceo/api/breeds/image/random').then(async (response) => {
            let res = await response.json();
            let dat = res.message;
            let embed = new Embed()
                .setTitle(':dog: Aqui está seu cachorro aleatório')
                .setUrl(dat)
                .setImage(dat);
            message.reply({ embeds: [embed] });
        });
    }
};
