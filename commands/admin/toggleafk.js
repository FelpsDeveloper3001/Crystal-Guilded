module.exports = {
    name: 'toggleafk',
    category: 'admin',
    description: 'Ativar/desativar mensagem de AFK em seu servidor',
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId);
        let usr = await server.members.fetch(message.authorId);
        if (!usr.isOwner) return message.reply('❌ Atualmente, apenas o proprietário do servidor pode usar comandos de moderação.');
        
        let afkStatus = await client.db.get(`${message.serverId}.showAfk`);
        
        if (afkStatus === undefined || afkStatus === null) {
            await client.db.set(`${message.serverId}.showAfk`, false);
            message.reply('✅ Mensagem de AFK definida como `false` com sucesso.');
        } else if (afkStatus) {
            await client.db.set(`${message.serverId}.showAfk`, false);
            message.reply('✅ Mensagem de AFK definida como `false` com sucesso.');
        } else {
            await client.db.delete(`${message.serverId}.showAfk`);
            message.reply('✅ Mensagem de AFK definida como `true` com sucesso.');
        }
    }
};
