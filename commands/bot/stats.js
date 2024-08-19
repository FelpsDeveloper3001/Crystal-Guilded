const { Embed } = require("guilded.ts");
const { sec2HrMinSec } = require('../../Utils/functions.js');

module.exports = {
    name: "stats",
    description: "Mostra as estatísticas do bot",
    category: "bot",
    run: async (client, message, args) => {
        let ping = await client.ws.ping;
        let callers = await client.db.get('callStatus');
        let afk = await client.db.get('afkUsers');
        let uptime = sec2HrMinSec(Math.round(client.uptime / 1000));

        let embed = new Embed()
            .addField('Ping', `${ping}ms`, true)
            .addField('Tempo de atividade', uptime, true)
            .addField('Callers ativos', callers.length.toLocaleString(), true)
            .addField('Usuários AFK', afk.length.toLocaleString(), true);
        
        message.reply({ embeds: [embed] });
    }
};
