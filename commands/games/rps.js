const { Embed } = require('guilded.ts');
const { checkRps } = require('../../Utils/functions.js');
const { prefix } = require('../../config.json').bot;

module.exports = {
    name: 'rps',
    category: 'games',
    description: 'Jogue Pedra, Papel e Tesoura comigo',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ Você não mencionou nenhum usuário');
        let server = await client.servers.fetch(message.serverId);
        let player1 = await server.members.fetch(message.authorId);
        let player2 = await server.members.fetch(message.mentions.users[0].id);
        if (!player2) return message.reply('⚠️ Não foi possível encontrar o usuário mencionado');
        if (player1.id === player2.id) return message.reply('❌ Você não pode mencionar a si mesmo');

        let embed = new Embed()
            .setTitle(`<@${message.mentions.users[0].id}>, você foi desafiado para jogar Pedra, Papel e Tesoura por <@${message.authorId}>`)
            .setDescription(`Digite \`${prefix}join rps\` no chat se você aceitar o desafio`);
        let botMsg = await message.reply({ embeds: [embed] });
        let usrRes = await message.channel.awaitMessages({
            max: 1,
            time: 30_000,
            filter: (msg) => msg.authorId === message.mentions.users[0].id && msg.content === `${prefix}join rps`
        });
        if (!usrRes.first()) {
            embed.setTitle(':warning: O usuário não respondeu dentro de 30 segundos')
                .setDescription();
            return message.channel.send({ embeds: [embed] });
        } else {
            embed.setTitle(`<@${player2.id}> aceitou o desafio`)
                .setDescription(`:x: <@${player1.id}> ainda precisa decidir\n:x: <@${player2.id}> ainda precisa decidir`);
            await botMsg.edit({ embeds: [embed] });
            let usrMsg = usrRes.first();
            let messages = [message, usrMsg];
            let emojis = [
                90003217,
                90001953,
                90002009
            ];
            let playerChoices = {
                player1: null,
                player2: null
            };
            let reactionMap = {
                90003217: 'pedra',
                90001953: 'papel',
                90002009: 'tesoura'
            };
            messages.forEach(async msg => {
                embed.setTitle('Reaja com o emoji para escolher sua jogada')
                    .setDescription(`Pedra - :rock:\nPapel - :page_facing_up:\nTesoura - :scissors:`);
                let botChoiceEmbed;
                await msg.reply({ embeds: [embed], isPrivate: true }).then(async (mesg) => {
                    botChoiceEmbed = mesg;
                    await mesg.react(90003217);
                    await mesg.react(90001953);
                    await mesg.react(90002009);
                });
                let usrChoice = await botChoiceEmbed.awaitReactions({
                    max: 1,
                    time: 30_000,
                    filter: (reaction) => emojis.includes(reaction.id)
                });
                if (!usrChoice.first()) return message.channel.send('⚠️ Pelo menos um jogador não escolheu sua jogada');
                else {
                    if (msg.authorId === message.authorId) playerChoices.player1 = reactionMap[usrChoice.first().id];
                    else playerChoices.player2 = reactionMap[usrChoice.first().id];

                    embed.setTitle(`<@${player2.id}> aceitou o desafio`)
                        .setDescription(`${playerChoices.player1 ? `:white_check_mark: <@${player1.id}> fez sua escolha` : `:x: <@${player1.id}> ainda precisa decidir`}\n${playerChoices.player2 ? `:white_check_mark: <@${player2.id}> fez sua escolha` : `:x: <@${player2.id}> ainda precisa decidir`}`);
                    await botMsg.edit({ embeds: [embed] });
                    if (playerChoices.player1 && playerChoices.player2) {
                        let result = checkRps(playerChoices.player1, playerChoices.player2);
                        if (result === 2) {
                            embed.setTitle('É um empate');
                        } else if (result === 0) {
                            embed.setTitle(`<@${player2.id}> venceu o desafio`);
                        } else {
                            embed.setTitle(`<@${player1.id}> venceu o desafio`);
                        }
                        embed.setDescription(`:white_check_mark: <@${player1.id}> escolheu ${playerChoices.player1}\n:white_check_mark: <@${player2.id}> escolheu ${playerChoices.player2}\n`);
                        message.channel.send({ embeds: [embed] });
                    }
                }
            });

        }
    }
};
