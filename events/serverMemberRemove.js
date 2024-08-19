const { Embed } = require("guilded.ts");

module.exports = {
    name: 'serverMemberRemove',
    async execute(data, server, client) {
        if (data.isBan) return
        let dbInfo = await client.db.get(`${server.id}.logging`)
        if (dbInfo && dbInfo.enabled) {
            let toLogChannel = await client.channels.fetch(dbInfo.channel).catch(async (err) => {
                return await client.db.delete(`${server.id}.logging`)
            })
            if (!toLogChannel) return
            let embed = new Embed()
                .setTitle(`Membro ${data.isKick ? 'expulso do' : 'saiu do'} servidor!`)
                .addField('ID do Usuário', data.userId)
            toLogChannel.send({ embeds: [embed] })
        }
    },
};
