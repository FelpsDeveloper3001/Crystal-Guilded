const { Embed } = require("guilded.ts");

module.exports = {
    name: 'serverAdd',
    async execute(server, addedBy, client) {
        try {
            let embed = new Embed()
                .setTitle(`<@${addedBy.id}>, Obrigado por me convidar para ${server.name}`)
                .setDescription(`Oi, meu nome é ${client.user.name}. Eu sou um bot versátil do Guilded. Posso criar interações entre os membros do servidor, mostrar memes engraçados, moderar seu servidor, dar as boas-vindas aos novos membros e até mesmo ligar para estranhos aleatórios (\`/call\`). Abaixo estão alguns pontos a lembrar ao usar os comandos.\n\n> Para obter ajuda, execute \`/help\`\n\n> Para obter ajuda com um comando específico, execute \`/help <Nome do Comando>\`\n\n> Para visualizar todas as categorias de comandos, execute \`/cmd\`\n\n> Para ver os comandos de uma categoria específica, execute \`/cmd <Nome da Categoria>\`\n\n[Servidor de Suporte](https://guilded.gg/eloah) [Link de Convite](https://www.guilded.gg/b/b8b7b64a-8711-44d9-a709-4f5c8df5854a)`)
                .setFooter('Feito com ❤️ por Eloah.fps');
            let channel = await client.channels.fetch(server.defaultChannelId);
            channel.send({ embeds: [embed] });
            client.logChannel.send(`➕ Fui adicionada ao servidor ${server.name}`);
        } catch (err) {
            return;
        }
    },
};
