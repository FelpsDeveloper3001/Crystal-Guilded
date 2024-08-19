const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');
const { convert } = require('html-to-text');
const moment = require('moment');

module.exports = {
    name: 'fbi',
    description: 'Mostra uma pessoa procurada aleatória pelo FBI',
    category: 'misc',
    run: async (client, message, args) => {
        let randPage = Math.floor(Math.random() * 45) + 1;
        let randCrime = Math.floor(Math.random() * 20);
        fetch(`https://api.fbi.gov/wanted/v1/list?page=${randPage.toString()}`)
            .then(async (response) => {
                let res = await response.json();
                let dat = res.items[randCrime];
                let embed = new Embed()
                    .setThumbnail(dat.images[0].large)
                    .setUrl(dat.url)
                    .setAuthor(dat.title);
                
                if (dat.description) embed.setDescription(convert(dat.description).replace(/[;]/g, '\n'));
                if (dat.subjects) embed.addField('Assuntos', dat.subjects.join('\n'));
                if (dat.age_range) embed.addField('Idade', `\`${dat.age_min}\` - \`${dat.age_max}\``, true);
                if (dat.height) embed.addField('Altura', `\`${dat.height_min}\` - \`${dat.height_max}\``, true);
                if (dat.sex) embed.addField('Sexo', dat.sex, true);
                if (dat.race) embed.addField('Raça', dat.race, true);
                if (dat.eyes) embed.addField('Cor Dos Olhos', dat.eyes, true);
                if (dat.dates_of_birth_used) embed.addField('Datas de nascimento usadas', dat.dates_of_birth_used.join('\n'), true);
                if (dat.place_of_birth) embed.addField('Local de nascimento', dat.place_of_birth, true);
                if (dat.scars_and_marks) embed.addField('Cicatrizes e marcas', dat.scars_and_marks.replace(/[;]/g, '\n'));
                if (dat.remarks) embed.addField('Observações', convert(dat.remarks));
                if (dat.nationality) embed.addField('Nacionalidade', dat.nationality, true);
                
                embed.setFooter(`Última modificação: ${moment(dat.modified).format('D MMMM, YYYY')}`);
                
                message.reply({ embeds: [embed] });
            })
            .catch((err) => {
                message.reply('⚠️ Ocorreu um erro inesperado!');
            });
    }
};
