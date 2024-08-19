const fetch = require("node-fetch");
const { Embed } = require("guilded.ts");
const yt = require('youtube-sr').default
const { filterURL, sec2HrMinSec } = require('../../Utils/functions.js');

module.exports = {
    name: 'ytinfo',
    category: 'utility',
    description: 'Obtém informações sobre um vídeo do YouTube, como dislikes, segmentos patrocinados e mais',
    args: ['ytUrl', 'termoDeBusca'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['ytinfo'])
        let url = filterURL(args[0])
        let isValidURL = await yt.validate(url, 'VIDEO')
        let infoDoVideo
        if (!isValidURL) {
            infoDoVideo = await yt.searchOne(args.join(' '))
            if (!infoDoVideo) return message.reply('⚠️ Nenhum resultado encontrado para o termo de busca')
            url = `https://youtu.be/${infoDoVideo.id}`
        } else {
            infoDoVideo = await yt.getVideo(url)
        }
        let id = infoDoVideo.id
        fetch(`https://returnyoutubedislikeapi.com/votes?videoId=${id}`).then(async (response) => {
            let res = await response.json()
            let sbRes
            let sbResponse = await fetch(`https://sponsor.ajay.app/api/skipSegments?videoID=${id}&categories=["sponsor","intro","outro","selfpromo","interaction","preview","music_offtopic","filler"]`)
            try {
                sbRes = await sbResponse.json()
            } catch (err) {
                sbRes = false
            }
            let embed = new Embed()
                .setAuthor({ name: infoDoVideo.channel.name, icon_url: infoDoVideo.channel.icon.url })
                .setTitle(infoDoVideo.title)
                .setUrl(url)
                .setThumbnail(infoDoVideo.thumbnail.url)
                .addField('👍 Likes', `\`${res.likes.toLocaleString()}\``, true)
                .addField('👎 Dislikes', `\`${res.dislikes.toLocaleString()}\``, true)
                .addField('⭐ Avaliação Geral', `\`${res.rating.toFixed(1)}\``, true)
            if (sbRes) {
                let selfpromo = '', sponsor = '', intro = '', outro = '', filler = '', music_offtopic = ''
                sbRes.forEach((el) => {
                    segment = `[${sec2HrMinSec(el.segment[0])}](https://youtu.be/${id}?t=${Math.round(el.segment[0])}) - [${sec2HrMinSec(el.segment[1])}](https://youtu.be/${id}?t=${Math.round(el.segment[1])})\n`
                    if (el.category === 'selfpromo') selfpromo += segment
                    else if (el.category === 'sponsor') sponsor += segment
                    else if (el.category === 'intro') intro += segment
                    else if (el.category === 'outro') outro += segment
                    else if (el.category === 'filler') filler += segment
                    else if (el.category === 'music_offtopic') music_offtopic += segment
                })
                if (sponsor) embed.addField('Patrocinador', sponsor, true)
                if (selfpromo) embed.addField('Auto Promoção', selfpromo, true)
                if (intro) embed.addField('Introdução', intro, true)
                if (outro) embed.addField('Finalização', outro, true)
                if (filler) embed.addField('Preenchimento', filler, true)
                if (music_offtopic) embed.addField('Música Fora do Tópico', music_offtopic, true)
            }
            message.reply({ embeds: [embed] })
        })
    }
}
