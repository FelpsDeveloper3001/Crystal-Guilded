const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'duck',
    category: 'animals',
    description: 'Mostra uma imagem aleatória de pato',
    run: async (client, message, args) => {
        fetch('https://random-d.uk/api/v1/random?type=png').then(async (response) => {
            let res = await response.json();
            let embed = new Embed()
                .setTitle(':duck: Aqui está seu pato aleatório')
                .setUrl(res.url)
                .setImage(res.url)
                .setFooter(res.message);
            message.reply({ embeds: [embed] });
        });
    }
};
