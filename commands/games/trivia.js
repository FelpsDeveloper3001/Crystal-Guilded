const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');
const he = require('he');
const { shuffleArray, delay } = require('../../Utils/functions');

module.exports = {
    name: 'trivia',
    category: 'games',
    description: '10 perguntas, 5 rodadas, dificuldade aleatória. Você tem o que é preciso para ser a pessoa mais inteligente?',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ Nenhum jogador mencionado!');
        let server = await client.servers.fetch(message.serverId);
        let player1 = await server.members.fetch(message.authorId);
        let player2 = await server.members.fetch(message.mentions.users[0].id);
        if (!player2) return message.reply('⚠️ Usuário não encontrado!');
        if (player1.id === player2.id) return message.reply('❌ Você não pode mencionar a si mesmo');
        player1.score = player2.score = 0;

        fetch('https://opentdb.com/api.php?amount=10&type=multiple').then(async (response) => {
            let res = await response.json();
            let questions = res.results;
            let i, currentPlay;
            for (i = 0; i < questions.length; i++) {
                i % 2 === 0 ? currentPlay = player1 : currentPlay = player2;
                let title = he.decode(res.results[i].question);
                let correct = he.decode(res.results[i].correct_answer);
                let incorrects = res.results[i].incorrect_answers;
                let options = [correct, ...incorrects];
                let shuffledOptions = shuffleArray(options);
                let desc = shuffledOptions.map((x, i) => `${i + 1}) ${he.decode(x)}`).join('\n');
                let embed = new Embed()
                    .setColor(i % 2 === 0 ? 'RED' : 'BLUE')
                    .setTitle(`<@${currentPlay.id}>, ${title}`)
                    .setDescription(`${desc}\n\n${player1.username}: ${player1.score}/${(i / 2).toFixed()}\n${player2.username}: ${player2.score}/${i === 0 ? 0 : Math.ceil((i - 1) / 2)}`)
                    .setFooter(`Vez de ${currentPlay.username}!`);

                await message.reply({ embeds: [embed] });

                let msg = await client.messages.awaitMessages(message.channelId, {
                    max: 1,
                    timeLimit: 20000,
                    filter: (msg) => msg.authorId === currentPlay.id
                });

                if (!msg.entries.entries().next().value) {
                    embed.setTitle('⏱️ Tempo esgotado!')
                        .setDescription()
                        .setColor()
                        .setFooter();

                    await message.send({ embeds: [embed] });
                    await delay(2000);
                    continue;
                }

                let usrMsg = msg.entries.entries().next().value[1];
                let choice = parseInt(usrMsg.content);

                if (isNaN(choice) || choice < 1 || choice > 4) {
                    await usrMsg.reply('❌ Opção inválida, tente novamente');
                } else if (he.decode(shuffledOptions[choice - 1]) === correct) {
                    currentPlay.score++;
                    await usrMsg.reply('🎉 Parabéns, você acertou!');
                } else {
                    await usrMsg.reply(`❌ Você errou, a resposta correta era \`${correct}\``);
                }

                await delay(2000);

                if (i === 9) {
                    let scorecard = `\n${player1.username}: ${player1.score}/5\n${player2.username}: ${player2.score}/5`;

                    if (player1.score !== player2.score) {
                        embed.setTitle(`🎉🎉 ${player1.score > player2.score ? player1.username : player2.username} venceu!`)
                            .setDescription(scorecard)
                            .setColor('GREEN')
                            .setFooter();

                        message.send({ embeds: [embed] });
                    } else {
                        embed.setTitle(`🙀🙀 Empate!`)
                            .setDescription(scorecard)
                            .setColor()
                            .setFooter();

                        message.send({ embeds: [embed] });
                    }
                }
            }
        });
    }
};
