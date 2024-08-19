const { Embed } = require('guilded.ts');
const fetch = require("node-fetch");

module.exports = {
    name: 'insult',
    category: 'fun',
    description: 'Insulta o usuário mencionado',
    args: ['mençãoDoUsuário'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ Você não mencionou nenhum usuário');
        let server = await client.servers.fetch(message.serverId);
        let insultado = await server.members.fetch(message.mentions.users[0].id);
        fetch('https://evilinsult.com/generate_insult.php?lang=pt&type=json').then(async (response) => {
            let data = await response.json();
                let embed = new Embed()
                    .setTitle(`<@${message.author.id}> insultou <@${insultado.id}>`)
                    .setDescription(data.insult)
                message.reply({ embeds: [embed] });
        });
    }
}

