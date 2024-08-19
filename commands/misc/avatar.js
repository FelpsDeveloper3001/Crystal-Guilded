const { Embed } = require('guilded.ts');

module.exports = {
    name: 'avatar',
    category: 'misc',
    description: 'Mostra o seu avatar',
    noArgs: true,
    args: ['userMention'],
    aliases: ['av'],
    run: async (client, message, args) => {
        let server = await client.servers.fetch(message.serverId);
        let member = message.mentions && message.mentions.users ? await server.members.fetch(message.mentions.users[0].id) : await server.members.fetch(message.authorId);
        let avatar = member.user.avatar;
        if (!avatar) return message.reply('⚠️ Este usuário não possui um avatar');
        let embed = new Embed()
            .setImage(avatar);
        message.reply({ embeds: [embed] });
    }
};
