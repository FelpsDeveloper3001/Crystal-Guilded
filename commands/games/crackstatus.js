const { Embed } = require('guilded.ts');
const fetch = require('node-fetch');

module.exports = {
    name: 'crackstatus',
    category: 'games',
    description: 'Verifica se o jogo fornecido está crackeado ou não',
    args: ['titulodojogo'],
    run: async (client, message, args) => {
        if (!args[0]) return client.commands.get('help').run(client, message, ['crackstatus']);
        
        let titulo = args.join(' ');
        
        let url = `https://gamestatus.info/back/api/gameinfo/game/${encodeURIComponent(titulo)}/`;
        
        try {
            let response = await fetch(url, { method: 'GET' });
            console.log('Response Status:', response.status); // Log de depuração
            let res = await response.json();
            console.log('Response Data:', res); // Log de depuração
            
            if (!res || Object.keys(res).length === 0) {
                return message.reply("⚠️ Nenhum jogo encontrado com esse nome");
            }
            
            let dat = res;
            
            if (!dat) {
                return message.reply("⚠️ Nenhum dado encontrado para o jogo fornecido.");
            }
            
            let color = dat.crack_date ? "#00FF00" : "#FF0000";  // Cores hexadecimais
            
            let embed = new Embed()
                .setColor(color)
                .setTitle(dat.title);
            
            if (dat.teaser_link) embed.setUrl(dat.teaser_link);
            
            embed.setImage(dat.short_image)
                .addField('Status', dat.readable_status || "---", true)
                .addField('Metascore', dat.mata_score ? `\`${dat.mata_score}\`` : "---", true)
                .addField('Userscore', dat.user_score ? `\`${dat.user_score}\`` : "---", true)
                .addField('Proteções', dat.protections ? dat.protections : "---", true)
                .addField('Grupo', dat.hacked_groups ? dat.hacked_groups : "---", true)
                .addField('Data de Crack', dat.crack_date ? dat.crack_date : "---", true)
                .setFooter('Powered by: Gamestatus.info');
            
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('Error:', error); // Log de depuração
            message.reply("⚠️ Ocorreu um erro ao verificar o status do jogo.");
        }
    }
};
