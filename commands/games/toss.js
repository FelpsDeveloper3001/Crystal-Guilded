module.exports = {
    name: 'toss',
    category: 'games',
    description: 'Lança uma moeda',
    run: async (client, message, args) => {
        let choices = [
            'Cara',
            'Coroa',
        ];
        let botChoice = choices[Math.floor(Math.random() * 2)];
        message.reply(`🪙 Caiu **${botChoice}**!`);
    }
};
