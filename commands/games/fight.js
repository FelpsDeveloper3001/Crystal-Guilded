const { Embed } = require('guilded.ts');
const { renderPlayerStats, resolveNewStats, fightMessage } = require('../../Utils/fightLogic');

module.exports = {
    name: 'fight',
    category: 'games',
    description: 'Mencione qualquer usuário e comece uma luta',
    args: ['mencionarUsuário'],
    run: async (client, message, args) => {
        if (!message.mentions || !message.mentions.users) return message.reply('❌ Nenhum jogador mencionado!');
        
        let server = await client.servers.fetch(message.serverId);
        let player1 = message.author;
        let player2 = await server.members.fetch(message.mentions.users[0].id);
        if (!player2) return message.reply('⚠️ Nenhum usuário encontrado!');
        
        // Inicializa os atributos dos jogadores
        player1.score = player2.score = 0;
        player1.hp = player2.hp = player1.stamina = player2.stamina = 100;
        player1.punches = player2.punches = player1.kicks = player2.kicks = player1.heals = player2.heals = 0;
        
        let embed = new Embed()
            .setColor('Red')
            .setTitle(`${player1.user.name} VS ${player2.user.name}`)
            .setDescription('')
            .addField(player1.user.name, renderPlayerStats(player1))
            .addField(player2.user.name, renderPlayerStats(player2))
            .addField('Digite no chat', `**punch** - Para socar o oponente (Usa menos estamina)\n**kick** - Para chutar o oponente (Usa mais estamina)\n**heal** - Para curar e aumentar HP e Estamina`)
            .setFooter(`Turno de ${player1.user.name}`);
        
        let botMsg = await message.reply({ embeds: [embed] });
        let count = 1;
        let descArr = [];
        
        while (true) {
            let currentPlay = count % 2 === 1 ? player1 : player2;
            let opponent = count % 2 === 1 ? player2 : player1;

            let msg = await message.channel.awaitMessages({
                max: 1,
                time: 30_000,
                filter: (msg) => msg.authorId === currentPlay.id
            });
            
            if (!msg.first()) {
                return message.channel.send(`${currentPlay.user.name} ficou com medo e ${fightMessage('flee')}`);
            }
            
            let choice = msg.first();
            
            if (choice.content === 'punch') {
                let newStats = resolveNewStats(currentPlay, opponent, 1);
                if (!newStats) {
                    descArr.push(`:warning: **${currentPlay.user.name}** tentou dar um **SOCO** mas errou`);
                } else {
                    descArr.push(`:boxing_glove: **${currentPlay.user.name}** ${fightMessage('punchKick')} um **SOCO** em **${opponent.user.name}**`);
                    embed.fields[0].value = renderPlayerStats(newStats.attacker);
                    embed.fields[1].value = renderPlayerStats(newStats.defender);
                }
            } else if (choice.content === 'kick') {
                let newStats = resolveNewStats(currentPlay, opponent, 2);
                if (!newStats) {
                    descArr.push(`:warning: **${currentPlay.user.name}** tentou dar um **CHUTE** mas errou`);
                } else {
                    descArr.push(`:leg: ${currentPlay.user.name} ${fightMessage('punchKick')} um **CHUTE** em ${opponent.user.name}`);
                    embed.fields[0].value = renderPlayerStats(newStats.attacker);
                    embed.fields[1].value = renderPlayerStats(newStats.defender);
                }
            } else if (choice.content === 'heal') {
                let newStats = resolveNewStats(currentPlay, opponent, 3);
                if (newStats.healed) descArr.push(`:mending_heart: ${currentPlay.user.name} **SE CUROU**`);
                else descArr.push(`:warning: ${currentPlay.user.name} ficou sem suprimentos de cura e descansou`);
                embed.fields[0].value = renderPlayerStats(newStats.attacker);
                embed.fields[1].value = renderPlayerStats(newStats.defender);
            } else {
                descArr.push(`:dizzy: ${currentPlay.user.name} foi atingido tão forte que ficou confuso sobre o que fazer`);
            }
            
            count++;
            if (descArr.length > 4) {
                descArr.shift();
            }
            
            embed.setDescription(descArr.join('\n'))
                .setFooter(`Turno de ${count % 2 === 1 ? player1.user.name : player2.user.name}`)
                .setColor(count % 2 === 1 ? 'Red' : 'Blue');
            
            if (count === 5) {
                count = 1;
                botMsg = await message.channel.send({ embeds: [embed] });
            } else {
                await botMsg.edit({ embeds: [embed] });
            }
            
            if (opponent.hp <= 0) {
                let newEmbed = new Embed()
                    .setDescription(`**:sports_medal: ${currentPlay.user.name} deu um golpe crítico e nocauteou ${opponent.user.name}**`)
                    .setTitle(`:tada::tada: Parabéns ${currentPlay.user.name}, você é um lutador profissional`);
                if (currentPlay.user.avatar && opponent.user.avatar) {
                    newEmbed.setImage(`https://vacefron.nl/api/batmanslap?text1=${encodeURIComponent(`Me perdoe ${currentPlay.user.name}`)}&text2=Então+leve+este+tapa&batman=${currentPlay.user.avatar}&robin=${opponent.user.avatar}`);
                }
                return message.channel.send({ embeds: [newEmbed] });
            }
        }
    }
};
