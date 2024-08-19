module.exports = {
    name: 'cuteness',
    category: 'fun',
    description: 'Avalia a fofura do usuário',
    aliases: [`fofo`],
    run: async (client, message, args) => {
        let result = Math.floor((Math.random() * 101) + 1);
        let emojis = [`😘`, `😍`, `🤩`, `😳`, `🤭`, `👀`, `👄`, `👌`];
        let emoji = emojis[Math.floor(Math.random() * emojis.length)];
        message.reply(`Você é ${result}% fofo ${emoji}`);
    }
}
