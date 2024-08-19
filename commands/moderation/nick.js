module.exports = {
    name: 'nick',
    category: 'moderation',
    description: 'Altera ou redefine o apelido de qualquer membro',
    args: ['userMention apelido', 'userMention'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['nick']);
        let server = await client.servers.fetch(message.serverId);
        let usr = await server.members.fetch(message.authorId);
        if (!usr.isOwner) return message.reply('❌ No momento, apenas o proprietário do servidor pode usar comandos de moderação.');

        if (!message.mentions || !message.mentions.users) return message.reply('❌ Você precisa mencionar pelo menos um usuário.');
        let mentionUser = await server.members.fetch(message.mentions.users[0].id);
        if (!mentionUser) return message.reply('⚠️ Nenhum usuário encontrado!');
        let nickOrUsername = mentionUser.nickname ? mentionUser.nickname : mentionUser.user.name;
        let trimAmt = nickOrUsername.trim().split(' ').length;
        if (!args[trimAmt]) {
            try {
                await mentionUser.removeNickname();
                message.reply('✅ O apelido foi redefinido.');
            } catch (err) {
                message.reply(`⚠️ ${err.message}`);
            }
        } else {
            try {
                await mentionUser.setNickname(args.slice(trimAmt).join(' '));
                message.reply('✅ O apelido foi atualizado.');
            } catch (err) {
                message.reply(`⚠️ ${err.message}`);
            }
        }
    }
};
