const { Embed } = require('guilded.ts');
const { filterURL } = require('../../Utils/functions.js');

module.exports = {
    name: 'embed',
    description: 'Cria uma embed *(20 segundos para cada pergunta)*',
    category: 'admin',
    run: async (client, message, args) => {
        let title, desc, footerText, authorName, thumb, image, authorIcon, footerIcon;
        let sendChannel = message.channel;
        let embedGen = new Embed();
        try {
            let server = await client.servers.fetch(message.serverId);
            let usr = await server.members.fetch(message.authorId);
            if (!usr.isOwner) return message.reply('❌ No momento, apenas o proprietário do servidor pode usar comandos de moderação.');
            let guideMsg = 'Envie a seguinte mensagem no chat para personalizar o embed:\n**author** - Define o nome e o ícone do autor\n**title** - Define o título\n**url** - Define o URL\n**desc** - Define a descrição\n**thumb** - Define a miniatura\n**image** - Define a imagem\n**footer** - Define o nome e o ícone do rodapé\n**channel** - Define o canal para enviar o embed\n**send** - Envia o embed';
            let askEmbed = new Embed()
                .setTitle('Gerador de Embed')
                .setFooter('Você tem 20 segundos');

            while (true) {
                let authorNameCheck = embedGen.author ? (embedGen.author.name ? ':white_check_mark:' : ':x:') : ':x:';
                let authorIconCheck = embedGen.author ? (embedGen.author.icon_url ? ':white_check_mark:' : ':x:') : ':x:';
                let titleCheck = embedGen.title ? ':white_check_mark:' : ':x:';
                let descriptionCheck = embedGen.description ? ':white_check_mark:' : ':x:';
                let footerTextCheck = embedGen.footer ? (embedGen.footer.text ? ':white_check_mark:' : ':x:') : ':x:';
                let footerIconCheck = embedGen.footer ? (embedGen.footer.icon_url ? ':white_check_mark:' : ':x:') : ':x:';
                let thumbnailCheck = embedGen.thumbnail ? (embedGen.thumbnail.url ? ':white_check_mark:' : ':x:') : ':x:';
                let imageCheck = embedGen.image ? (embedGen.image.url ? ':white_check_mark:' : ':x:') : ':x:';

                askEmbed.setDescription(`${authorNameCheck} Nome do Autor\n${authorIconCheck} Ícone do Autor\n${titleCheck} Título\n${descriptionCheck} Descrição\n${thumbnailCheck} Miniatura\n${imageCheck} Imagem\n${footerTextCheck} Texto do Rodapé\n${footerIconCheck} Ícone do Rodapé\nCanal: #${sendChannel.name}\n\n${guideMsg}`);
                await message.reply({ embeds: [askEmbed] });

                let msg = await message.channel.awaitMessages({
                    max: 1,
                    time: 20000,
                    filter: (msg) => msg.authorId === message.authorId
                });

                if (!msg) return;
                else {
                    let choice = msg.first();
                    if (choice.content === 'send') {
                        return sendChannel.send({ embeds: [embedGen] });
                    } else if (choice.content === 'author') {
                        askEmbed.setDescription(`${authorNameCheck} Nome do Autor\n${authorIconCheck} Ícone do Autor\n\nEnvie a seguinte mensagem no chat para personalizar o embed:\n**name** - Define o nome do autor\n**icon** - Define o ícone do autor`);
                        await choice.reply({ embeds: [askEmbed] });

                        let authorMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!authorMsg) return;
                        else {
                            let authorChoice = authorMsg.first();
                            if (authorChoice.content === 'name') {
                                askEmbed.setDescription('Por favor, insira o nome do autor');
                                await authorChoice.reply({ embeds: [askEmbed] });

                                let authorNameMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20000,
                                    filter: (msg) => msg.authorId === message.authorId
                                });

                                if (!authorNameMsg) return;
                                else {
                                    authorName = authorNameMsg.first().content;
                                    let authorData = { name: authorName };
                                    if (authorIcon) authorData.icon_url = authorIcon;
                                    embedGen.setAuthor(authorData);
                                }
                            } else if (authorChoice.content === 'icon') {
                                askEmbed.setDescription('Por favor, insira o URL do ícone do autor');
                                await authorChoice.reply({ embeds: [askEmbed] });

                                let authorIconMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20000,
                                    filter: (msg) => msg.authorId === message.authorId
                                });

                                if (!authorIconMsg) return;
                                else {
                                    authorIcon = filterURL(authorIconMsg.first().content);
                                    let authorData = { icon_url: authorIcon };
                                    if (authorName) authorData.name = authorName;
                                    embedGen.setAuthor(authorData);
                                }
                            } else {
                                return;
                            }
                        }
                    } else if (choice.content === 'footer') {
                        askEmbed.setDescription(`${footerTextCheck} Texto do Rodapé\n${footerIconCheck} Ícone do Rodapé\n\nEnvie a seguinte mensagem no chat para personalizar o embed:\n**text** - Define o texto do rodapé\n**icon** - Define o ícone do rodapé`);
                        await choice.reply({ embeds: [askEmbed] });

                        let footerMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!footerMsg) return;
                        else {
                            let footerChoice = footerMsg.first();
                            if (footerChoice.content === 'text') {
                                askEmbed.setDescription('Por favor, insira o texto do rodapé');
                                await footerChoice.reply({ embeds: [askEmbed] });

                                let footerTextMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20000,
                                    filter: (msg) => msg.authorId === message.authorId
                                });

                                if (!footerTextMsg) return;
                                else {
                                    footerText = footerTextMsg.first().content;
                                    let footerData = { text: footerText };
                                    if (footerIcon) footerData.icon_url = footerIcon;
                                    embedGen.setFooter(footerData);
                                }
                            } else if (footerChoice.content === 'icon') {
                                askEmbed.setDescription('Por favor, insira o URL do ícone do rodapé');
                                await footerChoice.reply({ embeds: [askEmbed] });

                                let footerIconMsg = await message.channel.awaitMessages({
                                    max: 1,
                                    time: 20000,
                                    filter: (msg) => msg.authorId === message.authorId
                                });

                                if (!footerIconMsg) return;
                                else {
                                    footerIcon = filterURL(footerIconMsg.first().content);
                                    let footerData = { icon_url: footerIcon };
                                    if (footerText) footerData.text = footerText;
                                    embedGen.setFooter(footerData);
                                }
                            } else {
                                return;
                            }
                        }
                    } else if (choice.content === 'title') {
                        askEmbed.setDescription('Por favor, insira o título');
                        await choice.reply({ embeds: [askEmbed] });

                        let titleMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!titleMsg) return;
                        else {
                            title = titleMsg.first().content;
                            embedGen.setTitle(title);
                        }
                    } else if (choice.content === 'desc') {
                        askEmbed.setDescription('Por favor, insira a descrição');
                        await choice.reply({ embeds: [askEmbed] });

                        let descMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!descMsg) return;
                        else {
                            desc = descMsg.first().content;
                            embedGen.setDescription(desc);
                        }
                    } else if (choice.content === 'thumb') {
                        askEmbed.setDescription('Por favor, insira o URL da miniatura');
                        await choice.reply({ embeds: [askEmbed] });

                        let thumbMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!thumbMsg) return;
                        else {
                            thumb = filterURL(thumbMsg.first().content);
                            embedGen.setThumbnail(thumb);
                        }
                    } else if (choice.content === 'image') {
                        askEmbed.setDescription('Por favor, insira o URL da imagem');
                        await choice.reply({ embeds: [askEmbed] });

                        let imageMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!imageMsg) return;
                        else {
                            image = filterURL(imageMsg.first().content);
                            embedGen.setImage(image);
                        }
                    } else if (choice.content === 'channel') {
                        askEmbed.setDescription('Por favor, mencione o canal para enviar o embed');
                        await choice.reply({ embeds: [askEmbed] });

                        let channelMsg = await message.channel.awaitMessages({
                            max: 1,
                            time: 20000,
                            filter: (msg) => msg.authorId === message.authorId
                        });

                        if (!channelMsg || !channelMsg.first().mentions || !channelMsg.first().mentions.channels) return;
                        else {
                            sendChannel = await client.channels.fetch(channelMsg.first().mentions.channels[0].id);
                        }
                    } else {
                        return;
                    }
                }
            }
        } catch (err) {
            message.reply(`⚠️ ${err.message}`);
        }
    }
};
