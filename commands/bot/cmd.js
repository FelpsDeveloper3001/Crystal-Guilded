const { readdirSync } = require("fs");
const { Embed } = require('guilded.ts')
const { prefix } = require('../../config.json').bot
const { getCat } = require('../../Utils/functions.js')

module.exports = {
    name: 'cmd',
    category: 'bot',
    description: 'Mostra todos os comandos disponíveis do bot dentro da categoria',
    noArgs: true,
    args: ['cmdCategory'],
    run: async (client, message, args) => {
        if (args[0]) {
            let cat = args[0].toLowerCase()
            let cmd
            if ((cmd = getCat(cat)) === null) {
                return message.reply(`❌ | Categoria inválida. Tente executar \`${prefix}cmd\``)
            }
            const dirs = readdirSync(`./commands/${cat}`).filter(file => file.endsWith(".js"))
            let cmds = `\`${dirs.join('` • `').replace(/.js/g, '')}\``
            let randir = dirs[Math.floor(Math.random() * dirs.length)].replace('.js', '')

            let embed = new Embed()
                .setAuthor(`${client.user.name}'s Command Menu`, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
                .setDescription(`• Digite \`${prefix}help [Comando]\` para mais informações sobre esse comando\nExemplo: \`${prefix}help ${randir}\`\n\n ${cmd}\n${cmds}`)
            message.reply({ embeds: [embed] })

        } else {
            let embed = new Embed()
            let desc = `• Digite o comando mostrado abaixo para ver todos os comandos dessa categoria\nExemplo: \`${prefix}cmd bot\``
            const commands = await client.commands;

            let com = {};
            for (let comm of commands) {
                comm = comm[1]
                let category = comm.category || "Unknown";
                let name = comm.name;

                if (!com[category]) {
                    com[category] = [];
                }
                com[category].push(name);
            }
            for (const [key, value] of Object.entries(com)) {
                let category = key;
                cat = getCat(category)
                embed.addField(`** ${cat} ** `, `[\`${prefix}cmd ${category}\`](https://guilded.gg/Himal)`, true);
            }

            embed.setAuthor(client.user.name, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
                .setDescription(desc)
            message.reply({ embeds: [embed] })
        }
    }
}