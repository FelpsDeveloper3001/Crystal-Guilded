const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')
const { sec2HrMinSec, filterURL } = require('../../Utils/functions')

module.exports = {
    name: 'whatanime',
    category: 'anime',
    description: 'Forneça a URL da imagem e o bot detectará de qual anime ela é',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('❌ Nenhuma URL de imagem encontrada')
        fetch(`https://api.trace.moe/search?anilistInfo&url=${filterURL(args[0])}`).then(async (response) => {
            let res = await response.json()
            let dat = res.result

            if (!dat) return message.reply('⚠️ Não foi possível determinar o anime desta imagem')
            let embed = new Embed()
                .setImage(dat[0].image)
                .setTitle(`Esta imagem foi provavelmente tirada de ${dat[0].anilist.title.english || dat[0].anilist.title.romaji || dat[0].anilist.title.native}`)
                .addField('Episódio', dat[0].episode, true)
                .addField('Confiança', `${dat[0].similarity.toFixed(2) * 100}%`, true)
                .addField('Timestamp', `${sec2HrMinSec(dat[0].from)} - ${sec2HrMinSec(dat[0].to)}`)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply('⚠️ Ocorreu um erro inesperado')
        })
        //         let query = `
        // query ($id: Int) {
        //   Media (id: $id, type: ANIME) {
        //     id
        //     title {
        //       romaji
        //       english
        //       native
        //     }
        //   }
        // }
        // `
        //         let variables = {
        //             id: 15125
        //         }
        //         let url = 'https://graphql.anilist.co',
        //             options = {
        //                 method: 'POST',
        //                 headers: {
        //                     'Content-Type': 'application/json',
        //                     'Accept': 'application/json',
        //                 },
        //                 body: JSON.stringify({
        //                     query: query,
        //                     variables: variables
        //                 })
        //             };
        //         fetch(url, options).then(async (response) => {

        //         })
    }
}