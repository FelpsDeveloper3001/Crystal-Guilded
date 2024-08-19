const fetch = require("node-fetch");
const { Embed } = require("guilded.ts");
const { filterURL } = require("../../Utils/functions");

module.exports = {
    name: 'isitup',
    category: 'utility',
    description: 'Verifica se o site fornecido está online ou não',
    args: ['domínio'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['isitup'])
        let filteredURL = filterURL(args[0]).replace('https://', '').replace('http://', '')
        fetch(`https://isitup.org/${filteredURL}.json`).then(async (response) => {
            let res = await response.json()
            let embed = new Embed()
                .setTitle(`**${res.domain}** ${res.status_code === 1 ? `está online :tada:` : 'parece estar offline :boom:'}`)
                .setDescription(`Levou ${res.response_time} segundos para obter um código de status ${res.response_code} de um endereço IP ${res.response_ip}.`)
            message.reply({ embeds: [embed] })
        }).catch((err) => {
            message.reply({ content: '⚠️ Ocorreu um erro' })
        })
    }
}
