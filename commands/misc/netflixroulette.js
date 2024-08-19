const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');
const { min2HrMin } = require('../../Utils/functions.js');

module.exports = {
    name: 'netflixroulette',
    category: 'misc',
    description: 'Um comando para obter séries aleatórias da Netflix',
    aliases: ['nr'],
    run: async (client, message, args) => {
        let genre = 0, type = 'both', imdb = 0, genreTxt = 'Todos os Gêneros';

        let genreSync = [
            [0, 'Todos os Gêneros'], [5, 'Ação e Aventura'], [6, 'Animação'],
            [39, 'Anime'], [7, 'Biografia'], [8, 'Crianças'],
            [9, 'Comédia'], [10, 'Crime'], [41, 'Cult'],
            [11, 'Documentário'], [3, 'Drama'], [12, 'Família'],
            [15, 'Comida'], [16, 'Game Show'], [17, 'História'],
            [18, 'Casa e Jardim'], [19, 'Horror'], [37, 'LGBTQ'],
            [22, 'Musical'], [23, 'Mistério'], [25, 'Reality'],
            [4, 'Romance'], [26, 'Ficção Científica'], [29, 'Esporte'],
            [45, 'Stand-up e Talk'], [32, 'Suspense'], [33, 'Viagem'],
            [36, 'Western']
        ];

        let choiceToGenre = {
            1: 0, 2: 5, 3: 6,
            4: 39, 5: 7, 6: 8,
            7: 9, 8: 10, 9: 41,
            10: 11, 11: 3, 12: 12,
            13: 15, 14: 16, 15: 17,
            16: 18, 17: 19, 18: 37,
            19: 22, 20: 23, 21: 25,
            22: 4, 23: 26, 24: 29,
            25: 45, 26: 32, 27: 33,
            28: 36
        };

        let embed = new Embed()
            .setTitle('Netflix Roulette: O que você deveria assistir?')
            .setDescription(`**GÊNERO:** \`Todos os Gêneros\`
**TIPO:** ✅ **Filmes**    ✅ **Séries de TV**
**IMDB:** \`Qualquer pontuação\`

Você pode enviar a seguinte mensagem no chat:
\`spin\` - Para girar a roleta
\`gênero\` - Para alterar o gênero
\`tipo\` - Para alterar o tipo
\`classificação\` - Para definir a classificação mínima do IMDb`)
            .setFooter('Você tem 20 segundos');

        await message.reply({ embeds: [embed] });

        while (true) {
            let msg = await message.channel.awaitMessages({
                max: 1,
                timeLimit: 20000,
                filter: (msg) => msg.authorId === message.authorId
            });

            let choice = msg.first();

            if (!choice) return;
            else if (choice.content === 'spin') {
                let url = `https://api.reelgood.com/v3.0/content/random?availability=onSources&content_kind=${type}${genre === 0 ? '' : `&genre=${genre}`}${imdb === 0 ? '' : `&minimum_imdb=${imdb}`}&nocache=true&region=us&sources=netflix&spin_count=1`;

                try {
                    let response = await fetch(url);
                    let dat = await response.json();

                    let embed = new Embed()
                        .setTitle(dat.title)
                        .setUrl(`https://reelgood.com/${dat.content_type === 'm' ? 'movie' : 'show'}/${dat.slug}`)
                        .addField('Classificação Etária', dat.classification || 'Não especificado', true)
                        .addField('IMDb', `\`${dat.imdb_rating}/10\``, true)
                        .addField('Duração', min2HrMin(dat.runtime), true)
                        .addField('Temporadas', dat.season_count ? dat.season_count.toLocaleString() : 'Não especificado', true)
                        .setDescription(dat.overview)
                        .setThumbnail(`https://img.rgstatic.com/content/${dat.content_type === 'm' ? 'movie' : 'show'}/${dat.id}/poster-780.webp`)
                        .setFooter('Fonte: Reelgood.com');

                    await choice.reply({ embeds: [embed] });
                } catch (err) {
                    return choice.reply('⚠️ Nenhum resultado encontrado para sua consulta');
                }
                return;
            } else if (choice.content === 'gênero') {
                let genres = genreSync.map((x, i) => `\`${i + 1}\`. **${x[1]}${(i + 1) % 3 === 0 ? ',\n' : ','}**`).join(' ');

                embed.setDescription(`Esses são todos os gêneros disponíveis:\n\n${genres}\n\nDigite um número de 1 a 28 para selecionar o gênero`);
                await choice.reply({ embeds: [embed] });

                msg = await message.channel.awaitMessages({
                    max: 1,
                    timeLimit: 20000,
                    filter: (msg) => msg.authorId === message.authorId
                });

                choice = msg.first();

                if (!choice) return;
                let genreNum = parseInt(choice.content);

                if (isNaN(genreNum) || genreNum > 28 || genreNum < 1) return choice.reply('❌ Escolha inválida!');
                else {
                    genre = choiceToGenre[genreNum];
                    genreTxt = genreSync[genreNum - 1][1];

                    embed.setDescription(`**GÊNERO:** \`${genreTxt}\`
**TIPO:** ${type === 'both' || type === 'movie' ? '✅' : '⬛'} **Filmes**    ${type === 'both' || type === 'show' ? '✅' : '⬛'} **Séries de TV**
**IMDB:** \`${imdb < 5 ? 'Qualquer pontuação' : `> ${imdb}`}\`

Você pode enviar a seguinte mensagem no chat:
\`spin\` - Para girar a roleta
\`gênero\` - Para alterar o gênero
\`tipo\` - Para alterar o tipo
\`classificação\` - Para definir a classificação mínima do IMDb`);
                    
                    await choice.reply({ embeds: [embed] });
                }
            } else if (choice.content === 'tipo') {
                embed.setDescription(`Esses são todos os tipos disponíveis:\n\n\`1.\` Filmes\n\`2.\` Séries de TV\n\`3.\` Ambos\n\nDigite um número de 1 a 3 para selecionar o tipo`);
                await choice.reply({ embeds: [embed] });

                msg = await message.channel.awaitMessages({
                    max: 1,
                    timeLimit: 20000,
                    filter: (msg) => msg.authorId === message.authorId
                });

                choice = msg.first();

                if (!choice) return;
                let typeNum = parseInt(choice.content);

                if (isNaN(typeNum) || typeNum > 3 || typeNum < 1) return choice.reply('❌ Escolha inválida!');
                else {
                    type = typeNum === 1 ? 'movie' : typeNum === 2 ? 'show' : 'both';

                    embed.setDescription(`**GÊNERO:** \`${genreTxt}\`
**TIPO:** ${type === 'both' || type === 'movie' ? '✅' : '⬛'} **Filmes**    ${type === 'both' || type === 'show' ? '✅' : '⬛'} **Séries de TV**
**IMDB:** \`${imdb < 5 ? 'Qualquer pontuação' : `> ${imdb}`}\`

Você pode enviar a seguinte mensagem no chat:
\`spin\` - Para girar a roleta
\`gênero\` - Para alterar o gênero
\`tipo\` - Para alterar o tipo
\`classificação\` - Para definir a classificação mínima do IMDb`);
                    
                    await choice.reply({ embeds: [embed] });
                }
            } else if (choice.content === 'classificação') {
                embed.setDescription(`Digite um número de 5 a 9 para selecionar a classificação mínima do IMDb`);
                await choice.reply({ embeds: [embed] });

                msg = await message.channel.awaitMessages({
                    max: 1,
                    timeLimit: 20000,
                    filter: (msg) => msg.authorId === message.authorId
                });

                choice = msg.first();

                if (!choice) return;
                let ratingNum = parseInt(choice.content);

                if (isNaN(ratingNum) || ratingNum > 9 || ratingNum < 5) return choice.reply('❌ Escolha inválida!');
                else {
                    imdb = ratingNum;

                    embed.setDescription(`**GÊNERO:** \`${genreTxt}\`
**TIPO:** ${type === 'both' || type === 'movie' ? '✅' : '⬛'} **Filmes**    ${type === 'both' || type === 'show' ? '✅' : '⬛'} **Séries de TV**
**IMDB:** \`${imdb < 5 ? 'Qualquer pontuação' : `> ${imdb}`}\`

Você pode enviar a seguinte mensagem no chat:
\`spin\` - Para girar a roleta
\`gênero\` - Para alterar o gênero
\`tipo\` - Para alterar o tipo
\`classificação\` - Para definir a classificação mínima do IMDb`);
                    
                    await choice.reply({ embeds: [embed] });
                }
            }
        }
    }
};
