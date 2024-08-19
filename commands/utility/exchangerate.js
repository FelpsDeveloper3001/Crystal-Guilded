const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');
const curSync = require('../../Utils/curSync.json');

module.exports = {
    name: 'exchangerate',
    category: 'utility',
    description: 'Mostra as taxas de câmbio para a moeda fornecida. (Suporta criptomoedas populares)',
    args: ['códigoDaMoedaDeOrigem', 'códigoDaMoedaDeOrigem códigoDaMoedaDeDestino'],
    aliases: ['er'],
    run: async (client, message, args) => {
        if (!args[0]) return message.reply('❌ O código da moeda não foi fornecido');
        
        let url;
        if (!args[1]) {
            url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${args[0].toLowerCase()}.json`;
        } else {
            url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${args[0].toLowerCase()}/${args[1].toLowerCase()}.json`;
        }
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`Erro ao recuperar os dados das taxas de câmbio: ${response.status} ${response.statusText}`);
            }
            
            const res = await response.json();

            let embed = new Embed()
                .setAuthor(`1.0 ${[args[0]]} equivale`)
                .setFooter(`Fonte: fawazahmed0`);
            
            if (args[1]) {
                if (res[args[1].toLowerCase()]) {
                    embed.setTitle(`${res[args[1].toLowerCase()].toLocaleString()} ${curSync[args[1]]}`);
                } else {
                    throw new Error(`Moeda de destino "${args[1]}" não encontrada.`);
                }
            } else {
                let mainCur = res[args[0].toLowerCase()];
                if (mainCur) {
                    embed.setDescription(`USD ($) : \`${mainCur.usd?.toLocaleString()}\`
GBP (£) : \`${mainCur.gbp?.toLocaleString()}\`
EUR (€) : \`${mainCur.eur?.toLocaleString()}\`
BTC (₿) : \`${mainCur.btc?.toLocaleString()}\`
ETH (Ξ) : \`${mainCur.eth?.toLocaleString()}\``);
                } else {
                    throw new Error(`Moeda de origem "${args[0]}" não encontrada.`);
                }
            }
            
            message.reply({ embeds: [embed] });
        } catch (err) {
            console.error(err);
            message.reply('⚠️ Ocorreu um erro ao buscar as taxas de câmbio.');
        }
    }
};
