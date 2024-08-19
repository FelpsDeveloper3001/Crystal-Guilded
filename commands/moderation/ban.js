module.exports = {
    name: 'ban',
    category: 'moderation',
    description: 'Bane todos os usuários mencionados',
    args: ['userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['ban']);
        let server = await client.servers.fetch(message.serverId);
        let usr = await server.members.fetch(message.authorId);
        if (!usr.isOwner) return message.reply('❌ No momento, apenas o proprietário do servidor pode usar comandos de moderação.');

        if (!message.mentions || !message.mentions.users) return message.reply('❌ Você precisa mencionar pelo menos um usuário.');
        message.mentions.users.forEach(async usr => {
            let toBeBanned = await server.members.fetch(usr.id);
            await toBeBanned.ban().then(() => {
                message.reply(`✅ Banido ${toBeBanned.user.name}`);
            });
        });
    }
};
