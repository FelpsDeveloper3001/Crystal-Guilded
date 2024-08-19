const { Embed } = require("guilded.ts");
const { connect4Renderer, connect4ArrayManager, connect4WinCheck } = require('../../Utils/connect4Logic.js');

module.exports = {
    name: 'connect4',
    category: 'games',
    description: 'Joga uma partida de Connect4. Coloque quatro peças da mesma cor horizontalmente, verticalmente ou diagonalmente para vencer',
    args: ['userMention'],
    aliases: ['c4'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ Nenhum jogador mencionado!');
        
        let server = await client.servers.fetch(message.serverId);
        let player1 = await server.members.fetch(message.authorId);
        let player2 = await server.members.fetch(message.mentions.users[0].id);
        
        if (!player2) return message.reply('⚠️ Usuário não encontrado!');
        if (player1.id === player2.id) return message.reply('❌ Você não pode mencionar a si mesmo');
        
        let boxArr = [
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
        ];
        
        let connect4txt = connect4Renderer(boxArr);
        
        let embed = new Embed()
            .setColor('Red')
            .setTitle(`${player1.user.name} VS ${player2.user.name}`)
            .setDescription(connect4txt)
            .setFooter(`Vez de ${player1.user.name}`);
        
        let botMsg = await message.reply({ embeds: [embed] });
        let count = 1;
        
        while (true) {
            let color = (count + 1) % 2 === 0 ? 1 : 2;
            let currentPlay = color === 1 ? player1 : player2;
            
            let msg = await message.channel.awaitMessages({
                max: 1,
                time: 30_000,
                filter: (msg) => msg.authorId === currentPlay.id
            });
            
            if (!msg.first()) return message.channel.send('⏱️ Tempo esgotado!');
            
            let usrMsg = msg.first().content;
            let newBoxArr = await connect4ArrayManager(boxArr, usrMsg, color);
            
            if (!newBoxArr) message.channel.send('❌ Escolha inválida!');
            else {
                count++;
                connect4txt = connect4Renderer(newBoxArr);
                
                embed.setDescription(connect4txt)
                    .setFooter(`Vez de ${color === 2 ? player1.user.name : player2.user.name}`)
                    .setColor(color === 2 ? 'Red' : 'Blue');
                
                let won = await connect4WinCheck(newBoxArr);
                
                if (!won) {
                    if (count % 7 === 0) {
                        botMsg = await message.channel.send({ embeds: [embed] });
                    } else {
                        botMsg.edit({ embeds: [embed] });
                    }
                } else {
                    let winner = won === 1 ? player1 : player2;
                    
                    embed.setAuthor(`Parabéns ${winner.user.name}!`, winner.user.avatar)
                        .setTitle(`<@${winner.id}> venceu! 🎉🎉🎉🎉`)
                        .setColor('Green')
                        .setFooter();
                    
                    await message.channel.send({ embeds: [embed] });
                    break;
                }
            }
        }
    }
};
