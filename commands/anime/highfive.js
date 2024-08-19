const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'highfive',
    category: 'anime',
    description: 'Dê um highfive ao usuário mencionado',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['highfive']);
        fetch('https://nekos.best/api/v2/highfive').then(async (response) => {
            let res = await response.json();
            let dat = res.results[0];
            let embed = new Embed()
                .setTitle(`Você deu um highfive para ${args[0]}`)
                .setImage(dat.url)
                .setFooter(`De: ${dat.anime_name}`);
            message.reply({ embeds: [embed] });
        });
    }
};
