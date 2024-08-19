module.exports = {
    name: 'log',
    category: 'admin',
    description: 'Ativar/desativar o registro e configurar o canal de logs',
    subCommands: [
        {
            name: 'setchannel',
            description: 'Define o canal onde deseja enviar os logs',
            args: ['mençãoDoCanalDeTexto']
        },
        {
            name: 'disable',
            description: 'Desativa o autoregistro no seu servidor'
        }
    ],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['log']);
        let server = await client.servers.fetch(message.serverId);
        let usr = await server.members.fetch(message.authorId);
        if (!usr.isOwner) return message.reply('❌ Atualmente, apenas o proprietário do servidor pode usar comandos de moderação.');
        
        if (args[0] === 'setchannel') {
            if (message.mentions && message.mentions.channels) {
                let channel = await client.channels.fetch(message.mentions.channels[0].id);
                if (channel.type !== 'chat') return message.reply('❌ Precisa ser um canal baseado em texto.');
                client.db.set(`${message.serverId}.logging`, { enabled: true, channel: channel.id }).then(() => {
                    message.reply(`✅ Logs ativados em #${channel.name}`);
                });
            } else {
                message.reply('❌ Você não forneceu um canal para enviar os logs.');
            }
        } else if (args[0] === 'disable') {
            client.db.delete(`${message.serverId}.logging`).then(() => {
                message.reply('✅ Registro desativado para este servidor.');
            });
        }
    }
};
