const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');
const { gitaslokid } = require('../../Utils/functions.js');

module.exports = {
    name: 'gita',
    category: 'misc',
    description: 'Mostra um verso aleatório do Bhagavad Gita',
    run: async (client, message, args) => {
        fetch(`https://bhagavadgitaapi.in/slok/${gitaslokid()}`)
            .then(async (response) => {
                let data = await response.json();
                let desc = `**${data.slok}**\n\n${data.transliteration}\n\n${data.tej.ht}\n\n${data.gambir.et}`;
                let embed = new Embed()
                    .setDescription(desc)
                    .setFooter(`Bhagavad Gita, Capítulo ${data.chapter}, Verso ${data.verse}`);
                message.reply({ embeds: [embed] });
            })
            .catch((error) => {
                console.error('Erro ao obter o verso do Bhagavad Gita:', error);
                message.reply('⚠️ Ocorreu um erro ao buscar o verso do Bhagavad Gita.');
            });
    }
};
