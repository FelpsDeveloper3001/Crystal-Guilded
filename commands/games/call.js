const { Embed } = require("guilded.ts");

module.exports = {
    name: 'call',
    category: 'games',
    description: 'Inicia uma chamada aleatória e inicia um chat',
    run: async (client, message, args) => {
        let callerList = await client.db.get('callStatus');
        if (!callerList) callerList = [];
        
        let checkServer = (caller) => caller.serverId === message.serverId;

        if (!callerList || !callerList.some(checkServer)) {
            let embed = new Embed();
            let serverInfo = {
                serverId: message.serverId,
                callFrom: message.channelId,
                callTo: null
            };
            let found = false;

            embed.setTitle('📞 Iniciando uma chamada...')
                .setDescription('Lembre-se, você pode usar `/call` a qualquer momento para encerrar a chamada.');

            await message.reply({ embeds: [embed] });

            for (let caller of callerList) {
                if (!caller.callTo) {
                    found = true;
                    caller.callTo = message.channelId;
                    serverInfo.callTo = caller.callFrom;
                    break;
                }
            }

            callerList.push(serverInfo);
            await client.db.set('callStatus', callerList);

            if (found) {
                embed.setTitle('✅ Conexão estabelecida!')
                    .setDescription('Por favor, seja educado ao conversar com estranhos e NUNCA compartilhe informações pessoais.')
                    .setColor('Green');

                let callToChannel = await client.channels.fetch(serverInfo.callTo);
                await message.channel.send({ embeds: [embed] });
                callToChannel.send({ embeds: [embed] });
            }
        } else {
            let thisServer = callerList.filter(caller => caller.serverId === message.serverId)[0];
            let embed = new Embed();

            if (thisServer.callFrom !== message.channelId) {
                embed.setTitle('❌ Já foi iniciada uma chamada de outro canal');
                return message.reply({ embeds: [embed] });
            }

            let filteredList;

            if (thisServer.callTo) {
                filteredList = callerList.filter(caller => caller.serverId !== message.serverId && caller.callFrom !== thisServer.callTo);
                embed.setTitle('⚠️ A outra parte encerrou a chamada');
                let callToChannel = await client.channels.fetch(thisServer.callTo);
                await callToChannel.send({ embeds: [embed] });
            } else {
                filteredList = callerList.filter(caller => caller.serverId !== message.serverId);
            }

            if (!filteredList) filteredList = [];
            await client.db.set('callStatus', filteredList);

            embed.setTitle('✅ Desconectado da chamada');
            message.reply({ embeds: [embed] });
        }
    }
};
