const { Embed } = require("guilded.ts");
const { delay, shuffleArray } = require('../../Utils/functions.js');

module.exports = {
    name: 'russianroulette',
    category: 'games',
    description: 'Inicia um jogo de roleta russa, o perdedor é expulso do servidor',
    noArgs: true,
    args: ['punishment'],
    aliases: ['rr'],
    run: async (client, message, args) => {
        let punishment = 0;
        if (!args[0]) punishment = 0;
        else if (args[0] === 'kick') punishment = 1;
        else if (args[0] === 'ban') punishment = 2;
        else punishment = 0;

        let playerArr = [message.authorId];
        let server = await client.servers.fetch(message.serverId);
        
        let embed = new Embed()
            .setTitle('Um novo jogo de Roleta Russa está prestes a começar!')
            .setDescription(`Use o comando \`/join rr\` para participar do jogo\n\n(Você NÃO receberá confirmação de participação)\n\n${punishment > 0 ? `***⚠️⚠️NOTA IMPORTANTE: Se você PERDER, será ${punishment === 1 ? 'EXPULSO' : 'BANIDO'} do servidor***` : `***Curiosidade:*** *Você pode usar 'kick' ou 'ban' como argumento opcional para definir a punição*`}`)
            .setFooter('Se ninguém se juntar em 30 segundos, o jogo será interrompido');
        
        await message.channel.send({ embeds: [embed] });

        let msg = await message.channel.awaitMessages({
            max: 8,
            time: 30_000,
            filter: (mssg) => mssg.authorId !== client.userId && mssg.content === "/join rr"
        });

        msg.forEach(el => {
            if (!playerArr.includes(el.authorId)) {
                playerArr.push(el.authorId);
            }
        });

        if (playerArr.length === 1) return message.reply('❌ Não há jogadores suficientes para começar o jogo');
        else {
            embed.setTitle(`Total de jogadores: ${playerArr.length}`)
                .setDescription(`<@${playerArr.join('>, <@')}>`);
            await message.channel.send({ embeds: [embed] });
        }

        embed.setDescription('');
        playerArr = shuffleArray(playerArr);
        let round = 1, bullets = 1;
        let i = 0;

        await delay(4_000);
        embed.setTitle('Round 1 começa com 1 bala');
        await message.channel.send({ embeds: [embed] });

        while (playerArr.length > 1) {
            if (bullets === 0) {
                await delay(4_000);
                embed.setTitle(`Sem balas, adicionando uma bala extra`)
                    .setColor();
                await message.channel.send({ embeds: [embed] });
                bullets++;
            }

            if (i + 1 > playerArr.length) {
                round++;
                bullets++;
                i = 0;
                await delay(4_000);
                embed.setTitle(`Round ${round} começa com ${bullets} balas`)
                    .setColor();
                await message.channel.send({ embeds: [embed] });
            }

            await delay(4_000);
            embed.setTitle(`<@${playerArr[i]}> gira o gatilho`)
                .setColor();
            message.channel.send({ embeds: [embed] });

            await delay(4_000);

            if (Math.floor(Math.random() * (7 - bullets)) === 0) {
                embed.setTitle(`:boom: *BANG* <@${playerArr[i]}> morreu`)
                    .setColor('Red');
                await message.channel.send({ embeds: [embed] });

                if (punishment > 0) {
                    try {
                        punishment === 1 ? await server.members.kick(playerArr[i]) : await server.members.ban(playerArr[i]);
                    } catch (err) {
                        embed.setTitle(`⚠️ Não foi possível ${punishment === 1 ? 'expulsar' : 'banir'} o usuário`)
                            .setColor();
                        message.channel.send({ embeds: [embed] });
                    }
                }

                bullets--;
                playerArr = playerArr.filter(item => item !== playerArr[i]);
            } else {
                embed.setTitle(`*Click* <@${playerArr[i]}> sobreviveu à rodada`)
                    .setColor('Green');
                message.channel.send({ embeds: [embed] });
            }

            i++;
        }

        await delay(3_000);
        embed.setTitle(`:tada::tada: Parabéns <@${playerArr[0]}>, você venceu o jogo`)
            .setColor();

        if (punishment > 0) {
            embed.setDescription(`Os perdedores foram ${punishment === 1 ? 'expulsos' : 'banidos'} do servidor`);
        }

        message.channel.send({ embeds: [embed] });
    }
};
