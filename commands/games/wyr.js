const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'wyr',
    category: 'games',
    description: 'Pergunta a você uma pergunta aleatória de Preferiria',
    run: async (client, message, args) => {
        fetch('https://either.io/questions/next/1').then(async (response) => {
            let res = await response.json();
            let q = res.questions[0];
            let embed = new Embed()
                .setAuthor(q.title)
                .setTitle(':question: Preferiria...')
                .setURL(q.short_url)
                .setDescription(`:one: ${q.option_1}\n:two: ${q.option_2}\n\n${q.moreinfo}\n\nVocê tem **20 segundos** para responder`)
                .setFooter('Digite 1 ou 2 no chat para votar');
            
            await message.reply({ embeds: [embed] });

            let msg = await client.messages.awaitMessages(message.channelId, {
                max: 1,
                timeLimit: 20000,
                filter: (msg) => msg.authorId === message.authorId
            });

            let choice = msg.entries.first();

            if (!choice) return;

            if (choice.content === '1' || choice.content === '2') {
                let usrChoice = parseInt(choice.content);
                let opt1Vote = parseInt(q.option1_total);
                let opt2Vote = parseInt(q.option2_total);
                let totalVote = opt1Vote + opt2Vote;
                let opt1Percent = ((opt1Vote * 100) / totalVote).toFixed();
                let opt2Percent = ((opt2Vote * 100) / totalVote).toFixed();
                let agree = (opt1Vote > opt2Vote && usrChoice === 1) || (opt2Vote > opt1Vote && usrChoice === 2);
                let embedColor = agree ? 'GREEN' : 'RED';

                await fetch(`https://either.io/vote/${q.id}/${usrChoice}`);

                embed.setTitle(`:bar_chart: Você votou na Opção #${usrChoice}`)
                    .setDescription(`:one: ${q.option_1}\n**${opt1Vote.toLocaleString()}** ${agree ? 'concordam' : 'discordam'}\nIsso é **${opt1Percent}%**\n\n:two: ${q.option_2}\n**${opt2Vote.toLocaleString()}** ${agree ? 'discordam' : 'concordam'}\nIsso é **${opt2Percent}%**`)
                    .setFooter('Pergunta por: either.io')
                    .setColor(embedColor);

                choice.reply({ embeds: [embed] });
            }
        });
    }
};
