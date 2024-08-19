const { Embed } = require('guilded.ts');
const { prefix } = require('../../config.json').bot;
const arg2Example = require('../../Utils/arg2Example.json');

module.exports = {
    name: 'help',
    category: 'bot',
    description: `Mostra todos os comandos disponíveis do bot`,
    noArgs: true,
    args: ['cmdName'],
    example: ['ajuda'],
    run: async (client, message, args) => {
        if (args[0]) {
            const command = await client.commands.get(args[0]) || await client.commands.get(client.aliases.get(args[0]));
            if (!command) return;
            let desc = command.description;
            let aliases;
            if (command.aliases) aliases = `\`${command.aliases.join('`, `')}\``;
            else aliases = '**Não Disponível**';
            let embed = new Embed()
               .setAuthor(`${client.user.name}'s Menu de Ajuda`, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
               .setDescription(desc);

            if (command.subCommands) {
                let scArr = [];
                let subCmds = '';
                let usage = '';
                let example = '';
                if (command.noArgs) {
                    example = usage = `${prefix}${command.name}\n`;
                }
                for (let cmd of command.subCommands) {
                    if (!scArr.includes(cmd.name)) {
                        subCmds += `***${cmd.name}*** - ${cmd.description}\n`;
                        scArr.push(cmd.name);
                    }

                    usage += `${prefix}${command.name} ${cmd.name}${cmd.args? ` <${cmd.args.join('> <')}>` : ''}\n`;
                    example += `${prefix}${command.name} ${cmd.name}${cmd.args? ` ${cmd.args.map(arg => arg2Example[arg]).join(' ')}` : ''}\n`;
                }
                embed.addField('__:arrow_lower_right: Subcomandos__', subCmds);
                embed.addField('__:question: Uso__', `\`\`\`js\n${usage}\`\`\``);
                embed.addField('__:spiral_note_pad: Exemplo__', `\`\`\`js\n${example}\`\`\``);
            } else if (command.args) {
                let usage = '', example = '';
                if (command.noArgs) {
                    example = usage = `${prefix}${command.name}\n`;
                }

                for (let arg of command.args) {
                    let splittedArgs = arg.split(' ');
                    usage += `${prefix}${command.name}`;
                    example += `${prefix}${command.name}`;
                    for (let i of splittedArgs) {
                        usage += ` <${i}>`;
                        example += ` ${arg2Example[i]}`;
                    }
                    usage += '\n';
                    example += '\n';
                }
                embed.addField('__:question: Uso__', `\`\`\`js\n${usage}\`\`\``);
                embed.addField('__:spiral_note_pad: Exemplo__', `\`\`\`js\n${example}\`\`\``);
            } else {
                let usage = `${prefix}${command.name}`;
                let example = usage;

                embed.addField('__:question: Uso__', `\`\`\`js\n${usage}\`\`\``);
                embed.addField('__:spiral_note_pad: Exemplo__', `\`\`\`js\n${example}\`\`\``);
            }
            embed.addField(':currency_exchange: __Aliases__', aliases);
            message.reply({ embeds: [embed] });
        } else {
            let desc = `:question: • Prefix: \`${prefix}\`\n:point_right: • Ajuda do comando: \`${prefix}help <Command>\`\n:mag: • Ver todos os comandos: \`${prefix}cmd\``
            let embed = new Embed()
               .setAuthor(client.user.name, 'https://img.guildedcdn.com/UserAvatar/51ec705f2217957f806f18cc2567fe2c-Large.webp')
               .setDescription(desc)
               .addField('Links Importantes', `[\`Adicionar ${client.user.name}\`](https://www.guilded.gg/b/b8b7b64a-8711-44d9-a709-4f5c8df5854a) • [\`Servidor De Suporte\`](https://guilded.gg/eloah)`)
               .setFooter('Total de Comandos: ' + client.commands.size);
            message.reply({ embeds: [embed] });
        }
    }
}