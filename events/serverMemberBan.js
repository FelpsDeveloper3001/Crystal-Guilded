const { Embed } = require("guilded.ts");

module.exports = {
    name: 'serverMemberBan',
    async execute(serverBan, client) {
        let dbInfo = await client.db.get(`${serverBan.server.id}.logging`)
        if (dbInfo && dbInfo.enabled) {
            let toLogChannel = await client.channels.fetch(dbInfo.channel).catch(async (err) => {
                return await client.db.delete(`${serverBan.server.id}.logging`)
            })
            if (!toLogChannel) return
            let embed = new Embed()
                .setTitle('Membro Banido do Servidor!')
                .setDescription(serverBan.reason || 'Motivo não disponível')
                .addField('ID do Usuário', serverBan.user.id)
                .addField('Banido Por', serverBan.createdBy)
            toLogChannel.send({ embeds: [embed] })
        }
    },
};
