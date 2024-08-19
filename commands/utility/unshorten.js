const fetch = require('node-fetch')

module.exports = {
    name: 'desencurtar',
    category: 'utility',
    description: 'Expande os links curtos para revelar suas URLs reais de redirecionamento',
    args: ['urlCurta'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['desencurtar'])
        let url = args[0].split('](')[0].replace('[', "")
        fetch(`https://bypass.bot.nu/bypass2?url=${url}`).then(async (response) => {
            let res = await response.json()
            message.reply(res.destination)
        }).catch((err) => {
            message.reply("❌ | URL não suportada")
        })
    }
}
