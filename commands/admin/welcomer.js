const { Embed } = require("guilded.ts");

module.exports = {
    name: 'welcomer',
    category: 'admin',
    description: 'Configura o sistema de boas-vindas para seu servidor',
    subCommands: [
        {
            name: 'setchannel',
            description: 'Define o canal onde deseja enviar a mensagem de boas-vindas',
            args: ['mençãoDoCanalDeTexto']
        }, {
            name: 'setmessage',
            description: 'Altera a mensagem de boas-vindas',
            args: ['mensagemDeBoasVindas']
        }, {
            name: 'disable',
            description: 'Desabilita a mensagem de boas-vindas'
        }, {
            name: 'test',
            description: 'Pré-visualiza a mensagem de boas-vindas'
        }
    ],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['welcomer']);
        
        let server = await client.servers.fetch(message.serverId);
        let usr = await server.members.fetch(message.authorId);
        
        if (!usr.isOwner) return message.reply('❌ No momento, apenas o proprietário do servidor pode usar comandos de moderação.');
        
        if (args[0] === 'setchannel') {
            if (message.mentions && message.mentions.channels) {
                let channel = await client.channels.fetch(message.mentions.channels[0].id);
                if (channel.type !== 'chat') return message.reply('❌ Precisa ser um canal de texto.');
                
                client.db.set(`${message.serverId}.welcomer`, { enabled: true, channel: channel.id, message: 'Olá {{User.Mention}}, bem-vindo ao **{{Server.Name}}**' }).then(() => {
                    message.reply(`✅ Boas-vindas habilitadas no canal #${channel.name}`);
                });
            } else {
                message.reply('❌ Você não forneceu um canal para enviar as boas-vindas.');
            }
        } else if (args[0] === 'disable') {
            client.db.delete(`${message.serverId}.welcomer`).then(() => {
                message.reply('✅ Boas-vindas desabilitadas para este servidor.');
            });
        } else if (args[0] === 'setmessage') {
            if (!args[1]) return message.reply('❌ A mensagem de boas-vindas não foi fornecida!');
            else {
                args.splice(0, 1);
                if (await client.db.get(`${message.serverId}.welcomer`) === null)
                    message.reply('⚠️ O sistema de boas-vindas não está configurado corretamente em seu servidor.');
                else client.db.set(`${message.serverId}.welcomer.message`, args.join(' ')).then(() => {
                    message.reply('✅ A mensagem de boas-vindas foi atualizada.');
                });
            }
        } else if (args[0] === 'test') {
            let welcomerConf = await client.db.get(`${message.serverId}.welcomer`);
            if (welcomerConf === null || welcomerConf === undefined) return message.reply('⚠️ O sistema de boas-vindas não está configurado corretamente em seu servidor.');
            else {
                let usrMention = `<@${message.authorId}>`;
                let server = await client.servers.fetch(message.serverId);
                let desc = welcomerConf.message.replace(/{{User.Mention}}/g, usrMention).replace(/{{Server.Name}}/g, server.name);
                let embed = new Embed()
                    .setTitle(`${message.author.user.name} entrou no servidor!`)
                    .setDescription(desc);
                let channel = await client.channels.fetch(welcomerConf.channel);
                channel.send({ embeds: [embed] });
            }
        }
    }
};
