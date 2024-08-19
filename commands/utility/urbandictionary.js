const { Embed } = require('guilded.ts')
const fetch = require('node-fetch')

module.exports = {
    name: 'urbandictionary',
    category: 'utility',
    description: 'Busca o significado de uma palavra no Urban Dictionary',
    args: ['palavra'],
    aliases: ['urban'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['urbandictionary'])
        fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(args.join(' '))}`).then(async (response) => {
            let res = await response.json()
            let body = res.list
            if (!body) return message.reply('⚠️ Nenhuma definição encontrada')
            var definicao = body[0].definition
            let definicaoFormatada = definicao.replace(/\[|\]/g, '`')
            var exemplo = body[0].example
            let exemploFormatado = exemplo ? exemplo.replace(/\[|\]/g, '`') : 'N/A'
            let embed = new Embed()
                .setAuthor(`✍ ${body[0].author}`)
                .setTitle(body[0].word)
                .setUrl(body[0].permalink)
                .addField(`Definição`, definicaoFormatada)
                .addField(`Exemplo`, exemploFormatado)
                .setFooter(`👍 ${body[0].thumbs_up} | 👎 ${body[0].thumbs_down}`)
            message.reply({ embeds: [embed] })

        }).catch((err) => {
            console.log(err)
            message.reply('⚠️ Ocorreu um erro')
        });
    }
}
