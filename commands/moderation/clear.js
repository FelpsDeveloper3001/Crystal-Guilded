module.exports = {
    name: 'clear',
    category: 'moderation',
    description: 'Exclui o número fornecido de mensagens do canal',
    args: ['número'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId);
        let usr = await server.members.fetch(message.authorId);
        if (!usr.isOwner) return message.reply('❌ Atualmente, apenas o proprietário do servidor pode usar comandos de moderação.');

        if (!args[0]) return client.commands.get('help').run(client, message, ['clear']);

        const amountToDelete = Number(args[0]);
        if (isNaN(amountToDelete)) return message.reply('❌ Não é um número válido.');

        if (!Number.isInteger(amountToDelete) || amountToDelete <= 0 || amountToDelete > 100) {
            return message.reply('❌ Você deve fornecer um número inteiro entre 1 e 100 para deletar.');
        }

        const channel = await client.channels.fetch(message.channelId);
        await message.delete();

        try {
            const fetched = await channel.messages.fetch({ limit: amountToDelete });
            await Promise.all(fetched.map(msg => msg.delete()));
        } catch (error) {
            console.error('Erro ao deletar mensagens:', error);
            message.reply('⚠️ Ocorreu um erro ao tentar excluir as mensagens.');
        }
    }
};
