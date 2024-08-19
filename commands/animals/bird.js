const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'bird',
    category: 'animals',
    description: 'Mostra uma imagem aleatória de pássaro',
    aliases: ['birb'],
    run: async (client, message, args) => {
        fetch('http://shibe.online/api/birds?count=1&urls=true&httpsUrls=true').then(async (response) => {
            let dat = await response.json();
            let embed = new Embed()
                .setTitle(':bird: Aqui está sua imagem aleatória de pássaro')
                .setUrl(dat[0])
                .setImage(dat[0]);
            message.reply({ embeds: [embed] });
        });
    }
};
