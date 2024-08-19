const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');

module.exports = {
    name: 'nextmcu',
    category: 'misc',
    description: 'Mostra a data de lançamento do próximo projeto do MCU',
    aliases: ['mcu'],
    run: async (client, message, args) => {
        fetch('https://www.whenisthenextmcufilm.com/api').then(async (response) => {
            let data = await response.json();
            let embed = new Embed()
                .setTitle(`${data.title} será lançado em ${data.days_until} dias!`)
                .setDescription(`**Enredo:** ${data.overview}\n\n**Próximo Lançamento:** ${data.following_production.title}`)
                .setImage(data.poster_url)
                .setFooter(`Data de Lançamento: ${data.release_date}`);
            message.reply({ embeds: [embed] });
        });
    }
};
