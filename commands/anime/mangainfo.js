const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');
const moment = require('moment');

module.exports = {
    name: 'mangainfo',
    category: 'anime',
    description: 'Mostra informações sobre o manga especificado',
    args: ['manga'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`❌ Nenhum nome fornecido para o manga`);

        fetch(`https://kitsu.io/api/edge/manga?filter[text]=${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let res = await response.json();
            let data = res.data[0];
            if (!data || data.length < 1) return message.reply(`⚠️ | Nenhum resultado encontrado para o termo de pesquisa!`);
            else {
                let statuses = {
                    'current': 'Atualmente sendo publicado',
                    'finished': 'Finalizado',
                    'tba': 'A ser anunciado',
                    'unreleased': 'Não lançado',
                    'upcoming': 'Próximo lançamento'
                };
                let embed = new Embed()
                    .setAuthor(data.attributes.canonicalTitle)
                    .setImage(data.attributes.coverImage.large)
                    .setThumbnail(data.attributes.posterImage.original)
                    .setDescription(data.attributes.description.length > 2048 ? data.attributes.description.substr(0, 2045) + '...' : data.attributes.description)
                    .addField(':heartbeat: Data de publicação', `\`${moment(data.attributes.startDate).format('D MMMM, YYYY')}\` - \`${data.attributes.endDate ? `${moment(data.attributes.endDate).format('D MMMM, YYYY')}` : 'atual'}\``);
                data.attributes.nextRelease ? embed.addField(':fast_forward: Próximo lançamento', `\`${moment(data.attributes.nextRelease).format('D MMMM, YYYY')}\`\n(${moment(data.attributes.nextRelease).fromNow()})`) : '';
                embed.addField(':medal: Avaliações', `Avaliação média: \`${data.attributes.averageRating}\`\n${data.attributes.ageRating} (${data.attributes.ageRatingGuide})`)
                    .setFooter(`Última atualização: ${moment(data.attributes.updatedAt).format('D MMMM, YYYY')}`);
                message.reply({ embeds: [embed] });
            }
        });
    }
};
