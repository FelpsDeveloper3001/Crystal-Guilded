const { isPremiumUsr } = require('../../Utils/functions');

module.exports = {
    name: 'afk',
    category: 'utility',
    description: 'Define você como ausente (AFK) e informa quem mencionar você',
    noArgs: true,
    subCommands: [
        {
            name: 'setmessage',
            description: 'Define uma mensagem personalizada de AFK (recurso premium)',
            args: ['mensagem']
        },
        {
            name: 'clearmessage',
            description: 'Limpa a mensagem personalizada de AFK (recurso premium)'
        }
    ],
    run: async (client, message, args) => {
        if (args[0] === 'setmessage') {
            let premiumUsr = await isPremiumUsr(message.authorId, client);
            if (!premiumUsr) {
                return message.reply('❌ Apenas usuários premium podem definir uma mensagem personalizada de AFK. Junte-se ao nosso servidor de suporte para adquirir o premium:\nhttps://guilded.gg/Himal');
            } else if (!args[1]) {
                return message.reply('❌ Por favor, forneça uma mensagem para definir como sua mensagem de AFK.');
            } else if (args.slice(1).join(' ').length > 200) {
                return message.reply('❌ A mensagem de AFK não pode ter mais de 200 caracteres.');
            } else {
                await client.db.set(`${message.authorId}.afkMsg`, args.slice(1).join(' '));
                return message.reply('✅ Mensagem de AFK personalizada definida com sucesso.');
            }
        } else if (args[0] === 'clearmessage') {
            let premiumUsr = await isPremiumUsr(message.authorId, client);
            if (!premiumUsr) {
                return message.reply('❌ Apenas usuários premium podem limpar sua mensagem personalizada de AFK. Junte-se ao nosso servidor de suporte para adquirir o premium:\nhttps://guilded.gg/Himal');
            } else {
                await client.db.delete(`${message.authorId}.afkMsg`);
                return message.reply('✅ Mensagem de AFK personalizada removida com sucesso.');
            }
        }

        let afkUsers = await client.db.get('afkUsers') || [];
        if (afkUsers.includes(message.authorId)) {
            const index = afkUsers.indexOf(message.authorId);
            afkUsers.splice(index, 1);
            await client.db.set('afkUsers', afkUsers);
            return message.reply('👋 Bem-vindo de volta! Seu status de AFK foi removido.');
        } else {
            afkUsers.push(message.authorId);
            await client.db.set('afkUsers', afkUsers);
            return message.reply('✅ Você está agora definido como AFK.');
        }
    }
};
