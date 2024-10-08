const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'neko',
    category: 'anime',
    description: 'Mostra imagem de neko aleatória',
    run: async (client, message, args) => {
        fetch('https://nekos.best/api/v2/neko').then(async (response) => {
            let res = await response.json()
            let dat = res.results[0]
            let embed = new Embed()
                .setTitle(`:cherry_blossom: Aqui está sua neko aleatória`)
                .setImage(dat.url)
                .setFooter(`©️ ${dat.artist_name}`)
            message.reply({ embeds: [embed] })
        })
    }
}