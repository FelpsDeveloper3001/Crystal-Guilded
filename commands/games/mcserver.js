const fetch = require('node-fetch');
const { Embed } = require('guilded.ts');

module.exports = {
    name: 'mcserver',
    category: 'games',
    description: 'Mostra o status do servidor de Minecraft',
    args: ['serverIP'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['mcserver']);
        
        fetch(`https://api.minetools.eu/ping/${args[0]}`).then(async (response) => {
            let res = await response.json();
            let embed = new Embed()
                .setAuthor(args[0], `https://api.minetools.eu/favicon/${args[0]}`)
                .setThumbnail(`https://api.minetools.eu/favicon/${args[0]}`)
                .addField('Latência', `\`${Math.round(res.latency)}\``, true)
                .addField('Jogadores online', `\`${res.players.online.toLocaleString()}\` / \`${res.players.max.toLocaleString()}\``, true)
                .addField('Versão', res.version.name, true)
                .addField('Motd', "```\n" + res.description + "\n```");
            
            message.reply({ embeds: [embed] });
        }).catch((err) => {
            message.reply({ content: "⚠️ Não foi possível localizar o servidor" });
        });
    }
};
