const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');
const moment = require('moment');

module.exports = {
    name: 'animeinfo',
    category: 'anime',
    description: 'Mostra informações sobre o anime fornecido',
    args: ['anime'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply(`❌ Nenhum nome fornecido para o anime`);

        fetch(`https://kitsu.io/api/edge/anime?filter[text]=${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let res = await response.json();
            let data = res.data[0];
            if (!data || data.length < 1) return message.reply(`⚠️ | Nenhum resultado encontrado para o termo de pesquisa!`);
            else {
                let statuses = {
                    'current': 'Atualmente em exibição',
                    'finished': 'Finalizado',
                    'tba': 'A ser anunciado',
                    'unreleased': 'Não lançado',
                    'upcoming': 'Próximo'
                };
                let embed = new Embed()
                    .setAuthor(data.attributes.canonicalTitle)
                    .setImage(data.attributes.coverImage.large)
                    .setThumbnail(data.attributes.posterImage.original)
                    .setDescription(data.attributes.description.length > 2048 ? data.attributes.description.substr(0, 2045) + '...' : data.attributes.description)
                    .addField('Status atual', statuses[data.attributes.status], true)
                    .addField(`:heartbeat: Data de exibição`, `\`${moment(data.attributes.startDate).format('D [de] MMMM [de] YYYY')}\` - \`${data.attributes.endDate ? `${moment(data.attributes.endDate).format('D [de] MMMM [de] YYYY')}` : 'atual'}\``);
                data.attributes.nextRelease ? embed.addField(':fast_forward: Próximo lançamento', `\`${moment(data.attributes.nextRelease).format('D [de] MMMM [de] YYYY')}\`\n(${moment(data.attributes.nextRelease).fromNow()})`) : '';
                data.attributes.episodeCount ? embed.addField(`:tv: Total de episódios`, `\`${data.attributes.episodeCount.toLocaleString()}\``) : '';
                embed.addField(':medal: Classificações', `Avaliação média: \`${data.attributes.averageRating}\`\n${data.attributes.ageRating} (${data.attributes.ageRatingGuide})`)
                    .setFooter(`Última atualização: ${moment(data.attributes.updatedAt).format('D [de] MMMM [de] YYYY')}`);
                message.reply({ embeds: [embed] });
            }
        });
    }
};
