const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');

module.exports = {
    name: 'cuddle',
    category: 'anime',
    description: 'Acaricia o usuário mencionado',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['cuddle']);
        fetch('https://nekos.best/api/v2/cuddle').then(async (response) => {
            let res = await response.json();
            let dat = res.results[0];
            let embed = new Embed()
                .setTitle(`Você acariciou ${args[0]}`)
                .setImage(dat.url)
                .setFooter(`De: ${dat.anime_name}`);
            message.reply({ embeds: [embed] });
        });
    }
};
