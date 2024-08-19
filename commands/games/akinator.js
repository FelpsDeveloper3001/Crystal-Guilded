const { Embed } = require('guilded.ts/dist/index.js');
const { Aki } = require('aki-api');
const { serverId } = require('../../config.json').bot;

module.exports = {
    name: 'akinator',
    category: 'games',
    description: 'Tenta adivinhar qualquer personagem que você pensar',
    aliases: ['aki'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(serverId);
        let member = await server.members.fetch(message.authorId);
        if (!member || !member.roleIds.some(r => r == 32617887)) return message.reply(`❌ Este comando está atualmente restrito a testadores beta.\nJunte-se ao nosso servidor para se tornar um Beta Tester e experimentar novos recursos\nhttps://guilded.gg/Himal`);

        const region = 'en', childMode = false, proxy = undefined;
        const aki = new Aki({ region, childMode, proxy });

        let embed = new Embed()
            .setDescription("Sim - :+1:\nNão - :-1:\nNão sei - :question:\nProvavelmente - :thinking_face:\nProvavelmente não - :face_with_rolling_eyes:\nVoltar - :arrow_backward:");

        let j = 1, tries = 0, progress = 70;
        await aki.start();
        embed.setTitle(`#${j} ${aki.question}`);

        let botMsg;
        let reactions = [
            90001164, 90001170,
            90002188, 90000022,
            90000027, 90002144
        ];

        let reactionMap = {
            90001164: 0, 90001170: 1,
            90002188: 2, 90000022: 3,
            90000027: 4, 90002144: 5
        };

        await message.reply({ embeds: [embed] }).then(async (msg) => {
            botMsg = msg;
            await msg.react(90001164);
            await msg.react(90001170);
            await msg.react(90002188);
            await msg.react(90000022);
            await msg.react(90000027);
            await msg.react(90002144);
        });

        while (true) {
            let reaction;
            let usrReaction = await botMsg.awaitReactions({
                max: 1,
                time: 30_000,
                filter: (reaction) => reactions.includes(reaction.id) && reaction.createdBy === message.authorId
            });

            if (!usrReaction.first()) return message.channel.send('👀 Me deixaram pendurado');
            else reaction = usrReaction.first();

            let chosen = reactionMap[reaction.id];

            if (chosen === 5) {
                await aki.step(1);
                await aki.back();
                j--;
            } else {
                await aki.step(chosen);
            }

            if (aki.progress >= progress || aki.currentStep >= 78) {
                await aki.win();
                tries++;

                embed.setTitle(`Seu personagem é ${aki.answers[0].name}?`)
                    .setDescription(`Classificado em **#${aki.answers[0].ranking}**\n${aki.answers[0].description}`)
                    .setImage(aki.answers[0].absolute_picture_path);

                await botMsg.edit({ embeds: [embed] });

                let wincheck = await botMsg.awaitReactions({
                    max: 1,
                    time: 30_000,
                    filter: (reaction) => reactions.includes(reaction.id) && reaction.createdBy === message.authorId
                });

                if (!wincheck.first()) return message.channel.send(`👀 Eu interpretei seu silêncio como um Sim`);
                else if (wincheck.first().id === 90001164) return message.channel.send(`😏 Outra vitória fácil no meu livro`);
                else if (wincheck.first().id === 90001170) {
                    progress = 80;

                    if (tries > 1) return message.channel.send('😩 Ok, desisto');

                    embed.setTitle('😲 Espere, o que aconteceu com meus poderes sobrenaturais?')
                        .setDescription("**Você pode me dar mais uma chance**\n\n**Você quer que eu tente novamente? (🔪 Sim é a única opção aqui)**\n\nSim - :+1:\nNão - :-1:\nNão sei - :question:\nProvavelmente - :thinking_face:\nProvavelmente não - :face_with_rolling_eyes:\nVoltar - :arrow_backward:");

                    await botMsg.edit({ embeds: [embed] });

                    let tryChoice = await botMsg.awaitReactions({
                        max: 1,
                        time: 30_000,
                        filter: (reaction) => reactions.includes(reaction.id) && reaction.createdBy === message.authorId
                    });

                    if (!tryChoice.first()) return message.channel.send(`👀 Eu interpretei seu silêncio como um Não`);
                    else if (tryChoice.first().id === 90001164) {
                        j++;
                        embed.setTitle(`#${j} ${aki.question}`)
                            .setDescription("Sim - :+1:\nNão - :-1:\nNão sei - :question:\nProvavelmente - :thinking_face:\nProvavelmente não - :face_with_rolling_eyes:\nVoltar - :arrow_backward:");
                        
                        await botMsg.edit({ embeds: [embed] });
                    } else return message.channel.send(`🤔 Eu interpretei isso como um Não`);
                } else {
                    return message.channel.send(`🤔 Eu interpretei isso como um Sim`);
                }
            } else {
                j++;
                embed.setTitle(`#${j} ${aki.question}`);
                await botMsg.edit({ embeds: [embed] });
            }
        }
    }
};
